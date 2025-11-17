/**
 * Landing page for UXercise
 * Dark hero with CTA to get started
 */

import Link from 'next/link';
import { Box, Container, Typography, Button, Stack, Card, CardContent, Grid } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  // If user is already logged in, redirect to dashboard
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #050608 0%, #0E1117 100%)',
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            pt: { xs: 8, md: 12 },
            pb: { xs: 6, md: 8 },
            textAlign: 'center',
          }}
        >
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
            <FitnessCenterIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                background: 'linear-gradient(90deg, #E25822 0%, #FF7043 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              UXercise
            </Typography>
          </Stack>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 600,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Smart Strength Training for Everyone
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              mb: 4,
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Build custom workout programs, track your progress, and watch your strength grow with data-driven insights.
            Perfect for novices to semi-serious lifters.
          </Typography>

          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.125rem',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(226, 88, 34, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 24px rgba(226, 88, 34, 0.6)',
              },
            }}
            aria-label="Get started with UXercise"
          >
            Get Started
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: { xs: 6, md: 8 } }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 600,
              textAlign: 'center',
              mb: 6,
            }}
          >
            Everything You Need to Level Up
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <CalendarTodayIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} aria-hidden="true" />
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Program Builder
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create weekly or bi-weekly programs tailored to your goals and schedule.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <FitnessCenterIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} aria-hidden="true" />
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Workout Logger
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quickly log your sets, reps, and weights. Track warmup and working sets.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} aria-hidden="true" />
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Progressive Overload
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    See your volume trends and ensure you're progressing week over week.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <BarChartIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} aria-hidden="true" />
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track body weight, view workout history, and analyze your performance.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: { xs: 6, md: 8 }, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Ready to start your strength journey?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sign up now and take control of your training.
          </Typography>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.125rem',
              fontWeight: 600,
            }}
            aria-label="Sign up for UXercise"
          >
            Sign Up Free
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          py: 4,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © {new Date().getFullYear()} UXercise. Built for lifters, by lifters.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
