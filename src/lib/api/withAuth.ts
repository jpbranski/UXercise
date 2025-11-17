/**
 * Authentication middleware for API routes
 * Validates user session and role-based access control
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
  };
}

type RouteHandler = (req: AuthenticatedRequest, context?: any) => Promise<Response> | Response;

/**
 * Wraps a route handler with authentication check
 * Returns 401 if user is not authenticated
 */
export function withAuth(handler: RouteHandler) {
  return async (req: NextRequest, context?: any) => {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Attach user to request
    const authenticatedReq = req as AuthenticatedRequest;
    authenticatedReq.user = {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.name,
      role: session.user.role,
    };

    return handler(authenticatedReq, context);
  };
}

/**
 * Wraps a route handler with role-based access control
 * Returns 403 if user doesn't have required role
 */
export function withRole(allowedRoles: UserRole | UserRole[], handler: RouteHandler) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return withAuth(async (req, context) => {
    if (!roles.includes(req.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(req, context);
  });
}

/**
 * Check if a user can access another user's data
 * - Admins can access anyone's data
 * - Coaches can access their clients' data
 * - Users can only access their own data
 */
export async function canAccessUserData(
  actorId: string,
  actorRole: UserRole,
  targetUserId: string,
  prisma: any
): Promise<boolean> {
  // Users can access their own data
  if (actorId === targetUserId) {
    return true;
  }

  // Admins can access anyone's data
  if (actorRole === UserRole.ADMIN) {
    return true;
  }

  // Coaches can access their clients' data
  if (actorRole === UserRole.COACH) {
    const relationship = await prisma.coachUserRelationship.findFirst({
      where: {
        coachId: actorId,
        userId: targetUserId,
        status: 'ACTIVE',
      },
    });
    return !!relationship;
  }

  return false;
}
