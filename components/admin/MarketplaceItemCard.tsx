import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  CheckCircle as AffiliateIcon,
} from '@mui/icons-material';
import { MarketplaceItemWithId } from '@/types/marketplace';

interface MarketplaceItemCardProps {
  item: MarketplaceItemWithId;
  onEdit: (item: MarketplaceItemWithId) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
}

export const MarketplaceItemCard: React.FC<MarketplaceItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  dragHandleProps,
}) => {
  return (
    <Card
      sx={{
        display: 'flex',
        mb: 2,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      {/* Drag Handle */}
      <Box
        {...dragHandleProps}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1,
          cursor: 'grab',
          backgroundColor: 'action.hover',
          '&:active': {
            cursor: 'grabbing',
          },
        }}
        aria-label="Drag to reorder"
      >
        <DragIcon />
      </Box>

      {/* Image */}
      <CardMedia
        component="img"
        sx={{
          width: 120,
          height: 120,
          objectFit: 'contain',
          p: 1,
        }}
        image={item.image}
        alt={item.name}
      />

      {/* Content */}
      <CardContent sx={{ flex: 1 }}>
        <Stack spacing={1}>
          {/* Title and Affiliate Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="h3">
              {item.name}
            </Typography>
            {item.affiliate && (
              <Tooltip title="Affiliate Product">
                <AffiliateIcon color="success" fontSize="small" />
              </Tooltip>
            )}
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary">
            {item.description}
          </Typography>

          {/* Category */}
          <Box>
            <Chip
              label={item.category}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* Tags */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {item.tags.map((tag, index) => (
              <Chip
                key={`${tag}-${index}`}
                label={tag}
                size="small"
                variant="filled"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>

          {/* URL */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.url}
          </Typography>
        </Stack>
      </CardContent>

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 1,
        }}
      >
        <Tooltip title="Edit item">
          <IconButton
            onClick={() => onEdit(item)}
            color="primary"
            aria-label={`Edit ${item.name}`}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete item">
          <IconButton
            onClick={() => onDelete(item.id)}
            color="error"
            aria-label={`Delete ${item.name}`}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};
