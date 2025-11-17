/**
 * Root layout for UXercise
 * Sets up MUI theme, Inter font, and metadata
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { uxerciseTheme } from '@/theme/uxerciseTheme';
import { clientEnv } from '@/env';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UXercise - Smart Strength Training',
  description:
    'Track your strength training progress with UXercise. Build custom programs, log workouts, and analyze your progressive overload.',
  keywords: ['fitness', 'strength training', 'workout tracker', 'progressive overload', 'gym', 'weightlifting'],
  authors: [{ name: 'UXercise Team' }],
  themeColor: '#E25822', // Fox-fur orange
  manifest: '/manifest.json',
  openGraph: {
    title: 'UXercise - Smart Strength Training',
    description: 'Track your strength training progress with data-driven insights',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UXercise - Smart Strength Training',
    description: 'Track your strength training progress with data-driven insights',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {clientEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${clientEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${clientEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={uxerciseTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
