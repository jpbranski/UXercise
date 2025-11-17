/**
 * Workout Sessions API routes
 * GET /api/workouts - List workout sessions
 * POST /api/workouts - Create workout session with sets
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/api/withAuth';
import { withErrorHandling } from '@/lib/api/withErrorHandling';
import { withRateLimit } from '@/lib/api/withRateLimit';
import { canAccessUserData } from '@/lib/api/withAuth';
import { logWorkoutChange } from '@/lib/api/changeLog';
import { prisma } from '@/lib/db';
import { ActionType } from '@/types/prisma';

const workoutSetSchema = z.object({
  exerciseId: z.string(),
  programExerciseId: z.string().optional(),
  setNumber: z.number().int().positive(),
  weight: z.number().nonnegative().optional(),
  reps: z.number().int().positive(),
  equipmentUsed: z.string().optional(),
  isWarmup: z.boolean().default(false),
});

const createWorkoutSchema = z.object({
  programId: z.string().optional(),
  programDayId: z.string().optional(),
  date: z.string().datetime().optional(),
  perceivedIntensity: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
  sets: z.array(workoutSetSchema).min(1),
  userId: z.string().optional(), // For coaches logging workouts for clients
});

export const GET = withErrorHandling(
  withAuth(async (req) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || req.user.id;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Check access permissions
    const hasAccess = await canAccessUserData(req.user.id, req.user.role, userId, prisma);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const workouts = await prisma.workoutSession.findMany({
      where: { userId },
      include: {
        sets: {
          include: {
            exercise: true,
          },
        },
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        programDay: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(workouts);
  })
);

export const POST = withErrorHandling(
  withRateLimit(
    withAuth(async (req) => {
      const body = await req.json();
      const data = createWorkoutSchema.parse(body);

      const targetUserId = data.userId || req.user.id;

      // Check permissions
      const hasAccess = await canAccessUserData(req.user.id, req.user.role, targetUserId, prisma);
      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Create workout session with sets
      const workout = await prisma.workoutSession.create({
        data: {
          userId: targetUserId,
          programId: data.programId,
          programDayId: data.programDayId,
          date: data.date ? new Date(data.date) : new Date(),
          perceivedIntensity: data.perceivedIntensity,
          notes: data.notes,
          sets: {
            create: data.sets,
          },
        },
        include: {
          sets: {
            include: {
              exercise: true,
            },
          },
        },
      });

      // Log change
      await logWorkoutChange(req.user.id, targetUserId, ActionType.CREATE, workout.id, workout.date, {
        setsCount: data.sets.length,
        perceivedIntensity: data.perceivedIntensity,
      });

      return NextResponse.json(workout, { status: 201 });
    }),
    {
      interval: 60 * 1000,
      uniqueTokenPerInterval: 30, // Allow frequent workout logging
    }
  )
);
