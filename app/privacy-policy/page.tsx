import { Container, Typography, Box, Paper } from '@mui/material';

export const metadata = {
  title: 'Privacy Policy - UXercise',
  description: 'Privacy policy for UXercise fitness platform.',
};

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Privacy Policy
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
            Last Updated: January 2025
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Our Commitment to Privacy
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise is built with privacy in mind. We do not collect, store, or transmit any personal
            data to servers. This site is entirely frontend-based with no backend infrastructure.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Data Collection
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            <strong>We do not collect any personal information.</strong> UXercise does not:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Track user behavior or analytics</li>
            <li>Use cookies for tracking purposes</li>
            <li>Collect email addresses or contact information</li>
            <li>Store any data on external servers</li>
            <li>Integrate with third-party tracking services</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Local Storage
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            The Demo Workout Planner uses browser localStorage to save your workout data locally on
            your device. This data:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Remains on your device only</li>
            <li>Is never transmitted to any server</li>
            <li>Can be cleared at any time by clearing your browser data</li>
            <li>Is completely under your control</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            External Links
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise provides links to external websites and resources. We are not responsible for
            the privacy practices of these third-party sites. Please review their privacy policies
            before providing any personal information.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Affiliate Links
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Some product links may include affiliate codes. Clicking these links may allow third
            parties to track that you came from UXercise, but we do not share any personal information
            with affiliate partners.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Changes to This Policy
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We may update this privacy policy from time to time. Any changes will be posted on this
            page with an updated revision date.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Contact
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            If you have questions about this privacy policy, please contact us at contact@uxercise.com.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
