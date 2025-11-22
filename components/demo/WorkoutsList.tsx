'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ToggleButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Workout, WorkoutLogEntry } from '@/lib/demo/types';

interface WorkoutsListProps {
  workouts: Workout[];
  logs: WorkoutLogEntry[];
  onCreateWorkout: () => void;
  onEditWorkout: (workout: Workout) => void;
  onDeleteWorkout: (workoutId: string) => void;
  onStartWorkout: (workout: Workout) => void;
  onUpdateSchedule: (workoutId: string, scheduledDays: number[]) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function WorkoutsList({
  workouts,
  logs,
  onCreateWorkout,
  onEditWorkout,
  onDeleteWorkout,
  onStartWorkout,
  onUpdateSchedule,
}: WorkoutsListProps) {
  const [searchText, setSearchText] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; workoutId: string } | null>(null);

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleToggleDay = (workout: Workout, dayIndex: number) => {
    const newScheduledDays = workout.scheduledDays.includes(dayIndex)
      ? workout.scheduledDays.filter((d) => d !== dayIndex)
      : [...workout.scheduledDays, dayIndex].sort();

    onUpdateSchedule(workout.id, newScheduledDays);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, workoutId: string) => {
    setMenuAnchor({ element: event.currentTarget, workoutId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    const workout = workouts.find((w) => w.id === menuAnchor?.workoutId);
    if (workout) {
      onEditWorkout(workout);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuAnchor && confirm('Delete this workout? This cannot be undone.')) {
      onDeleteWorkout(menuAnchor.workoutId);
    }
    handleMenuClose();
  };

  // Find last performed date for each workout
  const getLastPerformed = (workoutId: string): string | null => {
    const workoutLogs = logs
      .filter((log) => log.workoutId === workoutId)
      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());

    if (workoutLogs.length === 0) return null;

    const lastLog = workoutLogs[0];
    const date = new Date(lastLog.performedAt);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Workouts
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateWorkout}>
            New
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search workouts..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
        />
      </Box>

      {/* Workouts List */}
      {filteredWorkouts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <FitnessCenterIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            {searchText ? 'No workouts found' : 'No workouts yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {searchText ? 'Try a different search term' : 'Create your first workout to get started'}
          </Typography>
          {!searchText && (
            <Button variant="contained" onClick={onCreateWorkout} startIcon={<AddIcon />}>
              Create Workout
            </Button>
          )}
        </Box>
      ) : (
        <Box>
          {filteredWorkouts.map((workout) => {
            const lastPerformed = getLastPerformed(workout.id);

            return (
              <Card
                key={workout.id}
                elevation={0}
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Header Row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
                        {workout.name}
                      </Typography>
                      {workout.description && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          {workout.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={workout.difficulty}
                          size="small"
                          color={
                            workout.difficulty === 'Beginner'
                              ? 'success'
                              : workout.difficulty === 'Intermediate'
                              ? 'warning'
                              : 'error'
                          }
                        />
                        <Chip label={`${workout.estimatedDurationMinutes} min`} size="small" variant="outlined" />
                        {workout.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {workout.exercises.length} exercises
                        {lastPerformed && ` • Last performed ${lastPerformed}`}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => onStartWorkout(workout)}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                      <IconButton onClick={(e) => handleMenuOpen(e, workout.id)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Scheduling Row */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        display: 'block',
                        mb: 1,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    >
                      SCHEDULE:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                      {DAYS.map((day, index) => (
                        <Box
                          key={index}
                          onClick={() => handleToggleDay(workout, index)}
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            bgcolor: workout.scheduledDays.includes(index) ? 'primary.main' : 'background.paper',
                            color: workout.scheduledDays.includes(index) ? 'white' : 'text.secondary',
                            border: '2px solid',
                            borderColor: workout.scheduledDays.includes(index) ? 'primary.main' : 'divider',
                            boxShadow: workout.scheduledDays.includes(index)
                              ? '0 2px 8px rgba(255,107,53,0.3)'
                              : 'none',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              bgcolor: workout.scheduledDays.includes(index) ? 'primary.dark' : 'rgba(255,107,53,0.08)',
                              borderColor: 'primary.main',
                            },
                          }}
                          title={DAY_NAMES[index]}
                        >
                          {day}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor?.element} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
