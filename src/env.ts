/**
 * Environment variable validation using Zod
 * This file validates all required environment variables at startup
 * and provides type-safe access to them throughout the application
 */

import { z } from 'zod';

// Skip validation during build if SKIP_ENV_VALIDATION is set
const skipValidation = process.env.SKIP_ENV_VALIDATION === '1';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  PRISMA_DATABASE_URL: z.string().url(),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url(),

  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  MICROSOFT_CLIENT_ID: z.string().min(1),
  MICROSOFT_CLIENT_SECRET: z.string().min(1),
  MICROSOFT_TENANT_ID: z.string().default('common'),

  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),

  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const clientEnvSchema = z.object({
  // Public environment variables (NEXT_PUBLIC_*)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: z.string().optional(),
});

/**
 * Server-side environment variables
 * These are only available on the server and should never be exposed to the client
 */
export const env = skipValidation
  ? (envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/uxercise',
      PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL || 'postgresql://localhost:5432/uxercise',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'dummy-secret-at-least-32-chars-long-for-build',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'dummy-secret',
      MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID || 'dummy-client-id',
      MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET || 'dummy-secret',
      MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || 'dummy-client-id',
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || 'dummy-secret',
      NODE_ENV: process.env.NODE_ENV,
    }) as z.infer<typeof envSchema>)
  : envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
      MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
      MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID,
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    });

/**
 * Client-side environment variables
 * These are safe to expose to the browser
 */
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
});

// Type exports for autocomplete
export type Env = z.infer<typeof envSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
