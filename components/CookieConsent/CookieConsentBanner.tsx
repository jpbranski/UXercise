'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Slide } from '@mui/material';
import {
  hasConsent,
  acceptAllCookies,
  rejectAllCookies,
} from '@/utils/cookieConsent';
import CookiePreferencesModal from './CookiePreferencesModal';

/**
 * Cookie Consent Banner
 * GDPR/CCPA/ePrivacy compliant banner that appears at bottom of screen
 */
export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user has already consented
    const userHasConsented = hasConsent();
    setShowBanner(!userHasConsented);
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setShowBanner(false);
    // Reload to activate tracking scripts
    window.location.reload();
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setShowBanner(false);
  };

  const handleCustomize = () => {
    setShowModal(true);
  };

  const handleModalClose = (saved: boolean) => {
    setShowModal(false);
    if (saved) {
      setShowBanner(false);
      // Reload to activate/deactivate tracking scripts
      window.location.reload();
    }
  };

  // Don't render during SSR
  if (!isClient) return null;

  return (
    <>
      <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: 'rgba(30, 30, 30, 0.98)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                py: { xs: 2.5, sm: 3 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'stretch', md: 'center' },
                gap: { xs: 2, md: 3 },
              }}
            >
              {/* Message */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 0.5,
                    fontWeight: 500,
                    color: 'text.primary',
                  }}
                >
                  We value your privacy
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  We use cookies to enhance your browsing experience, provide analytics, and deliver personalized content.
                  You can customize your preferences or accept all cookies to continue.
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  alignItems: 'stretch',
                  minWidth: { md: 'auto' },
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
                    px: 3,
                  }}
                >
                  Reject All
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleCustomize}
                  sx={{
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.light',
                      background: 'rgba(255, 107, 53, 0.1)',
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                  }}
                >
                  Customize
                </Button>

                <Button
                  variant="contained"
                  onClick={handleAcceptAll}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E64A19 0%, #FF6B35 100%)',
                    },
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                  }}
                >
                  Accept All
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Slide>

      {/* Preferences Modal */}
      {showModal && (
        <CookiePreferencesModal
          open={showModal}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
