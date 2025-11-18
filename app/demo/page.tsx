'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import { DAYS_OF_WEEK, DayOfWeek } from '@/types/workout';

export default function DemoPage() {
  const { data, setData, resetData, isLoaded } = useWorkoutData();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [currentWeek, setCurrentWeek] = useState<'single' | 'a' | 'b'>('single');

  if (!isLoaded) {
    return (
      <Container>
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  const getCurrentWeek = () => {
    if (data.mode === 'single') return data.singleWeek;
    return currentWeek === 'a' ? data.aWeek : data.bWeek;
  };

  const getCurrentDay = () => {
    const week = getCurrentWeek();
    return week[selectedDay];
  };

  const toggleOffDay = () => {
    const week = getCurrentWeek();
    const newWeek = {
      ...week,
      [selectedDay]: {
        ...week[selectedDay],
        isOffDay: !week[selectedDay].isOffDay,
        sections: week[selectedDay].isOffDay ? [] : week[selectedDay].sections,
      },
    };

    if (data.mode === 'single') {
      setData({ ...data, singleWeek: newWeek });
    } else if (currentWeek === 'a') {
      setData({ ...data, aWeek: newWeek });
    } else {
      setData({ ...data, bWeek: newWeek });
    }
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all workout data? This cannot be undone.')) {
      resetData();
    }
  };

  const currentDay = getCurrentDay();

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="sm">
        {/* Phone Frame */}
        <Paper
          elevation={8}
          sx={{
            bgcolor: 'background.default',
            borderRadius: 4,
            overflow: 'hidden',
            border: '8px solid #1a1a1a',
            minHeight: '80vh',
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Workout Planner
              </Typography>
              <IconButton onClick={handleResetData} size="small" color="error">
                <RestartAltIcon />
              </IconButton>
            </Box>

            <Alert severity="warning" sx={{ mb: 2, fontSize: '0.85rem' }}>
              Demo prototype - Data stored locally in your browser
            </Alert>

            {/* Mode Toggle */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                Planning Mode:
              </Typography>
              <ToggleButtonGroup
                value={data.mode}
                exclusive
                onChange={(_, newMode) => newMode && setData({ ...data, mode: newMode })}
                size="small"
                fullWidth
              >
                <ToggleButton value="single">Single Week</ToggleButton>
                <ToggleButton value="ab">A/B Weeks</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* A/B Week Tabs */}
            {data.mode === 'ab' && (
              <Tabs
                value={currentWeek}
                onChange={(_, newWeek) => setCurrentWeek(newWeek)}
                sx={{ mb: 2 }}
              >
                <Tab label="Week A" value="a" />
                <Tab label="Week B" value="b" />
              </Tabs>
            )}

            {/* Day Selector */}
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ display: 'flex', gap: 1, minWidth: 'max-content' }}>
                {DAYS_OF_WEEK.map((day) => (
                  <Chip
                    key={day}
                    label={day.slice(0, 3).toUpperCase()}
                    onClick={() => setSelectedDay(day)}
                    color={selectedDay === day ? 'primary' : 'default'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch checked={currentDay.isOffDay} onChange={toggleOffDay} />}
                label={`${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} is an off day`}
              />
            </Box>

            {!currentDay.isOffDay && (
              <>
                {currentDay.sections.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      No sections added yet
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      This is a simplified demo. Full section/exercise management coming soon!
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {currentDay.sections.map((section, idx) => (
                      <Card key={section.id} sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                              {section.name}
                            </Typography>
                            <Chip
                              label={section.type}
                              size="small"
                              color={section.type === 'interval' ? 'secondary' : 'default'}
                            />
                          </Box>

                          {section.exercises.map((exercise, exIdx) => (
                            <Box key={exIdx} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {exercise.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {exercise.sets.map((s) =>
                                  `${s.sets}×${s.reps}${s.weight ? ` @ ${s.weight} lbs` : ''}`
                                ).join(', ')}
                              </Typography>
                            </Box>
                          ))}

                          {section.type === 'interval' && (
                            <Typography variant="caption" color="secondary.main">
                              {section.toFailure
                                ? 'To failure'
                                : `${section.intervalCount} intervals × ${section.duration}s`}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    Simplified Demo - Full builder coming soon
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Try the default Monday/Wednesday/Friday workouts!
                  </Typography>
                </Box>
              </>
            )}

            {currentDay.isOffDay && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  Rest Day
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recovery is just as important as training
                </Typography>
              </Box>
            )}
          </Box>

          {/* Bottom Navigation */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Button size="small">Home</Button>
            <Button size="small" variant="contained" color="primary">
              Builder
            </Button>
            <Button size="small">Profile</Button>
          </Box>
        </Paper>

        {/* Instructions */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            This is a demo prototype of the workout planner.
            <br />
            Full features include: exercise selection, section management, weekly summaries, and analytics.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
