import { Container, Typography, Box, Paper, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';

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
                <Typography variant="body2" color="text.secondary">
                  contact@uxercise.com
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GitHubIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6">GitHub</Typography>
                <Typography variant="body2" color="text.secondary">
                  github.com/uxercise
                </Typography>
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
