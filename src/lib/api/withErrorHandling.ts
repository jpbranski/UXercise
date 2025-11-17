/**
 * Error handling middleware for API routes
 * Provides consistent error responses and logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

type RouteHandler = (req: NextRequest, context?: any) => Promise<Response> | Response;

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Wraps a route handler with error handling
 * Catches and formats errors into consistent JSON responses
 */
export function withErrorHandling(handler: RouteHandler) {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);

      // Zod validation errors
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: 'Validation error',
            details: error.errors.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      // Custom API errors
      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            error: error.message,
            details: error.details,
          },
          { status: error.statusCode }
        );
      }

      // Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
          return NextResponse.json(
            {
              error: 'Resource already exists',
              details: error.meta,
            },
            { status: 409 }
          );
        }

        // Foreign key constraint violation
        if (error.code === 'P2003') {
          return NextResponse.json(
            {
              error: 'Related resource not found',
              details: error.meta,
            },
            { status: 400 }
          );
        }

        // Record not found
        if (error.code === 'P2025') {
          return NextResponse.json(
            {
              error: 'Resource not found',
              details: error.meta,
            },
            { status: 404 }
          );
        }
      }

      // Generic errors
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  };
}
