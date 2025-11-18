'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Section, Exercise } from '@/types/workout';
import ExercisePicker from './ExercisePicker';
import ExerciseEditModal from './ExerciseEditModal';
import StyledNumberInput from './StyledNumberInput';

interface SectionEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (section: Section) => void;
  initialSection?: Section;
}

export default function SectionEditor({ open, onClose, onSave, initialSection }: SectionEditorProps) {
  const [name, setName] = useState(initialSection?.name || '');
  const [type, setType] = useState<'standard' | 'interval'>(initialSection?.type || 'standard');
  const [exercises, setExercises] = useState(initialSection?.exercises || []);
  const [intervalCount, setIntervalCount] = useState(
    (initialSection?.type === 'interval' && initialSection.intervalCount) || 3
  );
  const [toFailure, setToFailure] = useState(
    (initialSection?.type === 'interval' && initialSection.toFailure) || false
  );
  const [duration, setDuration] = useState(
    (initialSection?.type === 'interval' && initialSection.duration) || 30
  );
  const [exercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<{ exercise: Exercise; index: number } | null>(null);

  const handleSave = () => {
    const section: Section =
      type === 'standard'
        ? {
            id: initialSection?.id || `section-${Date.now()}`,
            type: 'standard',
            name,
            exercises,
          }
        : {
            id: initialSection?.id || `section-${Date.now()}`,
            type: 'interval',
            name,
            exercises,
            intervalCount: toFailure ? undefined : intervalCount,
            toFailure,
            duration: toFailure ? undefined : duration,
          };

    onSave(section);
    onClose();
  };

  const addExercise = (exercise: any) => {
    setExercises([
      ...exercises,
      {
        id: exercise.id,
        name: exercise.name,
        sets: [{ sets: 3, reps: 8, weight: 0 }],
        restSeconds: 60,
        perSet: [
          { reps: 8, weight: 0, restSeconds: undefined },
          { reps: 8, weight: 0, restSeconds: undefined },
          { reps: 8, weight: 0, restSeconds: undefined },
        ],
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleEditExercise = (exercise: Exercise, index: number) => {
    setEditingExercise({ exercise, index });
  };

  const handleSaveExercise = (updatedExercise: Exercise) => {
    if (editingExercise !== null) {
      setExercises((prev) =>
        prev.map((ex, i) => (i === editingExercise.index ? updatedExercise : ex))
      );
      setEditingExercise(null);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{initialSection ? 'Edit Section' : 'Add Section'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Section Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Section Type:
              </Typography>
              <ToggleButtonGroup
                value={type}
                exclusive
                onChange={(_, val) => val && setType(val)}
                fullWidth
              >
                <ToggleButton value="standard">Standard</ToggleButton>
                <ToggleButton value="interval">Interval</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {type === 'interval' && (
              <Box>
                <FormControlLabel
                  control={<Switch checked={toFailure} onChange={(e) => setToFailure(e.target.checked)} />}
                  label="To Failure"
                />
                {!toFailure && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <StyledNumberInput
                      label="Intervals"
                      value={intervalCount}
                      onChange={(e) => setIntervalCount(Number(e.target.value))}
                      min={1}
                      fullWidth
                    />
                    <StyledNumberInput
                      label="Duration (s)"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      min={1}
                      fullWidth
                    />
                  </Box>
                )}
              </Box>
            )}

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">Exercises:</Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setExercisePickerOpen(true)}
                >
                  Add Exercise
                </Button>
              </Box>

              <List>
                {exercises.map((ex, idx) => (
                  <ListItem
                    key={idx}
                    disablePadding
                    secondaryAction={
                      <Box>
                        <IconButton size="small" onClick={() => handleEditExercise(ex, idx)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" edge="end" onClick={() => removeExercise(idx)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemButton onClick={() => handleEditExercise(ex, idx)}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {ex.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ex.perSet
                            ? `${ex.perSet.length} sets • ${ex.restSeconds ?? 60}s rest`
                            : `${ex.sets[0]?.sets ?? 3}×${ex.sets[0]?.reps ?? 8}`}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {exercises.length === 0 && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No exercises added
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!name || exercises.length === 0}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ExercisePicker
        open={exercisePickerOpen}
        onClose={() => setExercisePickerOpen(false)}
        onSelect={addExercise}
      />

      {editingExercise && (
        <ExerciseEditModal
          open={true}
          onClose={() => setEditingExercise(null)}
          onSave={handleSaveExercise}
          exercise={editingExercise.exercise}
        />
      )}
    </>
  );
}
