'use client';

import { ReactNode, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { clearAllDemoData } from '@/lib/demo/storage';

interface DemoLayoutProps {
  children: ReactNode;
}

type DevicePreset = 'mobile' | 'desktop';
type MobileSize = 'iphone-se' | 'iphone-14' | 'pixel' | 'generic';

const MOBILE_SIZES: Record<MobileSize, { width: number; height: number }> = {
  'iphone-se': { width: 375, height: 667 },
  'iphone-14': { width: 390, height: 844 },
  'pixel': { width: 412, height: 915 },
  'generic': { width: 430, height: 900 },
};

export default function DemoLayout({ children }: DemoLayoutProps) {
  const [device, setDevice] = useState<DevicePreset>('mobile');
  const [mobileSize, setMobileSize] = useState<MobileSize>('iphone-14');

  const handleResetData = () => {
    if (confirm('Reset all demo data? This will clear workouts, logs, and your profile. This cannot be undone.')) {
      clearAllDemoData();
      window.location.reload();
    }
  };

  const frameDimensions = device === 'mobile' ? MOBILE_SIZES[mobileSize] : { width: 1024, height: 'auto' };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#121212',
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Utility Toolbar */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontWeight: 600, letterSpacing: 0.5 }}>
                PROTOTYPE CONTROLS — does not appear in real app
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                UXercise Fitness App
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Device Toggle */}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  View Mode
                </Typography>
                <ToggleButtonGroup
                  value={device}
                  exclusive
                  onChange={(_, newDevice) => newDevice && setDevice(newDevice)}
                  size="small"
                >
                  <ToggleButton value="mobile">
                    <PhoneAndroidIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                    Mobile
                  </ToggleButton>
                  <ToggleButton value="desktop">
                    <DesktopMacIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                    Desktop
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Mobile Size Selector */}
              {device === 'mobile' && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Screen Size
                  </Typography>
                  <ToggleButtonGroup
                    value={mobileSize}
                    exclusive
                    onChange={(_, newSize) => newSize && setMobileSize(newSize)}
                    size="small"
                  >
                    <ToggleButton value="iphone-se">SE</ToggleButton>
                    <ToggleButton value="iphone-14">14</ToggleButton>
                    <ToggleButton value="pixel">Pixel</ToggleButton>
                    <ToggleButton value="generic">430px</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}

              {/* Reset Button */}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Actions
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<RestartAltIcon />}
                  onClick={handleResetData}
                >
                  Reset Data
                </Button>
              </Box>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 2, fontSize: '0.8rem' }}>
            This is a prototype. All data is stored locally in your browser.
          </Alert>
        </Paper>

        {/* App Frame */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: device === 'mobile' ? frameDimensions.width : '100%',
              maxWidth: device === 'mobile' ? frameDimensions.width : 1024,
              height: device === 'mobile' ? frameDimensions.height : 'auto',
              minHeight: device === 'desktop' ? '70vh' : 'auto',
              bgcolor: 'background.default',
              borderRadius: device === 'mobile' ? 4 : 2,
              overflow: 'hidden',
              border: device === 'mobile' ? '14px solid #1a1a1a' : '1px solid',
              borderColor: device === 'mobile' ? '#1a1a1a' : 'divider',
              boxShadow: device === 'mobile'
                ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset'
                : '0 4px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </Paper>
        </Box>

        {/* Footer Note */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            UXercise Demo • Built with Next.js, React, and Material-UI
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
