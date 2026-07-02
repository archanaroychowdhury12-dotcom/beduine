import { expect, test } from '@playwright/test';

test.describe('Beduine production user flow', () => {
  test('public CTAs preserve intended destinations', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /join now|join beduine club/i }).first().click();
    await expect(page).toHaveURL(/\/login\?/);
    expect(new URL(page.url()).searchParams.get('next')).toBe('/landing');

    await page.goto('/');
    await page.getByRole('link', { name: /customize tour/i }).first().click();
    await expect(page).toHaveURL(/\/paid-tour#customize$/);
    await expect(page.getByRole('heading', { name: /customize your tour package/i })).toBeVisible();
  });

  test('unauthenticated customer cannot render admin data', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText(/admin login required|restricted/i).first()).toBeVisible();
    await expect(page.getByText(/user management|cancellation and refund review/i)).toHaveCount(0);
  });

  test('credential-backed Razorpay staging flow', async ({ page }) => {
    test.skip(
      process.env.E2E_RAZORPAY_TEST_CREDENTIALS_AVAILABLE !== 'true',
      'Razorpay staging credentials are not configured.',
    );
    await page.goto('/paid-tour');
    await expect(page.getByText(/tour|travel|book/i).first()).toBeVisible();
  });
});
