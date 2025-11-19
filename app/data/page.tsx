'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FolderIcon from '@mui/icons-material/Folder';
import {
  loadConsentPreferences,
  deleteConsentData,
  CONSENT_STORAGE_KEY,
} from '@/utils/cookieConsent';

/**
 * User Data Management Page
 * GDPR Article 15 (Right of Access) & Article 17 (Right to Erasure)
 */
export default function DataManagementPage() {
  const [exportSuccess, setExportSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  /**
   * Collect all user data stored locally
   */
  const collectUserData = () => {
    const data: Record<string, unknown> = {};

    // Cookie consent preferences
    const consentPrefs = loadConsentPreferences();
    if (consentPrefs) {
      data.cookieConsent = consentPrefs;
    }

    // Workout planner data
    const workoutData = localStorage.getItem('uxercise-demo-workout');
    if (workoutData) {
      try {
        data.workoutPlanner = JSON.parse(workoutData);
      } catch {
        data.workoutPlanner = workoutData;
      }
    }

    // Any other localStorage keys that start with 'uxercise-'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('uxercise-') && key !== CONSENT_STORAGE_KEY && key !== 'uxercise-demo-workout') {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value;
          }
        }
      }
    }

    return data;
  };

  /**
   * Export user data as JSON file
   */
  const handleExportData = () => {
    const data = collectUserData();

    const exportData = {
      exportDate: new Date().toISOString(),
      application: 'UXercise',
      version: '1.0',
      data,
    };

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uxercise-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 5000);
  };

  /**
   * Delete all user data
   */
  const handleDeleteData = () => {
    // Delete cookie consent
    deleteConsentData();

    // Delete workout planner data
    localStorage.removeItem('uxercise-demo-workout');

    // Delete any other UXercise localStorage keys
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('uxercise-')) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => localStorage.removeItem(key));

    setDeleteDialogOpen(false);
    setDeleteSuccess(true);
  };

  const dataItems = [
    {
      name: 'Cookie Consent Preferences',
      description: 'Your cookie and privacy preferences',
      key: CONSENT_STORAGE_KEY,
    },
    {
      name: 'Workout Planner Data',
      description: 'Demo workout planner exercises and settings',
      key: 'uxercise-demo-workout',
    },
    {
      name: 'UI Preferences',
      description: 'Theme, unit preferences, and other settings',
      key: 'other',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Your Data & Privacy
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Manage your personal data stored by UXercise. Exercise your GDPR rights to access and delete your information.
        </Typography>
      </Box>

      {/* Success Alerts */}
      {exportSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setExportSuccess(false)}>
          Your data has been exported successfully!
        </Alert>
      )}

      {deleteSuccess && (
        <Alert severity="info" sx={{ mb: 3 }}>
          All your UXercise data has been deleted. You will be asked to consent to cookies again on your next visit.
        </Alert>
      )}

      {/* Data We Store */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Data We Store Locally
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          All data is stored locally in your browser. We do not send this information to any servers.
        </Typography>

        <List>
          {dataItems.map((item, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon>
                <FolderIcon sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                secondary={item.description}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Export Data Section */}
      <Paper
        sx={{
          p: 4,
          mb: 3,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <DownloadIcon sx={{ color: 'primary.main', mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Export Your Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              Download all your UXercise data as a JSON file. This includes your cookie preferences, workout planner data, and any saved settings.
              <Box component="span" sx={{ display: 'block', mt: 1, fontWeight: 500, color: 'text.primary' }}>
                GDPR Article 15 — Right of Access
              </Box>
            </Typography>
            <Button
              variant="contained"
              onClick={handleExportData}
              startIcon={<DownloadIcon />}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E64A19 0%, #FF6B35 100%)',
                },
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Export My Data
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Delete Data Section */}
      <Paper
        sx={{
          p: 4,
          background: 'rgba(255, 107, 53, 0.05)',
          border: '1px solid rgba(255, 107, 53, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <WarningAmberIcon sx={{ color: 'error.main', mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'error.light' }}>
              Delete Your Data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              Permanently delete all your UXercise data from this browser. This action cannot be undone. You will lose all workout planner data and will need to set your cookie preferences again.
              <Box component="span" sx={{ display: 'block', mt: 1, fontWeight: 500, color: 'text.primary' }}>
                GDPR Article 17 — Right to Erasure
              </Box>
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setDeleteDialogOpen(true)}
              startIcon={<DeleteForeverIcon />}
              sx={{
                color: 'error.light',
                borderColor: 'error.light',
                '&:hover': {
                  borderColor: 'error.main',
                  background: 'rgba(244, 67, 54, 0.1)',
                },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Delete My Data
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Additional Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Have questions about your privacy?{' '}
          <Box
            component="a"
            href="/privacy-policy"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Read our Privacy Policy
          </Box>
          {' or '}
          <Box
            component="a"
            href="/contact"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            contact us
          </Box>
          .
        </Typography>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background: '#1E1E1E',
            borderRadius: 2,
            border: '1px solid rgba(255, 107, 53, 0.3)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'error.light', fontWeight: 600 }}>
          Confirm Data Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete all your UXercise data?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will permanently remove:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText
                primary="Cookie consent preferences"
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText
                primary="Workout planner data"
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </ListItemIcon>
              <ListItemText
                primary="All saved preferences"
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
          </List>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone!
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteData}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
              },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Delete All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
