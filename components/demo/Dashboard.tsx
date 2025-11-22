'use client';

import { Box, Typography, Card, CardContent, Button, Chip, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Workout, WorkoutLogEntry } from '@/lib/demo/types';

interface DashboardProps {
  workouts: Workout[];
  logs: WorkoutLogEntry[];
  onCreateWorkout: () => void;
  onStartWorkout: (workout: Workout) => void;
  onReplayLog: (log: WorkoutLogEntry) => void;
}

export default function Dashboard({
  workouts,
  logs,
  onCreateWorkout,
  onStartWorkout,
  onReplayLog,
}: DashboardProps) {
  // Calculate stats for last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentLogs = logs.filter((log) => new Date(log.performedAt) >= sevenDaysAgo);
  const thisWeekCount = recentLogs.length;
  const totalMinutes = recentLogs.reduce((sum, log) => sum + log.durationMinutes, 0);

  // Get today's scheduled workouts
  const today = now.getDay(); // 0 = Sunday, 6 = Saturday
  const todaysWorkouts = workouts.filter((w) => w.scheduledDays.includes(today));

  // Get most recent logs (last 5)
  const recentWorkoutLogs = [...logs]
    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
    .slice(0, 5);

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Ready to crush your workout?
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #E64A19 100%)',
            color: 'white',
          }}
        >
          <CardContent>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
              {thisWeekCount}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              This Week
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              workouts
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            background: 'linear-gradient(135deg, #9D4EDD 0%, #7B2CBF 100%)',
            color: 'white',
          }}
        >
          <CardContent>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
              {totalMinutes}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Time
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              minutes
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Start Card */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(157,78,221,0.15) 100%)',
          border: '2px solid',
          borderColor: 'primary.main',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(255,107,53,0.3)',
          },
        }}
        onClick={onCreateWorkout}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Create New Workout
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Build your custom routine
            </Typography>
          </Box>
          <IconButton
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 56,
              height: 56,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <AddCircleIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </CardContent>
      </Card>

      {/* Today's Plan */}
      {todaysWorkouts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Today's Plan
          </Typography>
          {todaysWorkouts.map((workout) => {
            const workoutFromList = workouts.find((w) => w.id === workout.id);
            return (
              <Card key={workout.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1 }}>
                        {workout.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                        {workout.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {workout.estimatedDurationMinutes} min • {workout.exercises.length} exercises
                      </Typography>
                    </Box>
                    <IconButton
                      color="primary"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                      onClick={() => workoutFromList && onStartWorkout(workoutFromList)}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Recent Workouts */}
      {recentWorkoutLogs.length > 0 ? (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Recent Workouts
          </Typography>
          {recentWorkoutLogs.map((log) => {
            const performedDate = new Date(log.performedAt);
            const formattedDate = performedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            // Find the workout to get tags (if it still exists)
            const workout = workouts.find((w) => w.id === log.workoutId);

            return (
              <Card key={log.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
                        {log.workoutName}
                      </Typography>
                      {workout && (
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                          {workout.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                      )}
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {log.durationMinutes} min • {log.totalExercises} exercises • {log.totalSets} sets
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 0.5 }}>
                        Performed on {formattedDate}
                      </Typography>
                    </Box>
                    <IconButton
                      color="primary"
                      onClick={() => onReplayLog(log)}
                      sx={{
                        bgcolor: 'rgba(255,107,53,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,107,53,0.2)' },
                      }}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <FitnessCenterIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            No workouts yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Start by creating your first workout!
          </Typography>
          <Button variant="contained" onClick={onCreateWorkout} startIcon={<AddCircleIcon />}>
            Create Workout
          </Button>
        </Box>
      )}
    </Box>
  );
}
