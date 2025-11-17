/**
 * User Dashboard Page
 * Shows today's workout, quick actions, and recent activity
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography, Grid, Card, CardContent, Button, Stack, Chip } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScaleIcon from '@mui/icons-material/Scale';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { auth } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';
import { prisma } from '@/lib/db';

async function getDashboardData(userId: string) {
  const [activeProgram, recentWorkouts, bodyWeightEntries] = await Promise.all([
    prisma.program.findFirst({
      where: {
        userId,
        isActive: true,
      },
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
    prisma.workoutSession.findMany({
      where: { userId },
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        program: {
          select: {
            name: true,
          },
        },
        programDay: {
          select: {
            displayName: true,
          },
        },
        sets: {
          include: {
            exercise: true,
          },
        },
      },
    }),
    prisma.bodyWeightEntry.findMany({
      where: { userId },
      take: 10,
      orderBy: { date: 'desc' },
    }),
  ]);

  return {
    activeProgram,
    recentWorkouts,
    latestWeight: bodyWeightEntries[0]?.weight,
  };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const data = await getDashboardData(session.user.id);

  return (
    <AppShell session={session}>
      <Stack spacing={3}>
        {/* Welcome Header */}
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {session.user.name?.split(' ')[0] || 'Lifter'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Let's make today count.
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CalendarTodayIcon sx={{ fontSize: 40, color: 'primary.main' }} aria-hidden="true" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Active Program
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {data.activeProgram?.name || 'None'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <FitnessCenterIcon sx={{ fontSize: 40, color: 'primary.main' }} aria-hidden="true" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Recent Workouts
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {data.recentWorkouts.length}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <ScaleIcon sx={{ fontSize: 40, color: 'primary.main' }} aria-hidden="true" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Current Weight
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {data.latestWeight ? `${data.latestWeight.toFixed(1)} kg` : 'Not logged'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} aria-hidden="true" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip label="On Track" color="success" size="small" sx={{ mt: 0.5 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" component={Link} href="/workouts/new" startIcon={<FitnessCenterIcon />}>
                Log Workout
              </Button>
              <Button variant="outlined" component={Link} href="/programs">
                View Programs
              </Button>
              <Button variant="outlined" component={Link} href="/analytics">
                View Analytics
              </Button>
              <Button variant="outlined" component={Link} href="/api/export">
                Export Data
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Workouts
            </Typography>
            {data.recentWorkouts.length > 0 ? (
              <Stack spacing={2} sx={{ mt: 2 }}>
                {data.recentWorkouts.map((workout) => (
                  <Card key={workout.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {workout.programDay?.displayName || 'Free Workout'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(workout.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {workout.sets.length} sets across {new Set(workout.sets.map((s) => s.exerciseId)).size}{' '}
                            exercises
                          </Typography>
                        </Box>
                        {workout.perceivedIntensity && (
                          <Chip
                            label={`Intensity: ${workout.perceivedIntensity}/5`}
                            size="small"
                            color={workout.perceivedIntensity >= 4 ? 'warning' : 'default'}
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No workouts logged yet. Start your first workout!
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Active Program Overview */}
        {data.activeProgram && (
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {data.activeProgram.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {data.activeProgram.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={data.activeProgram.scheduleType} size="small" color="primary" />
                <Chip label="Active" size="small" color="success" />
              </Stack>
              <Button variant="outlined" component={Link} href={`/programs/${data.activeProgram.id}`} size="small">
                View Full Program
              </Button>
            </CardContent>
          </Card>
        )}
      </Stack>
    </AppShell>
  );
}
