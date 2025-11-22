'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { Workout, WorkoutExercise, WorkoutExerciseSet, Difficulty, WorkoutTag, SetType, WorkoutTemplate } from '@/lib/demo/types';
import { EXERCISE_LIBRARY } from '@/data/demo/exercises';
import ExercisePickerModal from './ExercisePickerModal';
import TemplatePickerModal from './TemplatePickerModal';
import SetEditor from './SetEditor';

interface WorkoutBuilderProps {
  workout: Workout | null;
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

const WORKOUT_TAGS: WorkoutTag[] = [
  'Warm-Up',
  'Strength',
  'Cardio',
  'HIIT',
  'Pull',
  'Push',
  'Legs',
  'Core',
  'Full-Body',
  'Endurance',
  'Bodyweight',
  'Gym',
  'Home',
];

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

const SET_TYPES: SetType[] = [
  'standard',
  'warm-up',
  'drop',
  'pyramid',
  'reverse-pyramid',
  'amrap',
  'emom',
  'tabata',
  'hiit-interval',
  'superset',
  'circuit',
];

export default function WorkoutBuilder({ workout, onSave, onCancel }: WorkoutBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [tags, setTags] = useState<WorkoutTag[]>([]);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [exercisePickerOpen, setExercisePickerOpen] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  // Load workout data if editing
  useEffect(() => {
    if (workout) {
      setName(workout.name);
      setDescription(workout.description || '');
      setDifficulty(workout.difficulty);
      setTags(workout.tags);
      setExercises(workout.exercises);
    } else {
      // Reset for new workout
      setName('');
      setDescription('');
      setDifficulty('Intermediate');
      setTags([]);
      setExercises([]);
    }
  }, [workout]);

  const handleTagsChange = (event: SelectChangeEvent<typeof tags>) => {
    const value = event.target.value;
    setTags(typeof value === 'string' ? (value.split(',') as WorkoutTag[]) : value);
  };

  const handleAddExercise = (exerciseDef: any) => {
    const newExercise: WorkoutExercise = {
      id: `ex-${Date.now()}-${Math.random()}`,
      exerciseId: exerciseDef.id,
      displayName: exerciseDef.name,
      order: exercises.length,
      sets: [
        {
          id: `set-${Date.now()}-1`,
          setType: 'standard',
          targetReps: exerciseDef.defaultReps || 10,
          targetWeight: exerciseDef.defaultWeight || 0,
          restSeconds: exerciseDef.defaultRestSeconds || 90,
        },
        {
          id: `set-${Date.now()}-2`,
          setType: 'standard',
          targetReps: exerciseDef.defaultReps || 10,
          targetWeight: exerciseDef.defaultWeight || 0,
          restSeconds: exerciseDef.defaultRestSeconds || 90,
        },
        {
          id: `set-${Date.now()}-3`,
          setType: 'standard',
          targetReps: exerciseDef.defaultReps || 10,
          targetWeight: exerciseDef.defaultWeight || 0,
          restSeconds: exerciseDef.defaultRestSeconds || 90,
        },
      ],
    };
    setExercises([...exercises, newExercise]);
  };

  const handleLoadTemplate = (template: WorkoutTemplate) => {
    setName(template.name);
    setDescription(template.description);
    setDifficulty(template.difficulty);
    setTags(template.tags);

    // Convert template exercises to WorkoutExercise
    const loadedExercises: WorkoutExercise[] = template.exercises.map((ex, idx) => ({
      id: `ex-${Date.now()}-${idx}`,
      exerciseId: ex.exerciseId,
      displayName: ex.displayName,
      order: idx,
      sets: ex.sets.map((set, setIdx) => ({
        ...set,
        id: `set-${Date.now()}-${idx}-${setIdx}`,
      })),
      notes: ex.notes,
    }));
    setExercises(loadedExercises);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const handleDuplicateExercise = (exerciseId: string) => {
    const exToDuplicate = exercises.find((ex) => ex.id === exerciseId);
    if (!exToDuplicate) return;

    const duplicated: WorkoutExercise = {
      ...exToDuplicate,
      id: `ex-${Date.now()}-${Math.random()}`,
      order: exercises.length,
      sets: exToDuplicate.sets.map((set, idx) => ({
        ...set,
        id: `set-${Date.now()}-${idx}`,
      })),
    };
    setExercises([...exercises, duplicated]);
  };

  const handleAddSet = (exerciseId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: `set-${Date.now()}`,
                  setType: 'standard',
                  targetReps: 10,
                  targetWeight: 0,
                  restSeconds: 90,
                },
              ],
            }
          : ex
      )
    );
  };

  const handleRemoveSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.filter((s) => s.id !== setId),
            }
          : ex
      )
    );
  };

  const handleSetChange = (exerciseId: string, setId: string, field: string, value: any) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId
                  ? {
                      ...s,
                      [field]: value,
                    }
                  : s
              ),
            }
          : ex
      )
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    // Calculate estimated duration (rough estimate based on sets and rest)
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const avgRestSeconds = exercises.reduce((sum, ex) => sum + ex.sets.reduce((s2, set) => s2 + set.restSeconds, 0), 0) / totalSets;
    const estimatedDurationMinutes = Math.ceil((totalSets * 45 + (totalSets - 1) * avgRestSeconds) / 60);

    const savedWorkout: Workout = {
      id: workout?.id || `workout-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      tags,
      difficulty,
      estimatedDurationMinutes,
      scheduledDays: workout?.scheduledDays || [],
      exercises: exercises.map((ex, idx) => ({ ...ex, order: idx })),
      createdAt: workout?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedWorkout);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          {workout ? 'Edit Workout' : 'Create Workout'}
        </Typography>

        {/* Workout Name */}
        <TextField
          fullWidth
          placeholder="Workout Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
          variant="outlined"
        />

        {/* Difficulty & Tags */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} label="Difficulty">
              {DIFFICULTIES.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={tags}
              onChange={handleTagsChange}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {WORKOUT_TAGS.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" startIcon={<ViewModuleIcon />} onClick={() => setTemplatePickerOpen(true)}>
            Templates
          </Button>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setExercisePickerOpen(true)}>
            Add Exercise
          </Button>
        </Box>
      </Box>

      {/* Exercises List */}
      {exercises.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            No exercises added yet
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExercisePickerOpen(true)}>
            Add First Exercise
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          {exercises.map((exercise, exIdx) => {
            const exerciseDef = EXERCISE_LIBRARY.find((e) => e.id === exercise.exerciseId);
            return (
              <Card key={exercise.id} sx={{ mb: 2 }}>
                <CardContent>
                  {/* Exercise Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={exIdx + 1} size="small" color="primary" />
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                        {exercise.displayName}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleDuplicateExercise(exercise.id)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteExercise(exercise.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Sets */}
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5, fontWeight: 600 }}>
                    Sets
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {exercise.sets.map((set, setIdx) => (
                      <SetEditor
                        key={set.id}
                        set={set}
                        setIndex={setIdx}
                        canDelete={exercise.sets.length > 1}
                        onUpdate={(field, value) => handleSetChange(exercise.id, set.id, field, value)}
                        onDelete={() => handleRemoveSet(exercise.id, set.id)}
                      />
                    ))}
                  </Box>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddSet(exercise.id)}
                    sx={{
                      mt: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(255,107,53,0.08)',
                      },
                    }}
                  >
                    Add Set
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Bottom Actions */}
      <Box sx={{ display: 'flex', gap: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} fullWidth>
          Save Workout
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>

      {/* Modals */}
      <ExercisePickerModal
        open={exercisePickerOpen}
        onClose={() => setExercisePickerOpen(false)}
        onSelect={handleAddExercise}
      />
      <TemplatePickerModal
        open={templatePickerOpen}
        onClose={() => setTemplatePickerOpen(false)}
        onSelect={handleLoadTemplate}
      />
    </Box>
  );
}
