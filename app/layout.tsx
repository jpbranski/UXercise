import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import theme from '@/theme/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsentBanner from '@/components/CookieConsent/CookieConsentBanner';
import ConditionalAnalytics from '@/components/ConditionalAnalytics';
import './globals.css';

export const metadata: Metadata = {
  title: 'UXercise - Beginner-Friendly Fitness Tools',
  description: 'UX-focused fitness resources, calculators, and training tools for beginners and casual lifters.',
  keywords: 'fitness, strength training, workout planner, fitness calculators, beginner fitness',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Conditional Analytics - Only loads with user consent */}
            <ConditionalAnalytics />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Header />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
            {/* Cookie Consent Banner - GDPR/CCPA/ePrivacy compliant */}
            <CookieConsentBanner />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
