import { Container, Typography, Box, Paper, Alert } from '@mui/material';

export const metadata = {
  title: 'Accessibility - UXercise',
  description: 'Accessibility commitment and features of UXercise.',
};

export default function Accessibility() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Accessibility
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Our Commitment
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise is committed to making our fitness resources and tools accessible to everyone,
            including people with disabilities. We believe that accessibility is not just good design—it's
            essential to our mission of making fitness information available to all.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Accessibility Features
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            We've implemented the following features to improve accessibility:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Semantic HTML elements for proper document structure</li>
            <li>WCAG AA compliant color contrast ratios</li>
            <li>Keyboard navigation support for all interactive elements</li>
            <li>Clear focus indicators for keyboard navigation</li>
            <li>Descriptive link text and button labels</li>
            <li>Alternative text for images and icons</li>
            <li>Responsive design for various screen sizes</li>
            <li>Clear and readable typography</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Standards Compliance
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
            These guidelines help ensure our content is accessible to people with a wide range of
            disabilities, including:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Visual impairments (blindness, low vision, color blindness)</li>
            <li>Motor impairments</li>
            <li>Auditory impairments</li>
            <li>Cognitive and learning disabilities</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Known Limitations
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            While we work continuously to improve accessibility, we acknowledge some current limitations:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Some third-party linked resources may not meet our accessibility standards</li>
            <li>Complex interactive features may require additional improvements</li>
            <li>Older browser versions may not fully support all accessibility features</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Ongoing Improvements
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Accessibility is an ongoing process. We are committed to:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Regular accessibility audits and testing</li>
            <li>Continuous improvement based on user feedback</li>
            <li>Staying current with accessibility best practices</li>
            <li>Training our team on accessibility standards</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Assistive Technology Compatibility
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise is designed to be compatible with:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
            <li>Screen magnification software</li>
            <li>Speech recognition software</li>
            <li>Keyboard-only navigation</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Browser and Device Support
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            For the best experience, we recommend using the latest versions of:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Google Chrome</li>
            <li>Mozilla Firefox</li>
            <li>Apple Safari</li>
            <li>Microsoft Edge</li>
          </Box>
        </Paper>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Report Accessibility Issues
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            If you encounter any accessibility barriers on UXercise, please let us know. We take all
            feedback seriously and will work to address issues promptly.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>Contact us at:</strong> accessibility@uxercise.com
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.8 }}>
            When reporting an issue, please include:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mt: 1 }}>
            <li>The page or feature where you encountered the issue</li>
            <li>A description of the problem</li>
            <li>The browser and assistive technology you're using</li>
            <li>Any error messages you received</li>
          </Box>
        </Alert>

        <Paper sx={{ p: 4, backgroundColor: 'rgba(157, 78, 221, 0.08)' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Third-Party Content
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            UXercise links to external websites and resources. While we strive to link only to
            accessible content, we cannot guarantee the accessibility of third-party websites.
            If you encounter accessibility issues on a linked site, please contact that site's
            administrators directly.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
