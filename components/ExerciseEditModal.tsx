'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
  Tooltip,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Exercise, SetDetail } from '@/types/workout';
import StyledNumberInput from './StyledNumberInput';

interface ExerciseEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  exercise: Exercise;
}

interface SortableSetRowProps {
  setData: SetDetail;
  index: number;
  defaultRest: number;
  onUpdate: (index: number, field: keyof SetDetail, value: number | undefined) => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
  onCopy: (index: number) => void;
  onPaste: (index: number) => void;
  canDelete: boolean;
  hasCopiedSet: boolean;
}

function SortableSetRow({
  setData,
  index,
  defaultRest,
  onUpdate,
  onDelete,
  onDuplicate,
  onCopy,
  onPaste,
  canDelete,
  hasCopiedSet,
}: SortableSetRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `set-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const effectiveRest = setData.restSeconds ?? defaultRest;
  const hasOverride = setData.restSeconds !== undefined;

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        p: 1.5,
        mb: 1,
        bgcolor: isDragging ? 'action.hover' : 'background.paper',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Drag Handle */}
        <IconButton size="small" {...attributes} {...listeners} sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
          <DragIndicatorIcon />
        </IconButton>

        {/* Set Number */}
        <Typography variant="body2" sx={{ minWidth: 30, fontWeight: 600, color: 'primary.main' }}>
          #{index + 1}
        </Typography>

        {/* Reps Input */}
        <StyledNumberInput
          label="Reps"
          value={setData.reps}
          onChange={(e) => onUpdate(index, 'reps', Number(e.target.value))}
          min={1}
          size="small"
          sx={{ width: 80 }}
        />

        {/* Weight Input */}
        <StyledNumberInput
          label="Weight"
          value={setData.weight ?? ''}
          onChange={(e) => onUpdate(index, 'weight', e.target.value ? Number(e.target.value) : undefined)}
          min={0}
          size="small"
          sx={{ width: 90 }}
        />

        {/* Rest Input */}
        <Box sx={{ position: 'relative' }}>
          <StyledNumberInput
            label="Rest (s)"
            value={effectiveRest}
            onChange={(e) => onUpdate(index, 'restSeconds', Number(e.target.value))}
            min={0}
            size="small"
            sx={{
              width: 90,
              '& .MuiOutlinedInput-root': {
                bgcolor: hasOverride ? 'rgba(255, 107, 53, 0.08)' : 'transparent',
              },
            }}
          />
          {hasOverride && (
            <Tooltip title="Reset to default">
              <IconButton
                size="small"
                onClick={() => onUpdate(index, 'restSeconds', undefined)}
                sx={{
                  position: 'absolute',
                  right: -8,
                  top: -8,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  padding: '2px',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <RestartAltIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
          <Tooltip title="Copy set">
            <IconButton size="small" onClick={() => onCopy(index)} color="primary">
              <ContentCopyIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Paste set">
            <IconButton size="small" onClick={() => onPaste(index)} disabled={!hasCopiedSet} color="primary">
              <ContentPasteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Duplicate set">
            <IconButton size="small" onClick={() => onDuplicate(index)} color="primary">
              <FileCopyIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          {canDelete && (
            <Tooltip title="Delete set">
              <IconButton size="small" onClick={() => onDelete(index)} color="error">
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default function ExerciseEditModal({ open, onClose, onSave, exercise }: ExerciseEditModalProps) {
  const [defaultRest, setDefaultRest] = useState(60);
  const [sets, setSets] = useState<SetDetail[]>([]);
  const [copiedSet, setCopiedSet] = useState<SetDetail | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize or migrate data when modal opens
  useEffect(() => {
    if (open && exercise) {
      // Set default rest
      setDefaultRest(exercise.restSeconds ?? 60);

      // Migrate from legacy format or use perSet
      if (exercise.perSet && exercise.perSet.length > 0) {
        // Use existing perSet data
        setSets(exercise.perSet);
      } else if (exercise.sets && exercise.sets.length > 0) {
        // Auto-migrate from legacy format
        const legacySet = exercise.sets[0];
        const migratedSets: SetDetail[] = Array.from({ length: legacySet.sets }, () => ({
          reps: legacySet.reps,
          weight: legacySet.weight,
          restSeconds: undefined, // Will inherit default
        }));
        setSets(migratedSets);
      } else {
        // Create default set
        setSets([{ reps: 8, weight: 0, restSeconds: undefined }]);
      }
    }
  }, [open, exercise]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(String(active.id).replace('set-', ''));
      const newIndex = parseInt(String(over.id).replace('set-', ''));

      setSets((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleUpdateSet = (index: number, field: keyof SetDetail, value: number | undefined) => {
    setSets((prev) =>
      prev.map((set, i) => (i === index ? { ...set, [field]: value } : set))
    );
  };

  const handleDeleteSet = (index: number) => {
    if (sets.length > 1) {
      setSets((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDuplicateSet = (index: number) => {
    const setToDuplicate = sets[index];
    setSets((prev) => [
      ...prev.slice(0, index + 1),
      { ...setToDuplicate },
      ...prev.slice(index + 1),
    ]);
  };

  const handleCopySet = (index: number) => {
    setCopiedSet({ ...sets[index] });
  };

  const handlePasteSet = (index: number) => {
    if (copiedSet) {
      setSets((prev) =>
        prev.map((set, i) => (i === index ? { ...copiedSet } : set))
      );
    }
  };

  const handleAddSet = () => {
    // Add a new set with the same reps/weight as the last set
    const lastSet = sets[sets.length - 1];
    setSets((prev) => [
      ...prev,
      {
        reps: lastSet?.reps ?? 8,
        weight: lastSet?.weight,
        restSeconds: undefined,
      },
    ]);
  };

  const handleSave = () => {
    const updatedExercise: Exercise = {
      ...exercise,
      restSeconds: defaultRest,
      perSet: sets,
      // Keep legacy sets for backward compatibility, but mark as migrated
      sets: [{ sets: sets.length, reps: sets[0]?.reps ?? 8, weight: sets[0]?.weight }],
    };
    onSave(updatedExercise);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Edit Exercise: {exercise?.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Default Rest Timer */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Default Rest Between Sets
            </Typography>
            <StyledNumberInput
              label="Default Rest (seconds)"
              value={defaultRest}
              onChange={(e) => setDefaultRest(Number(e.target.value))}
              min={0}
              sx={{ maxWidth: 200 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Sets without custom rest will use this value
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Sets Section */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Sets ({sets.length})
              </Typography>
              {copiedSet && (
                <Typography variant="caption" color="primary.main">
                  Set copied to clipboard
                </Typography>
              )}
            </Box>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sets.map((_, i) => `set-${i}`)} strategy={verticalListSortingStrategy}>
                {sets.map((set, index) => (
                  <SortableSetRow
                    key={`set-${index}`}
                    setData={set}
                    index={index}
                    defaultRest={defaultRest}
                    onUpdate={handleUpdateSet}
                    onDelete={handleDeleteSet}
                    onDuplicate={handleDuplicateSet}
                    onCopy={handleCopySet}
                    onPaste={handlePasteSet}
                    canDelete={sets.length > 1}
                    hasCopiedSet={copiedSet !== null}
                  />
                ))}
              </SortableContext>
            </DndContext>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddSet}
              fullWidth
              sx={{ mt: 1 }}
            >
              Add Set
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
