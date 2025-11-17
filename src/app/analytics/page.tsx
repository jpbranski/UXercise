/**
 * Analytics Page
 * Shows body weight trends, workout history, and progressive overload indicators
 */

import { redirect } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { auth } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';
import { BodyWeightChart } from '@/components/analytics/BodyWeightChart';
import { ExerciseVolumeChart } from '@/components/analytics/ExerciseVolumeChart';
import { prisma } from '@/lib/db';

async function getAnalyticsData(userId: string) {
  const [bodyWeightEntries, exercises, workoutSessions] = await Promise.all([
    prisma.bodyWeightEntry.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 90, // Last 90 days
    }),
    prisma.exercise.findMany({
      where: {
        OR: [{ createdByUserId: null }, { createdByUserId: userId }],
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.workoutSession.findMany({
      where: { userId },
      include: {
        sets: {
          where: { isWarmup: false },
          include: {
            exercise: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: 100,
    }),
  ]);

  return {
    bodyWeightEntries,
    exercises,
    workoutSessions,
  };
}

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const data = await getAnalyticsData(session.user.id);

  return (
    <AppShell session={session}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Analytics & Progress
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your body weight, volume trends, and progressive overload.
          </Typography>
        </Box>

        {/* Body Weight Chart */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Body Weight Over Time
            </Typography>
            {data.bodyWeightEntries.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                <BodyWeightChart data={data.bodyWeightEntries} />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No body weight entries yet. Start logging your weight to see trends!
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Exercise Volume Trend */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Exercise Volume Trend
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select an exercise to view weekly volume progression. Increasing volume indicates progressive overload.
            </Typography>

            {data.exercises.length > 0 ? (
              <ExerciseVolumeChart
                exercises={data.exercises}
                workoutSessions={data.workoutSessions}
                userId={session.user.id}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No exercises found in your workout history.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Progressive Overload Indicator */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Progressive Overload Indicators
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These indicators help you understand if you're progressing:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrendingUpIcon sx={{ color: 'success.main' }} aria-label="Trending up" />
                  <Typography variant="body2">
                    <strong>Volume increasing:</strong> You're adding more total weight × reps
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrendingDownIcon sx={{ color: 'warning.main' }} aria-label="Trending down" />
                  <Typography variant="body2">
                    <strong>Volume decreasing:</strong> May indicate deload or fatigue
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Workout Summary */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Workout Summary
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {data.workoutSessions.slice(0, 5).map((workout) => {
                const totalVolume = workout.sets.reduce((sum, set) => {
                  return sum + (set.weight || 0) * set.reps;
                }, 0);

                return (
                  <Card key={workout.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2">
                            {new Date(workout.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {workout.sets.length} sets • Total volume: {totalVolume.toFixed(0)} kg
                          </Typography>
                        </Box>
                        {workout.perceivedIntensity && (
                          <Chip
                            label={`${workout.perceivedIntensity}/5`}
                            size="small"
                            color={workout.perceivedIntensity >= 4 ? 'warning' : 'default'}
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppShell>
  );
}
