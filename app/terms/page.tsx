import { Container, Typography, Box, Paper } from '@mui/material';

export const metadata = {
  title: 'Terms of Service - UXercise',
  description: 'Terms of service for UXercise fitness platform.',
};

export default function Terms() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Terms of Service
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
            Last Updated: January 2025
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Acceptance of Terms
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            By accessing and using UXercise, you accept and agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use this website.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Educational Purpose Only
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise provides general educational information about fitness, strength training, and
            nutrition. This information is:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>For educational and informational purposes only</li>
            <li>Not intended as medical, health, or professional advice</li>
            <li>Not a substitute for professional medical consultation</li>
            <li>Not personalized to your individual circumstances</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            No Professional Relationship
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Using UXercise does not create a trainer-client, doctor-patient, or any other professional
            relationship. We are not certified trainers, medical professionals, or registered dietitians.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Assumption of Risk
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Physical exercise carries inherent risks. Before beginning any exercise program or making
            dietary changes, you should:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Consult with a qualified healthcare professional</li>
            <li>Obtain medical clearance if you have any health conditions</li>
            <li>Understand and accept the risks involved in physical training</li>
            <li>Use proper form and appropriate weights for your fitness level</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Disclaimer of Warranties
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise is provided "as is" without any warranties of any kind. We make no guarantees about:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>The accuracy or completeness of information</li>
            <li>Results from using our calculators or tools</li>
            <li>Availability or functionality of the website</li>
            <li>Quality or safety of linked external resources</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Limitation of Liability
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            To the fullest extent permitted by law, UXercise and its creators shall not be liable for
            any injuries, damages, or losses resulting from use of this website or information provided.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            External Links
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise contains links to external websites and resources. We are not responsible for:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Content, accuracy, or availability of linked sites</li>
            <li>Privacy practices of third-party websites</li>
            <li>Products or services offered by external sites</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Affiliate Disclosure
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Some links on UXercise may be affiliate links, clearly marked as such. We may receive
            compensation if you make purchases through these links, at no additional cost to you.
            We only recommend products and services we believe are valuable.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            User Content
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Data entered into the Demo Workout Planner is stored locally on your device using browser
            localStorage. You are responsible for backing up this data if desired. We are not responsible
            for any data loss.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Intellectual Property
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            All content on UXercise, including text, graphics, logos, and software, is the property
            of UXercise or its content creators. You may use the website for personal, non-commercial
            purposes only.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Changes to Terms
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We reserve the right to modify these terms at any time. Continued use of UXercise after
            changes constitutes acceptance of the updated terms.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Contact
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Questions about these terms? Contact us at contact@uxercise.com.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
