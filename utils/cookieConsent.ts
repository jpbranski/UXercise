/**
 * Cookie Consent Management Utilities
 * GDPR, CCPA, and ePrivacy compliant
 */

export interface CookiePreferences {
  necessary: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  doNotSell: boolean; // CCPA "Do Not Sell or Share My Personal Information"
  timestamp: number;
  version: string; // For tracking policy changes
}

export const CONSENT_STORAGE_KEY = 'uxercise-cookie-consent';
export const CONSENT_VERSION = '1.0';

/**
 * Get default (no consent) preferences
 */
export function getDefaultPreferences(): CookiePreferences {
  return {
    necessary: true, // Always enabled
    analytics: false,
    marketing: false,
    personalization: false,
    doNotSell: true, // Default to NOT selling data (privacy-first)
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
}

/**
 * Load consent preferences from localStorage
 */
export function loadConsentPreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as CookiePreferences;

    // Check if version matches current version
    if (parsed.version !== CONSENT_VERSION) {
      // Policy changed, re-ask for consent
      return null;
    }

    // Ensure necessary is always true
    parsed.necessary = true;

    return parsed;
  } catch (error) {
    console.error('Error loading cookie preferences:', error);
    return null;
  }
}

/**
 * Save consent preferences to localStorage
 */
export function saveConsentPreferences(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return;

  try {
    // Ensure necessary is always true
    const toSave = {
      ...preferences,
      necessary: true,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(toSave));

    // Dispatch custom event so other parts of app can react
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: toSave }));
  } catch (error) {
    console.error('Error saving cookie preferences:', error);
  }
}

/**
 * Accept all cookies (opt-in to everything except doNotSell)
 */
export function acceptAllCookies(): CookiePreferences {
  const preferences: CookiePreferences = {
    necessary: true,
    analytics: true,
    marketing: true,
    personalization: true,
    doNotSell: false, // User accepts data sharing
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  saveConsentPreferences(preferences);
  return preferences;
}

/**
 * Reject all non-necessary cookies
 */
export function rejectAllCookies(): CookiePreferences {
  const preferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
    doNotSell: true, // User opts out of data sharing
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  saveConsentPreferences(preferences);
  return preferences;
}

/**
 * Check if user has given consent
 */
export function hasConsent(): boolean {
  return loadConsentPreferences() !== null;
}

/**
 * Check if analytics are enabled
 */
export function canUseAnalytics(): boolean {
  const preferences = loadConsentPreferences();
  if (!preferences) return false;
  return preferences.analytics && !preferences.doNotSell;
}

/**
 * Check if marketing cookies are enabled
 */
export function canUseMarketing(): boolean {
  const preferences = loadConsentPreferences();
  if (!preferences) return false;
  return preferences.marketing && !preferences.doNotSell;
}

/**
 * Check if personalization is enabled
 */
export function canUsePersonalization(): boolean {
  const preferences = loadConsentPreferences();
  if (!preferences) return false;
  return preferences.personalization;
}

/**
 * Delete all consent data
 */
export function deleteConsentData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: null }));
  } catch (error) {
    console.error('Error deleting consent data:', error);
  }
}
