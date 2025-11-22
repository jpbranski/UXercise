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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: 420,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.4rem' }}>
          Choose a Template
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontSize: '0.9rem' }}>
          Start with a proven workout template and customize it to your needs
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 500, overflow: 'auto', pr: 0.5 }}>
          {WORKOUT_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              elevation={0}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '2px solid',
                borderColor: 'divider',
                borderRadius: 2.5,
                minHeight: 100,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  borderColor: 'primary.main',
                },
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
