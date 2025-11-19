'use client';

import Link from 'next/link';
import { Container, Typography, Box, Paper, Link as MuiLink } from '@mui/material';

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Privacy Policy
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
            Last Updated: January 2025
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Our Commitment to Privacy
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise is committed to protecting your privacy and giving you control over your data. We believe in transparency
            and only collect data with your explicit consent. This privacy policy explains what data we collect, how we use it,
            and your rights under GDPR and CCPA.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            Cookie Consent & Your Choices
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We respect your privacy and comply with GDPR, CCPA, and ePrivacy regulations. When you first visit UXercise,
            you&apos;ll see a cookie consent banner. <strong>No tracking or analytics cookies are loaded until you explicitly opt in.</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            You can manage your cookie preferences at any time via the &quot;Cookie Preferences&quot; link in our footer.
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
            Cookie Categories
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              1. Strictly Necessary Cookies
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }}>
              These cookies are essential for the website to function. They store your cookie consent preferences.
              These cannot be disabled.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              2. Analytics Cookies (Optional)
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }}>
              We use Google Analytics to understand how visitors use our site. This helps us improve the user experience.
              Analytics cookies are only loaded if you consent. IP addresses are anonymized.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              3. Marketing Cookies (Optional)
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }}>
              We use Google AdSense to display relevant advertisements. Marketing cookies are only loaded if you consent.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              4. Personalization Cookies (Optional)
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: 'text.secondary' }}>
              These cookies remember your preferences (such as unit system selection) to provide a better experience.
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            Data We Collect
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
            1. Google Analytics (With Consent)
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            If you opt in to analytics cookies, we use Google Analytics to collect:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Pages visited and time spent on site</li>
            <li>Browser type and device information</li>
            <li>Anonymized IP addresses</li>
            <li>Referral sources (how you found our site)</li>
          </Box>
          <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.8, color: 'text.secondary' }}>
            This data is processed by Google and helps us understand how to improve UXercise. View{' '}
            <MuiLink href="https://policies.google.com/privacy" target="_blank" rel="noopener">
              Google&apos;s Privacy Policy
            </MuiLink>
            .
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
            2. Google AdSense (With Consent)
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            If you opt in to marketing cookies, we display ads via Google AdSense. Google may use cookies to show
            relevant advertisements based on your browsing history. View{' '}
            <MuiLink href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">
              Google&apos;s Advertising Policy
            </MuiLink>
            .
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
            3. Local Storage (No Consent Required)
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            The Demo Workout Planner stores your workout data locally in your browser using localStorage. This data:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Remains on your device only</li>
            <li>Is never transmitted to any server</li>
            <li>Can be exported or deleted via our{' '}
              <MuiLink component={Link} href="/data" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Data Management page
              </MuiLink>
            </li>
            <li>Is completely under your control</li>
          </Box>

          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            Your Privacy Rights
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
            GDPR Rights (EU Residents)
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Under the General Data Protection Regulation (GDPR), you have the following rights:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li><strong>Right of Access (Article 15):</strong> Export all your data via our{' '}
              <MuiLink component={Link} href="/data" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Data Management page
              </MuiLink>
            </li>
            <li><strong>Right to Erasure (Article 17):</strong> Delete all your data via our{' '}
              <MuiLink component={Link} href="/data" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Data Management page
              </MuiLink>
            </li>
            <li><strong>Right to Withdraw Consent:</strong> Change your cookie preferences anytime via the footer link</li>
            <li><strong>Right to Object:</strong> Opt out of analytics and marketing via cookie preferences</li>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
            CCPA Rights (California Residents)
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Under the California Consumer Privacy Act (CCPA), you have the following rights:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li><strong>Right to Know:</strong> See what data we collect via our cookie preferences modal</li>
            <li><strong>Right to Delete:</strong> Delete your data via our{' '}
              <MuiLink component={Link} href="/data" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Data Management page
              </MuiLink>
            </li>
            <li><strong>Right to Opt-Out of Sale:</strong> Use the &quot;Do Not Sell or Share My Personal Information&quot; toggle in cookie preferences</li>
          </Box>
          <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.8, color: 'text.secondary' }}>
            Note: We do not &quot;sell&quot; your data in the traditional sense, but CCPA considers sharing data with ad networks as a sale.
            The &quot;Do Not Sell&quot; option prevents us from loading Google AdSense.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            Data Sharing & Third Parties
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We do not sell, rent, or share your personal information except:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li><strong>Google Analytics:</strong> If you opt in to analytics cookies, anonymized usage data is processed by Google</li>
            <li><strong>Google AdSense:</strong> If you opt in to marketing cookies, Google may collect data to serve relevant ads</li>
          </Box>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We have no backend infrastructure. All data collected is either stored locally on your device or processed by
            Google (only with your consent).
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            External Links & Affiliate Disclosure
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise contains links to external websites and affiliate links. When you click an affiliate link, third parties
            may track that you came from UXercise. We do not share your personal information with affiliate partners. Please
            review the privacy policies of external sites before providing any personal information.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            Data Security
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Your workout planner data is stored locally in your browser and never transmitted to our servers (we don&apos;t have any!).
            Your cookie preferences are also stored locally. We use HTTPS to encrypt data in transit when loading third-party
            scripts (Google Analytics, AdSense) based on your consent.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            Children&apos;s Privacy
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            UXercise is not intended for children under 13. We do not knowingly collect information from children.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            Changes to This Policy
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We may update this privacy policy from time to time. If we make material changes, we will update the consent
            version, which will trigger a new consent request. Any changes will be posted on this page with an updated
            revision date.
          </Typography>

          <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 600 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            If you have questions about this privacy policy or want to exercise your privacy rights, please:
          </Typography>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Visit our{' '}
              <MuiLink component={Link} href="/data" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Data Management page
              </MuiLink>
              {' '}to export or delete your data
            </li>
            <li>Email us at contact@uxercise.com</li>
            <li>Manage your cookie preferences via the footer link</li>
          </Box>

          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              background: 'rgba(255, 107, 53, 0.05)',
              border: '1px solid rgba(255, 107, 53, 0.2)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Quick Links:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} href="/data" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                → Export or Delete Your Data
              </MuiLink>
              <MuiLink component="button" onClick={() => window.dispatchEvent(new CustomEvent('openCookiePreferences'))} sx={{ color: 'primary.main', textDecoration: 'none', textAlign: 'left', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', cursor: 'pointer', fontSize: 'inherit', '&:hover': { textDecoration: 'underline' } }}>
                → Manage Cookie Preferences
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
