/**
 * E2E tests for landing page and authentication flow
 */

import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display landing page with branding', async ({ page }) => {
    await page.goto('/');

    // Check for UXercise branding
    await expect(page.locator('text=UXercise')).toBeVisible();

    // Check for hero text
    await expect(page.locator('text=Smart Strength Training for Everyone')).toBeVisible();

    // Check for CTA button
    const ctaButton = page.locator('a[href="/login"]').first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveText(/Get Started/i);
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');

    // Check for feature cards
    await expect(page.locator('text=Program Builder')).toBeVisible();
    await expect(page.locator('text=Workout Logger')).toBeVisible();
    await expect(page.locator('text=Progressive Overload')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');

    // Click the CTA button
    await page.locator('a[href="/login"]').first().click();

    // Wait for navigation
    await page.waitForURL('/login');

    // Verify we're on the login page
    await expect(page.locator('text=Welcome Back')).toBeVisible();
  });
});

test.describe('Login Page', () => {
  test('should display OAuth login options', async ({ page }) => {
    await page.goto('/login');

    // Check for login heading
    await expect(page.locator('text=Welcome Back')).toBeVisible();

    // Check for OAuth buttons
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
    await expect(page.locator('button:has-text("Continue with Microsoft")')).toBeVisible();
    await expect(page.locator('button:has-text("Continue with Discord")')).toBeVisible();
  });

  test('should have accessible OAuth buttons', async ({ page }) => {
    await page.goto('/login');

    // Check aria-labels for accessibility
    const googleButton = page.locator('button[aria-label="Sign in with Google"]');
    await expect(googleButton).toBeVisible();

    const microsoftButton = page.locator('button[aria-label="Sign in with Microsoft"]');
    await expect(microsoftButton).toBeVisible();

    const discordButton = page.locator('button[aria-label="Sign in with Discord"]');
    await expect(discordButton).toBeVisible();
  });

  test('should display branding consistently', async ({ page }) => {
    await page.goto('/login');

    // Check for logo
    await expect(page.locator('text=UXercise').first()).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');

    // Tab through elements
    await page.keyboard.press('Tab');

    // Check that focused element is visible and has focus styling
    const focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/');

    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check for footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
