/**
 * Exercises API routes
 * GET /api/exercises - List exercises (global + user's custom)
 * POST /api/exercises - Create custom exercise
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/api/withAuth';
import { withErrorHandling } from '@/lib/api/withErrorHandling';
import { withRateLimit } from '@/lib/api/withRateLimit';
import { logExerciseChange } from '@/lib/api/changeLog';
import { prisma } from '@/lib/db';
import { MuscleGroup, ActionType } from '@/types/prisma';

const createExerciseSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  primaryMuscleGroup: z.nativeEnum(MuscleGroup),
  secondaryMuscleGroups: z.array(z.string()).default([]),
  defaultEquipment: z.string().default('bodyweight'),
  tags: z.array(z.string()).default([]),
});

export const GET = withErrorHandling(
  withAuth(async (req) => {
    const { searchParams } = new URL(req.url);
    const muscleGroup = searchParams.get('muscleGroup');
    const search = searchParams.get('search');

    const where: any = {
      OR: [
        { createdByUserId: null }, // Global exercises
        { createdByUserId: req.user.id }, // User's custom exercises
      ],
    };

    if (muscleGroup) {
      where.primaryMuscleGroup = muscleGroup;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: [{ createdByUserId: 'asc' }, { name: 'asc' }],
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(exercises);
  })
);

export const POST = withErrorHandling(
  withRateLimit(
    withAuth(async (req) => {
      const body = await req.json();
      const data = createExerciseSchema.parse(body);

      const exercise = await prisma.exercise.create({
        data: {
          ...data,
          createdByUserId: req.user.id,
        },
      });

      // Log change
      await logExerciseChange(req.user.id, req.user.id, ActionType.CREATE, exercise.id, exercise.name, {
        primaryMuscleGroup: exercise.primaryMuscleGroup,
      });

      return NextResponse.json(exercise, { status: 201 });
    }),
    {
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 20, // 20 creates per minute
    }
  )
);
