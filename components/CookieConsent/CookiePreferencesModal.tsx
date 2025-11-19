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
  Switch,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  CookiePreferences,
  loadConsentPreferences,
  saveConsentPreferences,
  getDefaultPreferences,
  acceptAllCookies,
  rejectAllCookies,
} from '@/utils/cookieConsent';

interface CookiePreferencesModalProps {
  open: boolean;
  onClose: (saved: boolean) => void;
  focusCCPA?: boolean; // Scroll to CCPA section if true
}

interface CookieCategory {
  key: keyof CookiePreferences;
  label: string;
  description: string;
  locked?: boolean;
  isCCPA?: boolean;
  tooltip?: string;
}

const cookieCategories: CookieCategory[] = [
  {
    key: 'necessary',
    label: 'Strictly Necessary',
    description: 'Essential cookies required for the website to function. These cannot be disabled.',
    locked: true,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
  },
  {
    key: 'marketing',
    label: 'Marketing',
    description: 'Used to track visitors across websites to display ads that are relevant and engaging.',
  },
  {
    key: 'personalization',
    label: 'Personalization',
    description: 'Allow the website to remember choices you make (such as your preferred units or theme) to provide enhanced features.',
  },
  {
    key: 'doNotSell',
    label: 'Do Not Sell or Share My Personal Information',
    description: 'CCPA Right: Prevent sharing of your data with third parties for advertising personalization.',
    isCCPA: true,
    tooltip: 'Prevents sharing data with third parties for advertising personalization.',
  },
];

export default function CookiePreferencesModal({
  open,
  onClose,
  focusCCPA = false,
}: CookiePreferencesModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(
    getDefaultPreferences()
  );

  useEffect(() => {
    if (open) {
      // Load existing preferences or use defaults
      const existing = loadConsentPreferences();
      setPreferences(existing || getDefaultPreferences());
    }
  }, [open]);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot toggle necessary cookies

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    saveConsentPreferences(preferences);
    onClose(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  const handleAcceptAll = () => {
    acceptAllCookies();
    onClose(true);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    onClose(true);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: '#1E1E1E',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          pb: 2,
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 600,
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Cookie Preferences
        </Typography>
        <IconButton
          onClick={handleCancel}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Manage your cookie preferences below. You can enable or disable different types of cookies. Note that blocking some types of cookies may impact your experience on our website.
        </Typography>

        {/* Cookie Categories */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {cookieCategories.map((category, index) => {
            const isEnabled = category.locked
              ? true
              : category.key === 'doNotSell'
              ? preferences[category.key] // doNotSell: ON means opt-out
              : preferences[category.key];

            return (
              <Box key={category.key}>
                {category.isCCPA && index > 0 && (
                  <Divider sx={{ mb: 2.5, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                )}

                <Box
                  id={category.isCCPA ? 'ccpa-section' : undefined}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    background: category.isCCPA
                      ? 'rgba(255, 107, 53, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: category.isCCPA
                      ? 'rgba(255, 107, 53, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: category.isCCPA
                        ? 'rgba(255, 107, 53, 0.08)'
                        : 'rgba(255, 255, 255, 0.04)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: category.isCCPA ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {category.label}
                      </Typography>
                      {category.tooltip && (
                        <Tooltip title={category.tooltip} arrow>
                          <InfoOutlinedIcon
                            sx={{
                              fontSize: 18,
                              color: 'text.secondary',
                              cursor: 'help',
                            }}
                          />
                        </Tooltip>
                      )}
                    </Box>

                    <Switch
                      checked={isEnabled}
                      onChange={() => handleToggle(category.key)}
                      disabled={category.locked}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'primary.main',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'primary.main',
                        },
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    {category.description}
                  </Typography>

                  {category.locked && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'inline-block',
                        mt: 1,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 0.5,
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      Always Active
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Additional Info */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 1.5,
            background: 'rgba(157, 78, 221, 0.05)',
            border: '1px solid rgba(157, 78, 221, 0.2)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            For more information about how we use cookies and process your data, please read our{' '}
            <Box
              component="a"
              href="/privacy-policy"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Privacy Policy
            </Box>
            .
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          p: 2.5,
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="outlined"
          onClick={handleRejectAll}
          sx={{
            color: 'text.secondary',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.05)',
            },
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Reject All
        </Button>

        <Button
          variant="outlined"
          onClick={handleAcceptAll}
          sx={{
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': {
              borderColor: 'primary.light',
              background: 'rgba(255, 107, 53, 0.1)',
            },
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Accept All
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            color: 'text.secondary',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.05)',
            },
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
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
          Save Preferences
        </Button>
      </DialogActions>
    </Dialog>
  );
}
