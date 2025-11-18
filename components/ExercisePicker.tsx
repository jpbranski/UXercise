'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import exercisesData from '@/data/exercises.json';

interface Exercise {
  id: string;
  name: string;
  type: string;
  muscleGroup: string;
  equipment: string[];
  difficulty: string;
  bodyRegion: string;
}

interface ExercisePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}

export default function ExercisePicker({ open, onClose, onSelect }: ExercisePickerProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredExercises = useMemo(() => {
    return (exercisesData as Exercise[]).filter((ex) => {
      const matchesSearch = search === '' || ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || ex.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    onClose();
    setSearch('');
    setTypeFilter('all');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select Exercise</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          <ToggleButtonGroup
            value={typeFilter}
            exclusive
            onChange={(_, val) => val && setTypeFilter(val)}
            size="small"
            sx={{ flexWrap: 'wrap' }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="push">Push</ToggleButton>
            <ToggleButton value="pull">Pull</ToggleButton>
            <ToggleButton value="legs">Legs</ToggleButton>
            <ToggleButton value="core">Core</ToggleButton>
            <ToggleButton value="cardio">Cardio</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredExercises.map((ex) => (
            <ListItemButton key={ex.id} onClick={() => handleSelect(ex)}>
              <ListItemText
                primary={ex.name}
                secondary={
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    <Chip label={ex.type} size="small" />
                    <Chip label={ex.bodyRegion} size="small" variant="outlined" />
                  </Box>
                }
              />
            </ListItemButton>
          ))}
        </List>

        {filteredExercises.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No exercises found
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
