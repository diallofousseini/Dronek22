import { test, expect } from '@playwright/test';

test('navigation renders key pages', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('dronek-cookie-consent', 'accepted');
      localStorage.setItem(
        'dronek-cookie-preferences',
        JSON.stringify({ necessary: true, analytics: true, marketing: true, personalization: true })
      );
    } catch {
      // ignore
    }
  });
  await page.goto('/');
  // Home hero heading exists
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Actualité
  await page.getByRole('navigation').getByRole('button', { name: /Actualit|News/i }).click();
  await expect(page.getByRole('heading', { name: /Actualit|News/i })).toBeVisible();

  // A propos / About (robust to accent encoding issues)
  await page.getByRole('navigation').getByRole('button', { name: /propos|about/i }).click();
  await expect(page.getByRole('heading', { name: /propos|about/i })).toBeVisible();

  // Sites de production
  await page.getByRole('navigation').getByRole('button', { name: /Sites de Production|Production Sites/i }).first().dispatchEvent('click');
  await expect(page.getByText(/Localisation de nos Sites/i)).toBeVisible();

  // Contact
  await page.getByRole('button', { name: /^Contact$/i }).first().dispatchEvent('click');
  await expect(page.getByRole('heading', { name: /Contact/i })).toBeVisible();
});

