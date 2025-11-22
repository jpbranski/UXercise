'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ExerciseDefinition, BodyPart, Equipment } from '@/lib/demo/types';
import { EXERCISE_LIBRARY } from '@/data/demo/exercises';

interface ExercisePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: ExerciseDefinition) => void;
}

export default function ExercisePickerModal({ open, onClose, onSelect }: ExercisePickerModalProps) {
  const [searchText, setSearchText] = useState('');
  const [bodyPartFilter, setBodyPartFilter] = useState<BodyPart | 'all'>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<Equipment | 'all'>('all');

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      // Search text filter
      if (searchText && !ex.name.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }

      // Body part filter
      if (bodyPartFilter !== 'all' && ex.primaryBodyPart !== bodyPartFilter) {
        return false;
      }

      // Equipment filter
      if (equipmentFilter !== 'all' && ex.equipment !== equipmentFilter) {
        return false;
      }

      return true;
    });
  }, [searchText, bodyPartFilter, equipmentFilter]);

  // Group by body part
  const groupedExercises = useMemo(() => {
    const groups: Record<string, ExerciseDefinition[]> = {};
    filteredExercises.forEach((ex) => {
      const key = ex.primaryBodyPart;
      if (!groups[key]) groups[key] = [];
      groups[key].push(ex);
    });
    return groups;
  }, [filteredExercises]);

  const handleSelect = (exercise: ExerciseDefinition) => {
    onSelect(exercise);
    onClose();
    // Reset filters
    setSearchText('');
    setBodyPartFilter('all');
    setEquipmentFilter('all');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Add Exercise</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search exercises..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
          autoFocus
        />

        {/* Body Part Filter */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            Body Part
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              onClick={() => setBodyPartFilter('all')}
              color={bodyPartFilter === 'all' ? 'primary' : 'default'}
              size="small"
            />
            {['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full-body'].map((bp) => (
              <Chip
                key={bp}
                label={bp.charAt(0).toUpperCase() + bp.slice(1)}
                onClick={() => setBodyPartFilter(bp as BodyPart)}
                color={bodyPartFilter === bp ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* Equipment Filter */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            Equipment
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              onClick={() => setEquipmentFilter('all')}
              color={equipmentFilter === 'all' ? 'primary' : 'default'}
              size="small"
            />
            {['barbell', 'dumbbell', 'kettlebell', 'bodyweight', 'machine', 'cable'].map((eq) => (
              <Chip
                key={eq}
                label={eq.charAt(0).toUpperCase() + eq.slice(1)}
                onClick={() => setEquipmentFilter(eq as Equipment)}
                color={equipmentFilter === eq ? 'primary' : 'default'}
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* Results */}
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
          {filteredExercises.length} exercises found
        </Typography>

        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {Object.entries(groupedExercises).map(([bodyPart, exercises]) => (
            <Box key={bodyPart}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  px: 2,
                  py: 1,
                  bgcolor: 'background.default',
                  color: 'primary.main',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                {bodyPart.toUpperCase()}
              </Typography>
              {exercises.map((ex) => (
                <ListItemButton key={ex.id} onClick={() => handleSelect(ex)}>
                  <ListItemText
                    primary={ex.name}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        {ex.equipment && (
                          <Chip
                            label={ex.equipment}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        )}
                        {ex.tags?.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        ))}
                      </Box>
                    }
                  />
                </ListItemButton>
              ))}
            </Box>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
