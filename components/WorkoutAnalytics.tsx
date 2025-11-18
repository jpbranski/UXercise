'use client';

import { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, LinearProgress } from '@mui/material';
import { WorkoutWeek } from '@/types/workout';

interface WorkoutAnalyticsProps {
  week: WorkoutWeek;
}

export default function WorkoutAnalytics({ week }: WorkoutAnalyticsProps) {
  const stats = useMemo(() => {
    const days = Object.values(week);
    const workingDays = days.filter((d) => !d.isOffDay);

    let totalSets = 0;
    const typeBreakdown: Record<string, number> = {
      push: 0,
      pull: 0,
      legs: 0,
      core: 0,
      cardio: 0,
    };

    workingDays.forEach((day) => {
      day.sections.forEach((section) => {
        section.exercises.forEach((ex) => {
          ex.sets.forEach((s) => {
            totalSets += s.sets;
          });
        });
      });
    });

    // Simplified type breakdown (would need exercise data to be accurate)
    workingDays.forEach((day) => {
      day.sections.forEach((section) => {
        if (section.name.toLowerCase().includes('push') || section.name.toLowerCase().includes('chest')) {
          typeBreakdown.push += section.exercises.length;
        } else if (section.name.toLowerCase().includes('pull') || section.name.toLowerCase().includes('back')) {
          typeBreakdown.pull += section.exercises.length;
        } else if (section.name.toLowerCase().includes('lower') || section.name.toLowerCase().includes('leg')) {
          typeBreakdown.legs += section.exercises.length;
        } else if (section.name.toLowerCase().includes('core') || section.name.toLowerCase().includes('ab')) {
          typeBreakdown.core += section.exercises.length;
        }
      });
    });

    return {
      workingDays: workingDays.length,
      restDays: days.length - workingDays.length,
      totalSets,
      totalExercises: workingDays.reduce(
        (sum, day) => sum + day.sections.reduce((s, sec) => s + sec.exercises.length, 0),
        0
      ),
      typeBreakdown,
    };
  }, [week]);

  const maxType = Math.max(...Object.values(stats.typeBreakdown));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Weekly Summary
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card sx={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
            <CardContent>
              <Typography variant="h4" color="primary.main">
                {stats.workingDays}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Training Days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ backgroundColor: 'rgba(157, 78, 221, 0.1)' }}>
            <CardContent>
              <Typography variant="h4" color="secondary.main">
                {stats.totalSets}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Sets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
        Exercise Type Distribution
      </Typography>

      {Object.entries(stats.typeBreakdown).map(([type, count]) => (
        <Box key={type} sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
              {type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {count}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={maxType > 0 ? (count / maxType) * 100 : 0}
            sx={{ height: 6, borderRadius: 1 }}
          />
        </Box>
      ))}
    </Box>
  );
}
