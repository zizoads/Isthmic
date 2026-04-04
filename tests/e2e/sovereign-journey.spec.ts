
import { test, expect } from '@playwright/test';

test.describe('Sovereign User Journey', () => {
  test('should allow a user to authenticate and engage Master Brain', async ({ page }) => {
    // 1. Landing & Auth
    await page.goto('/');
    await expect(page).toHaveTitle(/Isthmic/);
    
    // Check for login form
    const loginHeading = page.getByText('Isthmic.', { exact: true });
    await expect(loginHeading).toBeVisible();

    // 2. Simulated Login (Using environment test accounts)
    await page.fill('input[type="email"]', 'test@isthmic.pro');
    await page.fill('input[type="password"]', 'SovereignPass123!');
    await page.click('button:has-text("ESTABLISH LINK")');

    // 3. Navigation to Intelligence Hub
    const hubTitle = page.getByText('Intelligence Hub', { exact: true });
    await expect(hubTitle).toBeVisible({ timeout: 10000 });

    // 4. Engage Master Brain
    await page.fill('textarea', 'Identify high-alpha domains in the renewable energy sector.');
    await page.click('button:has-text("Deploy Sovereign Protocol")');

    // 5. Verify Results Generation
    const manifest = page.getByText('Discovery Manifest.', { exact: true });
    await expect(manifest).toBeVisible({ timeout: 30000 });
  });
});
