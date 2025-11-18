import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalculateIcon from '@mui/icons-material/Calculate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%)',
          borderRadius: 2,
          mt: 4,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FF6B35 0%, #9D4EDD 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          UXercise
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
          Beginner-friendly training tools, built with UX in mind
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/resources"
            variant="contained"
            size="large"
            startIcon={<FitnessCenterIcon />}
          >
            Explore Resources
          </Button>
          <Button
            component={Link}
            href="/calculators"
            variant="outlined"
            size="large"
            startIcon={<CalculateIcon />}
          >
            Try Calculators
          </Button>
          <Button
            component={Link}
            href="/articles"
            variant="outlined"
            size="large"
            startIcon={<MenuBookIcon />}
          >
            Read Articles
          </Button>
        </Box>
      </Box>

      {/* About Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          What is UXercise?
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.8 }}>
          UXercise is a collection of beginner-friendly fitness tools and resources designed with
          user experience at the forefront. Whether you're just starting your strength training
          journey or looking for simple, practical tools to support your workouts, UXercise has you covered.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.8 }}>
          We focus on simplicity, clarity, and accessibility—making fitness information and tools
          easy to understand and use, without the overwhelming complexity often found elsewhere.
        </Typography>
      </Box>

      {/* Highlights Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          What We Offer
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalculateIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    Tools & Calculators
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Practical calculators for BMI, TDEE, 1RM estimation, and plate loading.
                  Quick, simple tools to support your training decisions.
                </Typography>
                <Button
                  component={Link}
                  href="/calculators"
                  sx={{ mt: 2 }}
                  variant="text"
                  color="primary"
                >
                  Explore Calculators →
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    Guides & Articles
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Educational articles covering strength training basics, nutrition fundamentals,
                  recovery strategies, and more—written for beginners.
                </Typography>
                <Button
                  component={Link}
                  href="/articles"
                  sx={{ mt: 2 }}
                  variant="text"
                  color="primary"
                >
                  Read Articles →
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    Marketplace
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Curated selection of training equipment and fitness products.
                  Find quality gear for your home gym or training needs.
                </Typography>
                <Button
                  component={Link}
                  href="/marketplace"
                  sx={{ mt: 2 }}
                  variant="text"
                  color="primary"
                >
                  Browse Marketplace →
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Disclaimer */}
      <Box sx={{ py: 4, mb: 4 }}>
        <Alert severity="info" sx={{ fontSize: '0.95rem' }}>
          <strong>Important:</strong> UXercise is an educational resource, not a coaching service.
          The information provided is for general educational purposes only and should not be considered
          medical advice. Always consult with a qualified healthcare professional before starting any
          new exercise or nutrition program.
        </Alert>
      </Box>
    </Container>
  );
}
