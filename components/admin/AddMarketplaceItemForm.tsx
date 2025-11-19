import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Paper,
  Typography,
  Stack,
  Collapse,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, ExpandMore as ExpandIcon } from '@mui/icons-material';
import { MarketplaceItem } from '@/types/marketplace';

interface AddMarketplaceItemFormProps {
  onAdd: (item: MarketplaceItem) => void;
}

export const AddMarketplaceItemForm: React.FC<AddMarketplaceItemFormProps> = ({
  onAdd,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<MarketplaceItem>({
    name: '',
    description: '',
    url: '',
    affiliate: false,
    image: '',
    category: '',
    tags: [],
  });

  const [tagsInput, setTagsInput] = useState('');

  const handleChange = (field: keyof MarketplaceItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse tags from comma-separated input
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const newItem: MarketplaceItem = {
      ...formData,
      tags,
    };

    onAdd(newItem);

    // Reset form
    setFormData({
      name: '',
      description: '',
      url: '',
      affiliate: false,
      image: '',
      category: '',
      tags: [],
    });
    setTagsInput('');
    setIsExpanded(false);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.url.trim() !== '' &&
      formData.image.trim() !== '' &&
      formData.category.trim() !== ''
    );
  };

  return (
    <Paper elevation={3} sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: 'pointer',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography variant="h6" component="h2">
          Add New Marketplace Item
        </Typography>
        <IconButton
          sx={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
            color: 'inherit',
          }}
          aria-label={isExpanded ? 'Collapse form' : 'Expand form'}
          aria-expanded={isExpanded}
        >
          <ExpandIcon />
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3 }}
          noValidate
          autoComplete="off"
        >
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
              rows={2}
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
              placeholder="https://example.com/product"
              aria-label="Product URL"
            />

            {/* Image */}
            <TextField
              label="Image Path"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              required
              fullWidth
              placeholder="/images/placeholder.svg"
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
              placeholder="Equipment, Recovery, Accessories"
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!isFormValid()}
              startIcon={<AddIcon />}
              fullWidth
            >
              Add Item
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};
