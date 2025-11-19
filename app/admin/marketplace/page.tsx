'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MarketplaceItemCard } from '@/components/admin/MarketplaceItemCard';
import { AddMarketplaceItemForm } from '@/components/admin/AddMarketplaceItemForm';
import { EditMarketplaceDialog } from '@/components/admin/EditMarketplaceDialog';
import { MarketplaceItem, MarketplaceItemWithId } from '@/types/marketplace';
import marketplaceData from '@/data/marketplace.json';

// Helper function to generate unique IDs
const generateId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to reorder items
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function MarketplaceAdminPage() {
  const [items, setItems] = useState<MarketplaceItemWithId[]>([]);
  const [editingItem, setEditingItem] = useState<MarketplaceItemWithId | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load marketplace data on mount
  useEffect(() => {
    const itemsWithIds: MarketplaceItemWithId[] = marketplaceData.map((item) => ({
      ...item,
      id: generateId(),
    }));
    setItems(itemsWithIds);
  }, []);

  // Check if running in production
  const isProduction = process.env.NODE_ENV === 'production';

  const handleDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(reorderedItems);
  };

  const handleAddItem = (newItem: MarketplaceItem) => {
    const itemWithId: MarketplaceItemWithId = {
      ...newItem,
      id: generateId(),
    };

    setItems([itemWithId, ...items]);

    setSnackbar({
      open: true,
      message: 'Item added successfully! Remember to save your changes.',
      severity: 'success',
    });
  };

  const handleEditItem = (item: MarketplaceItemWithId) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedItem: MarketplaceItemWithId) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));

    setSnackbar({
      open: true,
      message: 'Item updated successfully! Remember to save your changes.',
      severity: 'success',
    });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter((item) => item.id !== id));

      setSnackbar({
        open: true,
        message: 'Item deleted successfully! Remember to save your changes.',
        severity: 'success',
      });
    }
  };

  const handleSaveChanges = async () => {
    if (isProduction) {
      setSnackbar({
        open: true,
        message: 'File editing is disabled in production.',
        severity: 'error',
      });
      return;
    }

    setIsSaving(true);

    try {
      // Remove IDs before saving (IDs are only for local state management)
      const itemsToSave: MarketplaceItem[] = items.map(({ id, ...item }) => item);

      const response = await fetch('/api/save-marketplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemsToSave),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save changes');
      }

      setSnackbar({
        open: true,
        message: data.message || 'Changes saved successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error saving changes:', error);

      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to save changes',
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Marketplace CMS
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your marketplace items: add, edit, delete, and reorder products.
        </Typography>

        {isProduction && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            File editing is disabled in production. Changes will not be saved to disk.
          </Alert>
        )}
      </Box>

      {/* Add Item Form */}
      <AddMarketplaceItemForm onAdd={handleAddItem} />

      {/* Save Button */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" component="h2">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag items to reorder, then click Save Changes
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSaveChanges}
          disabled={isSaving || isProduction}
          startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Items List with Drag and Drop */}
      {items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No items yet. Add your first marketplace item above!
          </Typography>
        </Paper>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="marketplace-items">
            {(provided, snapshot) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  minHeight: 200,
                  backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
                  transition: 'background-color 0.2s',
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                            : provided.draggableProps.style?.transform,
                        }}
                      >
                        <MarketplaceItemCard
                          item={item}
                          onEdit={handleEditItem}
                          onDelete={handleDeleteItem}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Edit Dialog */}
      <EditMarketplaceDialog
        item={editingItem}
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveEdit}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
