/**
 * Exercise Volume Chart Component
 * Shows weekly volume trend for a selected exercise
 */

'use client';

import { useState, useMemo } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Stack, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { calculateWeeklyVolume } from '@/lib/analytics/progressiveOverload';

interface ExerciseVolumeChartProps {
  exercises: { id: string; name: string }[];
  workoutSessions: any[];
  userId: string;
}

export function ExerciseVolumeChart({ exercises, workoutSessions }: ExerciseVolumeChartProps) {
  const theme = useTheme();
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0]?.id || '');

  const chartData = useMemo(() => {
    if (!selectedExerciseId) return [];

    // Get all sets for the selected exercise
    const setsForExercise = workoutSessions.flatMap((session) =>
      session.sets
        .filter((set: any) => set.exerciseId === selectedExerciseId)
        .map((set: any) => ({
          ...set,
          workoutSession: { date: session.date },
        }))
    );

    if (setsForExercise.length === 0) return [];

    // Calculate weekly volumes
    const weeklyVolumes = calculateWeeklyVolume(setsForExercise);

    return weeklyVolumes.map((week) => ({
      week: `${week.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      volume: week.volume,
      percentChange: week.percentChange,
    }));
  }, [selectedExerciseId, workoutSessions]);

  const latestTrend = chartData.length > 0 ? chartData[chartData.length - 1].percentChange : null;

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="exercise-select-label">Select Exercise</InputLabel>
        <Select
          labelId="exercise-select-label"
          value={selectedExerciseId}
          label="Select Exercise"
          onChange={(e) => setSelectedExerciseId(e.target.value)}
        >
          {exercises.map((exercise) => (
            <MenuItem key={exercise.id} value={exercise.id}>
              {exercise.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {chartData.length > 0 ? (
        <>
          {latestTrend !== null && latestTrend !== undefined && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              {latestTrend > 0 ? (
                <TrendingUpIcon sx={{ color: 'success.main' }} aria-label="Trending up" />
              ) : (
                <TrendingDownIcon sx={{ color: 'warning.main' }} aria-label="Trending down" />
              )}
              <Typography
                variant="body2"
                color={latestTrend > 0 ? 'success.main' : 'warning.main'}
                fontWeight={600}
              >
                {latestTrend > 0 ? '+' : ''}
                {latestTrend.toFixed(1)}% from last week
              </Typography>
            </Stack>
          )}

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="week" stroke={theme.palette.text.secondary} style={{ fontSize: '12px' }} />
              <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
                labelStyle={{ color: theme.palette.text.primary }}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ fill: theme.palette.primary.main, r: 4 }}
                activeDot={{ r: 6 }}
                name="Volume (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No data available for this exercise.
        </Typography>
      )}
    </Box>
  );
}
