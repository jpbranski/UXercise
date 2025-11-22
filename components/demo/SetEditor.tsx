'use client';

import { Box, Typography, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { WorkoutExerciseSet, SetType } from '@/lib/demo/types';

interface SetEditorProps {
  set: WorkoutExerciseSet;
  setIndex: number;
  canDelete: boolean;
  onUpdate: (field: string, value: any) => void;
  onDelete: () => void;
}

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

const SET_TYPE_LABELS: Record<SetType, string> = {
  'standard': 'Standard',
  'warm-up': 'Warm-up',
  'drop': 'Drop Set',
  'pyramid': 'Pyramid',
  'reverse-pyramid': 'Rev Pyramid',
  'amrap': 'AMRAP',
  'emom': 'EMOM',
  'tabata': 'Tabata',
  'hiit-interval': 'HIIT',
  'superset': 'Superset',
  'circuit': 'Circuit',
};

export default function SetEditor({ set, setIndex, canDelete, onUpdate, onDelete }: SetEditorProps) {
  const handleIncrement = (field: string, delta: number) => {
    const currentValue = (set as any)[field] || 0;
    const newValue = Math.max(0, currentValue + delta);
    onUpdate(field, newValue);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'auto auto 1fr auto' },
        gap: 1.5,
        alignItems: 'center',
        p: 1.5,
        bgcolor: 'background.default',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'border-color 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      {/* Set Number & Type */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, gridColumn: { xs: '1 / -1', sm: 'auto' } }}>
        <Typography
          variant="caption"
          sx={{
            minWidth: 36,
            fontWeight: 700,
            color: 'text.secondary',
            fontSize: '0.75rem',
          }}
        >
          Set {setIndex + 1}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={set.setType}
            onChange={(e) => onUpdate('setType', e.target.value)}
            sx={{
              fontSize: '0.8rem',
              height: 36,
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: 1.5,
              },
            }}
          >
            {SET_TYPES.map((type) => (
              <MenuItem key={type} value={type} sx={{ fontSize: '0.85rem' }}>
                {SET_TYPE_LABELS[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Input Controls Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          gridColumn: { xs: '1 / -1', sm: 'auto' },
        }}
      >
        {/* Reps */}
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontSize: '0.7rem', fontWeight: 600 }}>
            Reps
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: 40,
              bgcolor: 'background.paper',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 1px rgba(255,107,53,0.2)',
              },
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleIncrement('targetReps', -1)}
              sx={{
                borderRadius: 0,
                width: 28,
                height: '100%',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255,107,53,0.08)' },
              }}
            >
              <RemoveIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: 'text.primary',
              }}
            >
              {set.targetReps || 0}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleIncrement('targetReps', 1)}
              sx={{
                borderRadius: 0,
                width: 28,
                height: '100%',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255,107,53,0.08)' },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Weight */}
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontSize: '0.7rem', fontWeight: 600 }}>
            Weight
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: 40,
              bgcolor: 'background.paper',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 1px rgba(255,107,53,0.2)',
              },
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleIncrement('targetWeight', -5)}
              sx={{
                borderRadius: 0,
                width: 28,
                height: '100%',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255,107,53,0.08)' },
              }}
            >
              <RemoveIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: 'text.primary',
              }}
            >
              {set.targetWeight || 0}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleIncrement('targetWeight', 5)}
              sx={{
                borderRadius: 0,
                width: 28,
                height: '100%',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255,107,53,0.08)' },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Rest */}
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontSize: '0.7rem', fontWeight: 600 }}>
            Rest (s)
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: 40,
              bgcolor: 'background.paper',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 1px rgba(255,107,53,0.2)',
              },
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleIncrement('restSeconds', -15)}
              sx={{
                borderRadius: 0,
                width: 28,
                height: '100%',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255,107,53,0.08)' },
              }}
            >
              <RemoveIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: 'text.primary',
              }}
            >
              {set.restSeconds}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleIncrement('restSeconds', 15)}
              sx={{
                borderRadius: 0,
                width: 28,
                height: '100%',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255,107,53,0.08)' },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Delete Button */}
      {canDelete && (
        <IconButton
          onClick={onDelete}
          size="small"
          sx={{
            color: 'error.main',
            alignSelf: 'center',
            justifySelf: { xs: 'flex-end', sm: 'auto' },
            gridColumn: { xs: '1 / -1', sm: 'auto' },
            width: { xs: '100%', sm: 40 },
            height: 40,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: 'error.light',
              borderColor: 'error.main',
              color: 'white',
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
