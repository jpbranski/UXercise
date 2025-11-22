'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { WorkoutTemplate } from '@/lib/demo/types';
import { WORKOUT_TEMPLATES } from '@/data/demo/workoutTemplates';

interface TemplatePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: WorkoutTemplate) => void;
}

export default function TemplatePickerModal({ open, onClose, onSelect }: TemplatePickerModalProps) {
  const handleSelect = (template: WorkoutTemplate) => {
    onSelect(template);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Choose a Template</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Start with a proven workout template and customize it to your needs
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 500, overflow: 'auto' }}>
          {WORKOUT_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                  borderColor: 'primary.main',
                },
                border: '2px solid transparent',
              }}
              onClick={() => handleSelect(template)}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 1 }}>
                  {template.name}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {template.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={template.difficulty}
                    size="small"
                    color={
                      template.difficulty === 'Beginner'
                        ? 'success'
                        : template.difficulty === 'Intermediate'
                        ? 'warning'
                        : 'error'
                    }
                  />
                  <Chip label={`${template.estimatedDurationMinutes} min`} size="small" variant="outlined" />
                  {template.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {template.exercises.length} exercises
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
