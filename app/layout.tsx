import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';
import Header from '@/components/Header';
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
            <Header />
            <main>{children}</main>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
