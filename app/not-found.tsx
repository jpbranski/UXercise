'use client';

import Link from 'next/link';
import { Box, Button, Typography, Container } from '@mui/material';
import Image from 'next/image';

export default function NotFound() {
  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        textAlign: 'center',
        py: 10,
      }}
    >
      {/* Background logo watermark */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <Image
          src="/images/logo.webp"
          alt="UXercise Logo Background"
          width={400}
          height={400}
          style={{
            objectFit: 'contain',
            filter: 'grayscale(100%)',
          }}
        />
      </Box>

      {/* Foreground content */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h2"
          fontWeight={700}
          sx={{
            mb: 2,
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
        >
          Looks like this workout wandered off the plan.  
          The page you're trying to access doesn’t exist—or maybe it just skipped leg day.
        </Typography>

        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
            fontWeight: 700,
          }}
        >
          Return Home
        </Button>
      </Box>
    </Container>
  );
}
