# UXercise Architecture

This document provides a high-level overview of the UXercise application architecture, key design decisions, and how to extend the system.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Domain Model](#domain-model)
4. [API Design](#api-design)
5. [Authentication & Authorization](#authentication--authorization)
6. [Progressive Overload Analytics](#progressive-overload-analytics)
7. [State Management](#state-management)
8. [Styling & Theming](#styling--theming)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Architecture](#deployment-architecture)
11. [Extending the System](#extending-the-system)

---

## System Overview

UXercise is a **full-stack web application** built as a **monolithic Next.js app** using the **App Router**. It follows a **server-first** architecture where most data fetching happens on the server, with selective client-side interactivity.

### Key Characteristics

- **Mobile-First**: Optimized for mobile viewports, scales up to desktop
- **Dark-Only**: Single dark theme with accessibility focus
- **Type-Safe**: End-to-end TypeScript with Prisma for database types
- **RESTful API**: JSON API routes for all CRUD operations
- **Server Components**: Leverages React Server Components for performance

---

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Server Components + Client)     │
│  - Pages (app/*)                        │
│  - Components (components/*)            │
│  - MUI Theming                          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (API Routes + Business Logic)          │
│  - Route Handlers (app/api/*)           │
│  - Middleware (auth, rate limit)        │
│  - Analytics (lib/analytics/*)          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│  (Prisma ORM + Database)                │
│  - Prisma Client (lib/db.ts)            │
│  - Schema (prisma/schema.prisma)        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         PostgreSQL Database             │
│  (Vercel Postgres / Prisma Postgres)    │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

1. **Presentation**: UI rendering, user interactions, charts
2. **Application**: Business logic, API endpoints, validation
3. **Data Access**: Database queries, ORM operations
4. **Database**: Data persistence, constraints, indexes

---

## Domain Model

UXercise uses a **hierarchical program structure** and **temporal workout logging**.

### Program Hierarchy

```
Program (e.g., "Push/Pull/Legs")
  ├── ProgramWeek (Week A, Week B for bi-weekly)
  │   └── ProgramDay (e.g., "Push Day" on Monday)
  │       └── ProgramSection (e.g., "Warm-up", "Main Lifts")
  │           └── ProgramExercise (e.g., "Bench Press 4x6-8")
  │               └── Exercise (e.g., "Barbell Bench Press")
```

### Workout Logging

```
WorkoutSession (date, intensity, notes)
  └── WorkoutSet (exercise, weight, reps, equipment, isWarmup)
```

### Key Relationships

- **User → Programs**: One-to-many (user owns programs)
- **User ↔ Coach**: Many-to-many via `CoachUserRelationship`
- **Program → WorkoutSessions**: One-to-many (optional link)
- **Exercise → WorkoutSets**: One-to-many (tracks usage)

### Design Decisions

**Why this structure?**

1. **Flexibility**: Users can create any program structure (PPL, U/L, etc.)
2. **Reusability**: Exercises are reusable across programs
3. **Temporal Separation**: Programs are templates, workouts are instances
4. **Coach Support**: Coaches can create programs for clients

**Trade-offs:**

- **Complexity**: More tables than a flat structure
- **Performance**: Requires joins for full program retrieval (mitigated by Prisma includes)

---

## API Design

### REST Principles

- **Resource-based URLs**: `/api/programs`, `/api/workouts`
- **HTTP methods**: GET (read), POST (create), PUT/PATCH (update), DELETE
- **JSON responses**: Consistent error format

### API Middleware Stack

All API routes compose middleware for cross-cutting concerns:

```typescript
export const POST = withErrorHandling(
  withRateLimit(
    withAuth(async (req) => {
      // Your route logic here
    })
  )
);
```

**Middleware Order (outside-in):**

1. **Error Handling**: Catches all errors, formats responses
2. **Rate Limiting**: Token bucket per IP/user
3. **Authentication**: Validates session, attaches user
4. **Authorization**: Role-based checks (inside route logic)

### Validation

All request bodies validated with **Zod schemas**:

```typescript
const createProgramSchema = z.object({
  name: z.string().min(1).max(100),
  scheduleType: z.nativeEnum(ScheduleType),
});

const data = createProgramSchema.parse(await req.json());
```

### Change Logging

All mutations create a `ChangeLogEntry`:

```typescript
await logProgramChange(
  actorId,
  targetUserId,
  'CREATE',
  program.id,
  program.name
);
```

---

## Authentication & Authorization

### NextAuth.js (Auth.js v5)

- **Adapter**: Prisma adapter for database sessions
- **Providers**: Google, Microsoft, Discord
- **Strategy**: Database sessions (not JWT)

### Session Flow

```
1. User clicks "Sign in with Google"
2. OAuth redirect to Google
3. Google returns with code
4. NextAuth exchanges code for user info
5. User created/updated in database
6. Session created and stored in database
7. Session cookie sent to browser
```

### Authorization Helpers

```typescript
// Check if user can access another user's data
await canAccessUserData(actorId, actorRole, targetUserId, prisma);
```

**Rules:**

- Users can access their own data
- Coaches can access their clients' data
- Admins can access all data (except cannot be modified by coaches)

---

## Progressive Overload Analytics

Located in `src/lib/analytics/progressiveOverload.ts`.

### Core Concepts

**Volume**: `weight × reps` (excluding warmup sets)

**Weekly Volume**: Sum of volume for an exercise in a calendar week (Monday-Sunday)

**Progressive Overload**: Increasing volume over time

### Calculations

```typescript
// Calculate volume for a set
const volume = weight * reps;

// Calculate weekly volumes with percent changes
const weeklyVolumes = calculateWeeklyVolume(sets);
// Returns: [{ week, volume, percentChange }, ...]

// Estimate 1RM (Epley formula)
const oneRepMax = weight * (1 + reps / 30);
```

### Chart Integration

- **Body Weight Chart**: Line chart (Recharts) of weight over time
- **Exercise Volume Chart**: Line chart of weekly volume per exercise
- **Trends**: Color-coded up/down indicators

### Extension Points

- Add **muscle group volume** charts
- Implement **periodization detection** (volume/intensity waves)
- Add **strength standards** comparison (novice/intermediate/advanced)

---

## State Management

UXercise uses a **server-first** state management approach:

### Data Fetching

- **Server Components**: Fetch data directly in page components (no loading states needed)
- **API Routes**: Client components call API routes via fetch

### Client State

- **Local State**: `useState` for form inputs, UI toggles
- **No Global Store**: React hooks are sufficient for this app's scope

### Mutations

Client components use **Server Actions** or **API routes**:

```typescript
// Server Action (recommended)
async function createProgram(formData: FormData) {
  'use server';
  // Mutation logic
}

// Or API route
await fetch('/api/programs', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

---

## Styling & Theming

### MUI Theme System

All styling via **MUI's SX prop** and **styled API**:

```typescript
<Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2 }}>
  Content
</Box>
```

### Theme Structure

Defined in `src/theme/uxerciseTheme.ts`:

- **Palette**: Colors (primary, secondary, error, etc.)
- **Typography**: Font family, size scale
- **Components**: Overrides for buttons, cards, etc.
- **Shape**: Border radius

### Accessibility

- **Focus Outlines**: 2px fox-fur orange
- **Color Contrast**: WCAG 2.1 AA compliant
- **Keyboard Navigation**: All interactive elements reachable
- **ARIA Labels**: On icon-only buttons, charts

---

## Testing Strategy

### Unit Tests (Jest)

- **Location**: `*.test.ts` files alongside source
- **Coverage**: Analytics functions, validation schemas
- **Mocking**: Next.js router, NextAuth

### Component Tests (React Testing Library)

- **Location**: `*.test.tsx` files
- **Coverage**: Key user interactions, form submissions
- **Strategy**: Test behavior, not implementation

### E2E Tests (Playwright)

- **Location**: `e2e/` directory
- **Coverage**: Critical flows (landing, login, dashboard)
- **Strategy**: Test from user perspective, all browsers

### Running Tests

```bash
npm test           # Unit + component
npm run test:e2e   # E2E (requires dev server)
```

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────┐
│   Vercel Edge   │  (Global CDN)
└────────┬────────┘
         │
┌────────▼────────┐
│  Next.js Server │  (Serverless Functions)
└────────┬────────┘
         │
┌────────▼────────┐
│ Vercel Postgres │  (Managed PostgreSQL)
└─────────────────┘
```

### Environment Variables

- **Build-time**: Validated by `src/env.ts` at startup
- **Runtime**: Injected by Vercel

### Database Migrations

- **Development**: `npm run db:migrate` (Prisma Migrate)
- **Production**: Run `prisma migrate deploy` manually or via CI/CD

---

## Extending the System

### Adding a New Exercise Property

1. **Update Prisma schema**:
   ```prisma
   model Exercise {
     // Add new field
     difficulty String? // e.g., "beginner", "intermediate"
   }
   ```

2. **Create migration**:
   ```bash
   npm run db:migrate
   ```

3. **Update API schemas**:
   ```typescript
   const createExerciseSchema = z.object({
     difficulty: z.string().optional(),
   });
   ```

4. **Update UI**: Add form field in exercise creator

### Adding a New OAuth Provider

1. **Get OAuth credentials** from provider
2. **Add to `src/lib/auth.ts`**:
   ```typescript
   import GitHub from 'next-auth/providers/github';

   providers: [
     GitHub({
       clientId: env.GITHUB_CLIENT_ID,
       clientSecret: env.GITHUB_CLIENT_SECRET,
     }),
   ];
   ```
3. **Update `src/env.ts`**: Add validation
4. **Add button** to login page

### Adding a New Role

1. **Update Prisma enum**:
   ```prisma
   enum UserRole {
     USER
     COACH
     ADMIN
     NUTRITIONIST // New role
   }
   ```

2. **Update authorization logic** in `withRole`, `canAccessUserData`
3. **Add UI** for role-specific features

---

## Performance Considerations

### Database

- **Indexes**: On frequently queried fields (userId, date, exerciseId)
- **Connection pooling**: Handled by Vercel Postgres
- **N+1 prevention**: Use Prisma `include` strategically

### Frontend

- **Server Components**: Default for data fetching
- **Code splitting**: Next.js automatically splits routes
- **Image optimization**: Use `next/image` for avatars/icons
- **Font loading**: Inter loaded via `next/font`

### API

- **Rate limiting**: In-memory token bucket (TODO: Redis in production)
- **Caching**: Add Redis for frequently accessed data (e.g., global exercises)

---

## Security Considerations

### Input Validation

- **Zod schemas** on all API inputs
- **Prisma** prevents SQL injection
- **NextAuth** handles OAuth securely

### Authentication

- **HttpOnly cookies**: Session tokens not accessible via JavaScript
- **CSRF protection**: Built into NextAuth

### Authorization

- **Role checks** on every protected route
- **Coach-client relationship** validation before data access

### Rate Limiting

- **Per-IP limits** on auth routes
- **Per-user limits** on write-heavy routes

---

## Monitoring & Observability

### Logging

- **Console logs**: Development only
- **Production**: Add structured logging (e.g., Winston, Pino)

### Error Tracking

- **Sentry** (recommended): Add to `lib/api/withErrorHandling.ts`

### Analytics

- **Google Analytics**: Integrated via `src/app/layout.tsx`
- **Custom events**: Track key user actions (workout logged, program created)

---

## Conclusion

UXercise is designed as a **production-ready**, **extensible**, and **maintainable** fitness tracking application. The architecture prioritizes **type safety**, **accessibility**, and **developer experience** while remaining simple enough for rapid iteration.

For questions or contributions, see the main [README.md](../README.md).
