import { expect, test } from '@playwright/test';

test.describe('Beduine app smoke coverage', () => {
  test('landing page renders the primary brand and plan CTA area', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Beduine/i);
    await expect(page.getByText(/Beduine/i).first()).toBeVisible();
    await expect(page.getByText(/subscription|membership|plan/i).first()).toBeVisible();
  });

  test('login fields appear after the welcome choice', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login|Beduine/i);
    await page.getByRole('button', { name: 'Log In to Your Account' }).click({ force: true });
    await expect(page.locator('#loginEmail')).toBeVisible();
    await expect(page.locator('#loginPassword')).toBeVisible();
  });

  test('admin route blocks non-admin users and points to admin login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText(/Admin Login Required|restricted/i).first()).toBeVisible();
  });

  test('admin login route is separate from customer login', async ({ page }) => {
    await page.goto('/admin-login');
    await expect(page.getByText(/Admin Login/i).first()).toBeVisible();
    await expect(page.locator('#adminEmail')).toBeVisible();
    await expect(page.locator('#adminPassword')).toBeVisible();
  });

  test('seeded demo customer and admin accounts authenticate into their own areas', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Log In to Your Account' }).click({ force: true });
    await page.getByRole('button', { name: /Use Demo Customer/i }).click();
    await expect(page.locator('#loginEmail')).toHaveValue('demo@beduine.com');
    await page.getByRole('button', { name: 'Log In', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto('/admin-login');
    await page.getByRole('button', { name: /Use Demo Admin/i }).click();
    await expect(page.locator('#adminEmail')).toHaveValue('admin@beduine.com');
    await page.getByRole('button', { name: 'Enter Admin Panel' }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('paid tour route loads booking/tour experience shell', async ({ page }) => {
    await page.goto('/paid-tour');
    await expect(page.getByText(/tour|travel|book/i).first()).toBeVisible();
  });

  test('club is protected and paid tours are public', async ({ page }) => {
    await page.goto('/landing');
    await expect(page).toHaveURL(/\/login\?next=%2Flanding$/);
    await page.goto('/paid-tour#customize');
    await expect(page).toHaveURL(/\/paid-tour#customize$/);
  });

  test('winners route stays public and reaches its public shell', async ({ page }) => {
    await page.goto('/winners');
    await expect(page).toHaveURL(/\/winners$/);
    await expect(page.getByRole('heading', { name: 'Beduine Public Winners' })).toBeVisible();
  });
});
