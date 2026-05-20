import { test, expect } from '@playwright/test';

test.describe('Ochrona tras (middleware)', () => {
    test('strona /login jest dostępna publicznie', async ({ page }) => {
        const res = await page.goto('/login');
        expect(res?.status()).toBeLessThan(400);
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('strona / jest dostępna publicznie', async ({ page }) => {
        const res = await page.goto('/');
        expect(res?.status()).toBeLessThan(400);
    });

    test('strona /clinics jest dostępna publicznie', async ({ page }) => {
        const res = await page.goto('/clinics');
        expect(res?.status()).toBeLessThan(400);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('niezalogowany użytkownik na /dashboard jest przekierowany do /login', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/\/login/, { timeout: 8_000 });
    });

    test('niezalogowany użytkownik na /staff jest przekierowany do /login', async ({ page }) => {
        await page.goto('/staff');
        await expect(page).toHaveURL(/\/login/, { timeout: 8_000 });
    });

    test('niezalogowany użytkownik na /admin jest przekierowany do /login', async ({ page }) => {
        await page.goto('/admin');
        await expect(page).toHaveURL(/\/login/, { timeout: 8_000 });
    });
});
