/**
 * Login page with OAuth provider buttons
 */

import { redirect } from 'next/navigation';
import { Box, Container, Typography, Button, Stack, Card, CardContent, SvgIcon } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { auth, signIn } from '@/lib/auth';

// Discord icon as SVG component
function DiscordIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
    </SvgIcon>
  );
}

export default async function LoginPage() {
  const session = await auth();

  // If already logged in, redirect to dashboard
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #050608 0%, #0E1117 100%)',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3} alignItems="center">
              {/* Logo and Title */}
              <Stack direction="row" spacing={1} alignItems="center">
                <FitnessCenterIcon sx={{ fontSize: 40, color: 'primary.main' }} aria-hidden="true" />
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  UXercise
                </Typography>
              </Stack>

              <Typography variant="h5" fontWeight={600} textAlign="center">
                Welcome Back
              </Typography>

              <Typography variant="body1" color="text.secondary" textAlign="center">
                Sign in to continue tracking your strength journey
              </Typography>

              {/* OAuth Buttons */}
              <Stack spacing={2} sx={{ width: '100%', mt: 2 }}>
                <form
                  action={async () => {
                    'use server';
                    await signIn('google', { redirectTo: '/dashboard' });
                  }}
                >
                  <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<GoogleIcon />}
                    sx={{
                      py: 1.5,
                      justifyContent: 'flex-start',
                      pl: 3,
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(226, 88, 34, 0.08)',
                      },
                    }}
                    aria-label="Sign in with Google"
                  >
                    Continue with Google
                  </Button>
                </form>

                <form
                  action={async () => {
                    'use server';
                    await signIn('microsoft', { redirectTo: '/dashboard' });
                  }}
                >
                  <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<MicrosoftIcon />}
                    sx={{
                      py: 1.5,
                      justifyContent: 'flex-start',
                      pl: 3,
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(226, 88, 34, 0.08)',
                      },
                    }}
                    aria-label="Sign in with Microsoft"
                  >
                    Continue with Microsoft
                  </Button>
                </form>

                <form
                  action={async () => {
                    'use server';
                    await signIn('discord', { redirectTo: '/dashboard' });
                  }}
                >
                  <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    size="large"
                    startIcon={<DiscordIcon />}
                    sx={{
                      py: 1.5,
                      justifyContent: 'flex-start',
                      pl: 3,
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'rgba(226, 88, 34, 0.08)',
                      },
                    }}
                    aria-label="Sign in with Discord"
                  >
                    Continue with Discord
                  </Button>
                </form>
              </Stack>

              <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
