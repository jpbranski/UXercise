/**
 * Root layout for UXercise
 * Sets up MUI theme, Inter font, and metadata
 */

import type { Metadata } from 'next';
import { ThemeRegistry } from '@/components/providers/ThemeRegistry';
import { clientEnv } from '@/env';
import './globals.css';

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
    <html lang="en">
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
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
