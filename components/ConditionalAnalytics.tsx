'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { canUseAnalytics, canUseMarketing } from '@/utils/cookieConsent';

/**
 * Conditionally loads analytics and marketing scripts based on cookie consent
 * GDPR/CCPA/ePrivacy compliant - no tracking without explicit consent
 */
export default function ConditionalAnalytics() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check initial consent state
    const checkConsent = () => {
      setAnalyticsEnabled(canUseAnalytics());
      setMarketingEnabled(canUseMarketing());
    };

    checkConsent();

    // Listen for consent changes
    const handleConsentChange = () => {
      checkConsent();
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);

    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);

  // Don't render during SSR
  if (!isClient) return null;

  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE;

  return (
    <>
      {/* Google Analytics - Only load if analytics consent given */}
      {analyticsEnabled && analyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsId}', {
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure'
              });
            `}
          </Script>
        </>
      )}

      {/* Google AdSense - Only load if marketing consent given */}
      {marketingEnabled && adsenseId && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
