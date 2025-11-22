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

const MOBILE_WIDTHS: Record<MobileSize, number> = {
  'iphone-se': 375,
  'iphone-14': 390,
  'pixel': 412,
  'generic': 430,
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

  const frameWidth = device === 'mobile' ? MOBILE_WIDTHS[mobileSize] : 1024;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0a0a0a',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Utility Toolbar */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                DEMO PROTOTYPE CONTROLS
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
            elevation={device === 'mobile' ? 16 : 4}
            sx={{
              width: device === 'mobile' ? frameWidth : '100%',
              maxWidth: device === 'mobile' ? frameWidth : 1024,
              minHeight: device === 'mobile' ? '80vh' : '70vh',
              bgcolor: 'background.default',
              borderRadius: device === 'mobile' ? 4 : 2,
              overflow: 'hidden',
              border: device === 'mobile' ? '12px solid #1a1a1a' : 'none',
              transition: 'all 0.3s ease',
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
