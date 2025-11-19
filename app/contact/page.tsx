import { Container, Typography, Box, Paper, Alert, Link as MuiLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export const metadata = {
  title: 'Contact UXercise',
  description: 'Get in touch with the UXercise team.',
};

export default function Contact() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Contact Us
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Have questions, suggestions, or feedback about UXercise? We'd love to hear from you!
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">Email</Typography>
                <MuiLink
                  href="mailto:dev@jpbranski.com"
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                  }}
                >
                  dev@jpbranski.com
                </MuiLink>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">Website</Typography>
                <MuiLink
                  href="https://jpbranski.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  jpbranski.com
                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                </MuiLink>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Alert severity="info">
          <Typography variant="body2">
            <strong>Note:</strong> UXercise is an educational resource platform. We do not provide
            personalized training advice, coaching, or medical guidance. For specific health or fitness
            questions, please consult with qualified professionals.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
}
