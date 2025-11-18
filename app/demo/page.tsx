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
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import { DAYS_OF_WEEK, DayOfWeek, Section } from '@/types/workout';
import SectionEditor from '@/components/SectionEditor';
import WorkoutAnalytics from '@/components/WorkoutAnalytics';

export default function DemoPage() {
  const { data, setData, resetData, isLoaded } = useWorkoutData();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [currentWeek, setCurrentWeek] = useState<'single' | 'a' | 'b'>('single');
  const [view, setView] = useState<'builder' | 'summary'>('builder');
  const [sectionEditorOpen, setSectionEditorOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | undefined>();
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; sectionId: string } | null>(null);

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

  const updateCurrentWeek = (updatedWeek: any) => {
    if (data.mode === 'single') {
      setData({ ...data, singleWeek: updatedWeek });
    } else if (currentWeek === 'a') {
      setData({ ...data, aWeek: updatedWeek });
    } else {
      setData({ ...data, bWeek: updatedWeek });
    }
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
    updateCurrentWeek(newWeek);
  };

  const handleAddSection = () => {
    setEditingSection(undefined);
    setSectionEditorOpen(true);
  };

  const handleSaveSection = (section: Section) => {
    const week = getCurrentWeek();
    const day = week[selectedDay];

    const existingIndex = day.sections.findIndex((s) => s.id === section.id);
    const newSections =
      existingIndex >= 0
        ? day.sections.map((s, i) => (i === existingIndex ? section : s))
        : [...day.sections, section];

    updateCurrentWeek({
      ...week,
      [selectedDay]: {
        ...day,
        sections: newSections,
      },
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    const week = getCurrentWeek();
    const day = week[selectedDay];

    updateCurrentWeek({
      ...week,
      [selectedDay]: {
        ...day,
        sections: day.sections.filter((s) => s.id !== sectionId),
      },
    });
    setMenuAnchor(null);
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setSectionEditorOpen(true);
    setMenuAnchor(null);
  };

  const handleDuplicateSection = (section: Section) => {
    const newSection = { ...section, id: `section-${Date.now()}` };
    handleSaveSection(newSection);
    setMenuAnchor(null);
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

            <Alert severity="info" sx={{ mb: 2, fontSize: '0.85rem' }}>
              Demo prototype - Data stored locally
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
              <Tabs value={currentWeek} onChange={(_, newWeek) => setCurrentWeek(newWeek)} sx={{ mb: 2 }}>
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

          {/* Bottom Nav */}
          <Box
            sx={{
              display: 'flex',
              p: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Button
              size="small"
              variant={view === 'builder' ? 'contained' : 'text'}
              onClick={() => setView('builder')}
              sx={{ flex: 1 }}
            >
              Builder
            </Button>
            <Button
              size="small"
              variant={view === 'summary' ? 'contained' : 'text'}
              onClick={() => setView('summary')}
              sx={{ flex: 1 }}
            >
              Summary
            </Button>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2, minHeight: 400 }}>
            {view === 'builder' ? (
              <>
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
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddSection}>
                          Add Section
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        {currentDay.sections.map((section) => (
                          <Card key={section.id} sx={{ mb: 2 }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                                  {section.name}
                                </Typography>
                                <Box>
                                  <Chip
                                    label={section.type}
                                    size="small"
                                    color={section.type === 'interval' ? 'secondary' : 'default'}
                                    sx={{ mr: 1 }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={(e) => setMenuAnchor({ element: e.currentTarget, sectionId: section.id })}
                                  >
                                    <MoreVertIcon />
                                  </IconButton>
                                </Box>
                              </Box>

                              {section.exercises.map((exercise, exIdx) => {
                                // Format exercise display
                                let displayText = '';
                                let restInfo = '';

                                if (exercise.perSet && exercise.perSet.length > 0) {
                                  // New format with perSet
                                  const repsDisplay = exercise.perSet.map((s) => s.reps).join('/');
                                  const weights = exercise.perSet.map((s) => s.weight).filter((w) => w !== undefined);
                                  const weightDisplay = weights.length > 0 ? ` @${weights[0]}lb` : '';

                                  const restTimes = exercise.perSet.map((s) => s.restSeconds ?? exercise.restSeconds ?? 60);
                                  const allSameRest = restTimes.every((r) => r === restTimes[0]);
                                  const restDisplay = allSameRest
                                    ? `${restTimes[0]}s rest`
                                    : `${restTimes.join('/')}s rest`;

                                  displayText = `${exercise.perSet.length} sets: ${repsDisplay} reps${weightDisplay}`;
                                  restInfo = restDisplay;
                                } else {
                                  // Legacy format
                                  displayText = exercise.sets
                                    .map((s) => `${s.sets}×${s.reps}${s.weight ? ` @ ${s.weight} lbs` : ''}`)
                                    .join(', ');
                                  if (exercise.restSeconds) {
                                    restInfo = `${exercise.restSeconds}s rest`;
                                  }
                                }

                                return (
                                  <Box key={exIdx} sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {exercise.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {displayText}
                                    </Typography>
                                    {restInfo && (
                                      <Typography variant="caption" color="primary.main" sx={{ display: 'block' }}>
                                        Rest: {restInfo}
                                      </Typography>
                                    )}
                                  </Box>
                                );
                              })}

                              {section.type === 'interval' && (
                                <Typography variant="caption" color="secondary.main">
                                  {section.toFailure ? 'To failure' : `${section.intervalCount} intervals × ${section.duration}s`}
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddSection} fullWidth>
                          Add Section
                        </Button>
                      </Box>
                    )}
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
              </>
            ) : (
              <WorkoutAnalytics week={getCurrentWeek()} />
            )}
          </Box>
        </Paper>

        {/* Instructions */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            This is a functional demo of the workout planner.
            <br />
            Add sections, pick exercises, and view weekly analytics!
          </Typography>
        </Box>
      </Container>

      {/* Section Menu */}
      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            const section = getCurrentDay().sections.find((s) => s.id === menuAnchor?.sectionId);
            if (section) handleEditSection(section);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            const section = getCurrentDay().sections.find((s) => s.id === menuAnchor?.sectionId);
            if (section) handleDuplicateSection(section);
          }}
        >
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor) handleDeleteSection(menuAnchor.sectionId);
          }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* Section Editor */}
      <SectionEditor
        open={sectionEditorOpen}
        onClose={() => {
          setSectionEditorOpen(false);
          setEditingSection(undefined);
        }}
        onSave={handleSaveSection}
        initialSection={editingSection}
      />
    </Box>
  );
}
