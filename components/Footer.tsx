'use client';

import Link from 'next/link';
import { Box, Container, Typography, Grid, Link as MuiLink, Divider } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const footerLinks = {
  main: [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Resources', path: '/resources' },
    { title: 'Articles', path: '/articles' },
    { title: 'Marketplace', path: '/marketplace' },
    { title: 'Calculators', path: '/calculators' },
    { title: 'Contact', path: '/contact' },
  ],
  legal: [
    { title: 'Privacy Policy', path: '/privacy-policy' },
    { title: 'Terms of Service', path: '/terms' },
    { title: 'Accessibility', path: '/accessibility' },
  ],
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  UX
                </Box>
                <Box component="span" sx={{ color: '#B0B0B0' }}>
                  ercise
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                Beginner-friendly training tools, built with UX in mind.
              </Typography>
            </Box>
          </Grid>

          {/* Main Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.main.map((link) => (
                <MuiLink
                  key={link.path}
                  component={Link}
                  href={link.path}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.title}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.legal.map((link) => (
                <MuiLink
                  key={link.path}
                  component={Link}
                  href={link.path}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.title}
                </MuiLink>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} UXercise. All rights reserved.
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              color: 'rgba(176, 176, 176, 0.7)',
            }}
          >
            Designed by{' '}
            <MuiLink
              href="https://jpbranski.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'rgba(176, 176, 176, 0.9)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'color 0.2s',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              JP Branski
              <OpenInNewIcon sx={{ fontSize: 12 }} />
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
