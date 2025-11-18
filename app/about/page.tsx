import { Container, Typography, Box, Paper, Divider } from '@mui/material';

export const metadata = {
  title: 'About UXercise - Our Philosophy',
  description: 'Learn about UXercise and our mission to make fitness accessible through user-friendly tools and resources.',
};

export default function About() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          About UXercise
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            What We Do
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            UXercise is a fitness resource platform designed with one core principle: make strength
            training and fitness information accessible, understandable, and actionable for beginners.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            We believe that fitness information shouldn't be overwhelming, confusing, or hidden behind
            paywalls. UXercise provides practical tools, curated resources, and clear educational
            content—all with a focus on excellent user experience.
          </Typography>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            Our Philosophy
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Simplicity Over Complexity
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Fitness doesn't need to be complicated. We cut through the noise and focus on
              fundamental principles that actually matter for beginners and intermediate lifters.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              UX-First Design
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Every tool, article, and feature is designed with user experience at the forefront.
              We prioritize clarity, accessibility, and intuitive interfaces that make fitness
              planning easier, not harder.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Educational, Not Prescriptive
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              We provide information and tools to help you make informed decisions about your
              training. UXercise is not a coaching service, personal trainer, or medical advisor—we're
              an educational resource that empowers you to take control of your fitness journey.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Beginner-Friendly Focus
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              While experienced lifters are welcome, our primary audience is beginners and casual
              lifters who want straightforward, actionable information without the intimidation
              factor often found in fitness spaces.
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            What Makes UXercise Different
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            UXercise is built entirely on the frontend—no backend, no database, no user accounts,
            no tracking. The demo workout planner stores your data locally in your browser, giving
            you complete control and privacy.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            We're not trying to sell you a subscription, collect your data, or push proprietary
            programs. We curate and organize existing free resources, provide useful calculators,
            and offer educational content—all in one accessible place.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Our marketplace and resource links are transparently marked when they include affiliate
            relationships, and we only recommend products and resources we genuinely believe are valuable.
          </Typography>
        </Paper>

        <Paper sx={{ p: 4, mb: 4, backgroundColor: 'rgba(255, 107, 53, 0.08)' }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
            Important Disclaimer
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            UXercise provides general educational information only. We are not medical professionals,
            certified trainers, or registered dietitians. The information on this site should not be
            considered medical advice, and you should always consult with qualified healthcare and
            fitness professionals before beginning any new exercise program, making significant dietary
            changes, or if you have any health concerns.
          </Typography>
        </Paper>

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Ready to get started?
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Explore our resources, try our calculators, or dive into our educational articles.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
