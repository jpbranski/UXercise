/**
 * User API routes
 * GET /api/user - Get current user profile
 */

import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/api/withAuth';
import { withErrorHandling } from '@/lib/api/withErrorHandling';
import { prisma } from '@/lib/db';

export const GET = withErrorHandling(
  withAuth(async (req) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  })
);
