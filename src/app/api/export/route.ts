/**
 * Export API route
 * GET /api/export - Export user's complete data as JSON
 */

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/withAuth';
import { withErrorHandling } from '@/lib/api/withErrorHandling';
import { prisma } from '@/lib/db';

export const GET = withErrorHandling(
  withAuth(async (req) => {
    const userId = req.user.id;

    // Fetch all user data
    const [user, programs, exercises, workouts, bodyWeightEntries] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.program.findMany({
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
        },
      }),
      prisma.exercise.findMany({
        where: { createdByUserId: userId },
      }),
      prisma.workoutSession.findMany({
        where: { userId },
        include: {
          sets: {
            include: {
              exercise: true,
            },
          },
        },
      }),
      prisma.bodyWeightEntry.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
      }),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      user,
      programs,
      customExercises: exercises,
      workoutHistory: workouts,
      bodyWeightHistory: bodyWeightEntries,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="uxercise-export-${userId}-${Date.now()}.json"`,
      },
    });
  })
);
