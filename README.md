# UXercise 🏋️

**Smart Strength Training for Everyone**

UXercise is a production-quality, mobile-first fitness web application designed for strength training enthusiasts—from novices to semi-serious lifters. Built with modern web technologies, it offers comprehensive workout tracking, program building, and progressive overload analytics.

---

## 🚀 Features

### Core Functionality

- **📅 Program Builder**: Create weekly or bi-weekly (A/B week) training programs with customizable structure
  - Organize by Week → Day → Section → Exercise
  - Support for different training splits (Push/Pull/Legs, Upper/Lower, etc.)
  - Set target sets, reps, RPE, and notes for each exercise

- **💪 Workout Logger**: Quick and efficient workout logging
  - Log sets with weight, reps, and equipment
  - Distinguish warmup vs. working sets
  - Track perceived intensity (1-5 scale) per session
  - Free logging or program-based tracking

- **📊 Analytics & Progressive Overload**:
  - Body weight tracking over time
  - Weekly volume calculations per exercise
  - Progressive overload indicators (volume trends)
  - 1RM estimates (Epley & Brzycki formulas)
  - Visual charts and trend analysis

- **🏃 Exercise Library**:
  - Global exercise database covering all major muscle groups
  - Create custom exercises specific to your needs
  - Filter by muscle group, equipment, and tags

- **👨‍🏫 Coach Features**:
  - Coach-client relationships
  - View and edit client programs
  - Access client workout history and analytics
  - Change log for all modifications

- **📥 Data Export**:
  - Export all your data as JSON
  - Complete workout history, programs, and custom exercises

### Technical Highlights

- **Dark-Only UI** with fox-fur orange (#E25822) accent
- **Mobile-First** responsive design
- **WCAG 2.1 AA** accessibility compliant
- **OAuth Authentication** (Google, Microsoft, Discord)
- **Role-Based Access Control** (User, Coach, Admin)
- **Rate Limiting** for API protection
- **Change Log** for audit trails
- **Comprehensive Testing** (Jest + Playwright)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) + TypeScript |
| **UI** | Material UI (MUI) + MUI Icons |
| **Styling** | MUI Theme System (SX/Styled API) |
| **Font** | Inter (Google Fonts) |
| **Database** | PostgreSQL (Vercel Postgres / Prisma Postgres) |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js (Auth.js v5) |
| **Validation** | Zod |
| **State** | React Hooks + Server Components |
| **Linting/Formatting** | Biome |
| **Testing** | Jest + React Testing Library + Playwright |
| **Charts** | Recharts |
| **Hosting** | Vercel |

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 20+ and npm 10+
- PostgreSQL database (Vercel Postgres recommended)
- OAuth credentials (Google, Microsoft, Discord)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd UXercise
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/uxercise"
PRISMA_DATABASE_URL="postgresql://user:password@localhost:5432/uxercise"

# NextAuth
NEXTAUTH_SECRET="your-secret-here" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

MICROSOFT_CLIENT_ID="your-microsoft-client-id"
MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret"
MICROSOFT_TENANT_ID="common"

DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
NEXT_PUBLIC_ADSENSE_CLIENT_ID=""
```

See `.env.example` for a complete template.

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Tests

```bash
# Unit/component tests
npm test

# E2E tests (requires dev server running)
npm run test:e2e

# Linting
npm run lint
```

---

## 🏗️ Project Structure

```
UXercise/
├── e2e/                      # Playwright E2E tests
├── prisma/
│   ├── schema.prisma         # Prisma schema
│   └── seed.ts               # Database seed script
├── public/
│   ├── robots.txt            # SEO: robots file
│   └── manifest.json         # PWA manifest
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth handlers
│   │   │   ├── exercises/    # Exercise CRUD
│   │   │   ├── programs/     # Program CRUD
│   │   │   ├── workouts/     # Workout logging
│   │   │   ├── export/       # Data export
│   │   │   └── user/         # User profile
│   │   ├── dashboard/        # User dashboard page
│   │   ├── analytics/        # Analytics page
│   │   ├── login/            # Login page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   └── sitemap.ts        # Dynamic sitemap
│   ├── components/
│   │   ├── analytics/        # Chart components
│   │   └── layout/           # AppShell, navigation
│   ├── lib/
│   │   ├── analytics/        # Progressive overload calculations
│   │   ├── api/              # API helpers (auth, rate limit, errors)
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── db.ts             # Prisma client singleton
│   ├── theme/
│   │   └── uxerciseTheme.ts  # MUI dark theme
│   └── env.ts                # Environment validation (Zod)
├── .env.example              # Environment template
├── biome.json                # Biome configuration
├── jest.config.ts            # Jest configuration
├── playwright.config.ts      # Playwright configuration
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## 🎨 Design System

### Theme

- **Mode**: Dark only
- **Primary Color**: Fox-fur orange (`#E25822`)
- **Background**: Very dark (`#050608`)
- **Paper**: Slightly lighter dark (`#0E1117`)
- **Text Primary**: Off-white (`#E8E8E8`)
- **Text Secondary**: Muted gray (`#9E9E9E`)

### Typography

- **Font**: Inter
- **Scale**: h1-h6, body1-2, button, caption

### Components

- **Border Radius**: 12px (rounded corners)
- **Shadows**: Tasteful, light shadows on cards/modals
- **Focus Outlines**: Visible 2px fox-fur orange outlines for accessibility

---

## 📊 Domain Model

### Users & Roles

- **USER**: Regular users who can create programs and log workouts
- **COACH**: Can view/edit client data via coach-client relationships
- **ADMIN**: Full access to all users and data

### Core Entities

1. **Program**: Container for weekly/bi-weekly training plans
2. **ProgramWeek**: Represents weeks (A/B for bi-weekly)
3. **ProgramDay**: Training days within a week
4. **ProgramSection**: Sections within a day (e.g., "Warm-up", "Main Lifts")
5. **ProgramExercise**: Exercises within a section with target sets/reps/RPE
6. **Exercise**: Global or user-created exercises
7. **WorkoutSession**: Logged workout with date, intensity, notes
8. **WorkoutSet**: Individual sets logged in a session
9. **BodyWeightEntry**: Body weight measurements over time
10. **ChangeLogEntry**: Audit trail for all data mutations

---

## 🔐 Authentication & Authorization

### OAuth Providers

- Google
- Microsoft (Azure AD)
- Discord

### Role-Based Access Control (RBAC)

- **Users**: Can only access their own data
- **Coaches**: Can access their clients' data (via CoachUserRelationship)
- **Admins**: Can access all user data

### API Security

- All API routes protected with `withAuth` middleware
- Rate limiting via token bucket algorithm
- Input validation with Zod schemas
- Change log for audit trails

---

## 📈 Analytics & Progressive Overload

The analytics module (`src/lib/analytics/progressiveOverload.ts`) provides:

- **Volume Calculation**: `weight × reps` per set (excluding warmups)
- **Weekly Volume Trends**: Aggregate volume per exercise per week
- **Progressive Overload Detection**: Compare current week vs. previous week
- **1RM Estimation**: Epley and Brzycki formulas
- **Muscle Group Volume**: Total volume per primary muscle group

### Usage Example

```typescript
import { calculateWeeklyVolume } from '@/lib/analytics/progressiveOverload';

const weeklyVolumes = calculateWeeklyVolume(setsWithWorkoutSessions);
// Returns array of weekly volume data with percent changes
```

---

## 🧪 Testing

### Unit Tests (Jest)

Located in `src/lib/analytics/progressiveOverload.test.ts`

```bash
npm test
```

### E2E Tests (Playwright)

Located in `e2e/landing.spec.ts`

```bash
# Run in UI mode
npm run test:e2e:ui

# Run headless
npm run test:e2e
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Import project from GitHub
   - Configure environment variables (all vars from `.env.local`)
   - Deploy

3. **Database Migrations**:
   - Vercel automatically runs `npm run postinstall` (which runs `prisma generate`)
   - For migrations, use Prisma Migrate or Prisma DB Push:
     ```bash
     npx prisma migrate deploy
     ```

4. **Seed Production Database** (optional):
   ```bash
   npm run db:seed
   ```

### Environment Variables on Vercel

Add all variables from `.env.example` in Vercel dashboard:
- Database URLs
- NextAuth secret & URL
- OAuth credentials (production keys)
- Analytics IDs (optional)

---

## 🛣️ API Routes

### Authentication
- `POST /api/auth/signin` - Sign in with OAuth
- `POST /api/auth/signout` - Sign out

### User
- `GET /api/user` - Get current user profile

### Exercises
- `GET /api/exercises` - List exercises (global + user's custom)
- `POST /api/exercises` - Create custom exercise

### Programs
- `GET /api/programs` - List user's programs
- `POST /api/programs` - Create new program

### Workouts
- `GET /api/workouts` - List workout sessions
- `POST /api/workouts` - Create workout session with sets

### Export
- `GET /api/export` - Export user data as JSON

---

## 🎯 Future Enhancements

- **Tauri Desktop App**: Wrap as native desktop app
- **Additional Charts**: Strength curves, periodization views
- **Social Features**: Share workouts, follow friends
- **Media Uploads**: Exercise form videos
- **Device Integrations**: Smart watch sync, barbell sensors
- **Advanced Analytics**: Machine learning for plateau detection
- **Mobile App**: React Native version

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Type check
npm run type-check
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Next.js Team**: For an incredible framework
- **Prisma Team**: For the best TypeScript ORM
- **MUI Team**: For beautiful, accessible components
- **NextAuth.js**: For painless authentication
- **Vercel**: For seamless hosting

---

## 📞 Support

For issues or questions:

- Open an issue on GitHub
- Check the documentation in `/docs`
- Contact: support@uxercise.com (if applicable)

---

**Built with 💪 for lifters, by lifters.**
