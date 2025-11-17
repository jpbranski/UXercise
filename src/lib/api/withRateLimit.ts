/**
 * Rate limiting middleware for API routes
 * Simple in-memory implementation with token bucket algorithm
 *
 * TODO: For production, replace with Redis/Upstash implementation
 * Example: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

// In-memory store (replace with Redis for production)
const rateLimitStore = new Map<string, TokenBucket>();

/**
 * Get client identifier from request
 * Uses IP address or user ID if authenticated
 */
function getClientId(req: NextRequest): string {
  // Try to get IP from headers (Vercel sets x-forwarded-for)
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

  // Could also use user ID from session if authenticated
  return ip;
}

/**
 * Token bucket rate limiter
 */
function checkRateLimit(
  clientId: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let bucket = rateLimitStore.get(clientId);

  if (!bucket) {
    bucket = {
      tokens: config.uniqueTokenPerInterval - 1,
      lastRefill: now,
    };
    rateLimitStore.set(clientId, bucket);
    return { allowed: true, remaining: bucket.tokens };
  }

  // Calculate tokens to add based on time passed
  const timePassed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(timePassed / config.interval) * config.uniqueTokenPerInterval;

  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(
      config.uniqueTokenPerInterval,
      bucket.tokens + tokensToAdd
    );
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return { allowed: true, remaining: bucket.tokens };
  }

  return { allowed: false, remaining: 0 };
}

/**
 * Rate limit middleware wrapper
 * Default: 10 requests per 10 seconds
 */
export function withRateLimit(
  handler: (req: NextRequest, context?: any) => Promise<Response> | Response,
  config: RateLimitConfig = {
    interval: 10 * 1000, // 10 seconds
    uniqueTokenPerInterval: 10, // 10 requests
  }
) {
  return async (req: NextRequest, context?: any) => {
    const clientId = getClientId(req);
    const { allowed, remaining } = checkRateLimit(clientId, config);

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please slow down and try again later',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.uniqueTokenPerInterval.toString(),
            'X-RateLimit-Remaining': '0',
            'Retry-After': Math.ceil(config.interval / 1000).toString(),
          },
        }
      );
    }

    const response = await handler(req, context);

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', config.uniqueTokenPerInterval.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());

    return response;
  };
}

/**
 * Cleanup old entries from rate limit store
 * Should be called periodically (e.g., via cron job)
 */
export function cleanupRateLimitStore(maxAge: number = 60 * 60 * 1000) {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore.entries()) {
    if (now - bucket.lastRefill > maxAge) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => cleanupRateLimitStore(), 60 * 60 * 1000);
}
