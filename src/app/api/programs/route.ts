/**
 * Programs API routes
 * GET /api/programs - List user's programs
 * POST /api/programs - Create new program
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/api/withAuth';
import { withErrorHandling } from '@/lib/api/withErrorHandling';
import { withRateLimit } from '@/lib/api/withRateLimit';
import { canAccessUserData } from '@/lib/api/withAuth';
import { logProgramChange } from '@/lib/api/changeLog';
import { prisma } from '@/lib/db';
import { ScheduleType, ActionType } from '@/types/prisma';

const createProgramSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  scheduleType: z.nativeEnum(ScheduleType),
  isActive: z.boolean().default(false),
  userId: z.string().optional(), // For coaches creating programs for clients
});

export const GET = withErrorHandling(
  withAuth(async (req) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || req.user.id;

    // Check access permissions
    const hasAccess = await canAccessUserData(req.user.id, req.user.role, userId, prisma);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const programs = await prisma.program.findMany({
      where: { userId },
      include: {
        weeks: {
          include: {
            days: {
              include: {
                sections: {
                  include: {
                    exercises: {
                      include: {
                        exercise: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        createdByCoach: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(programs);
  })
);

export const POST = withErrorHandling(
  withRateLimit(
    withAuth(async (req) => {
      const body = await req.json();
      const data = createProgramSchema.parse(body);

      const targetUserId = data.userId || req.user.id;

      // Check if user can create program for target user
      const hasAccess = await canAccessUserData(req.user.id, req.user.role, targetUserId, prisma);
      if (!hasAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const program = await prisma.program.create({
        data: {
          name: data.name,
          description: data.description,
          scheduleType: data.scheduleType,
          isActive: data.isActive,
          userId: targetUserId,
          createdByCoachId: req.user.id !== targetUserId ? req.user.id : null,
        },
      });

      // Log change
      await logProgramChange(req.user.id, targetUserId, ActionType.CREATE, program.id, program.name, {
        scheduleType: program.scheduleType,
      });

      return NextResponse.json(program, { status: 201 });
    }),
    {
      interval: 60 * 1000,
      uniqueTokenPerInterval: 10,
    }
  )
);
