import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { MarketplaceItemWithId } from '@/types/marketplace';

interface EditMarketplaceDialogProps {
  item: MarketplaceItemWithId | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: MarketplaceItemWithId) => void;
}

export const EditMarketplaceDialog: React.FC<EditMarketplaceDialogProps> = ({
  item,
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<MarketplaceItemWithId | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (item) {
      setFormData(item);
      setTagsInput(item.tags.join(', '));
    }
  }, [item]);

  const handleChange = (field: keyof MarketplaceItemWithId, value: any) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    // Parse tags from comma-separated input
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const updatedItem: MarketplaceItemWithId = {
      ...formData,
      tags,
    };

    onSave(updatedItem);
    onClose();
  };

  const isFormValid = () => {
    if (!formData) return false;

    return (
      formData.name.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.url.trim() !== '' &&
      formData.image.trim() !== '' &&
      formData.category.trim() !== ''
    );
  };

  if (!formData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="edit-dialog-title"
    >
      <DialogTitle id="edit-dialog-title" sx={{ m: 0, p: 2 }}>
        Edit Marketplace Item
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            {/* Name */}
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
              aria-label="Product name"
            />

            {/* Description */}
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              fullWidth
              multiline
              rows={3}
              aria-label="Product description"
            />

            {/* URL */}
            <TextField
              label="URL"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              required
              fullWidth
              type="url"
              aria-label="Product URL"
            />

            {/* Image */}
            <TextField
              label="Image Path"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              required
              fullWidth
              helperText="Enter the path to the image (e.g., /images/product.svg)"
              aria-label="Image path"
            />

            {/* Category */}
            <TextField
              label="Category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
              fullWidth
              aria-label="Product category"
            />

            {/* Tags */}
            <TextField
              label="Tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              fullWidth
              placeholder="tag1, tag2, tag3"
              helperText="Enter tags separated by commas"
              aria-label="Product tags (comma-separated)"
            />

            {/* Affiliate Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.affiliate}
                  onChange={(e) => handleChange('affiliate', e.target.checked)}
                  color="primary"
                />
              }
              label="Affiliate Product"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
