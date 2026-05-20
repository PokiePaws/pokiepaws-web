import { test, expect } from '@playwright/test';

test.describe('Strona logowania', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('wyświetla formularz z polami email i hasło', async ({ page }) => {
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('wyświetla przycisk submit', async ({ page }) => {
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('wyświetla logo i tytuł PokiePaws', async ({ page }) => {
        await expect(page.getByAltText('Logo')).toBeVisible();
        await expect(page.getByText(/pokie paws/i).first()).toBeVisible();
    });

    test('pusty formularz nie przechodzi walidacji HTML5', async ({ page }) => {
        await page.locator('button[type="submit"]').click();
        // Przeglądarka zablokuje submit – pozostajemy na /login
        await expect(page).toHaveURL('/login');
    });

    test('wyświetla błąd przy nieprawidłowych danych logowania', async ({ page }) => {
        await page.locator('input[type="email"]').fill('bledny@example.com');
        await page.locator('input[type="password"]').fill('BledneHaslo1!');
        await page.locator('button[type="submit"]').click();

        // Komunikat błędu powinien pojawić się po odpowiedzi API
        const error = page.locator('[class*="red"]').filter({ hasText: /.+/ });
        await expect(error.first()).toBeVisible({ timeout: 10_000 });
    });

    test('wyświetla spinner podczas ładowania', async ({ page }) => {
        // Spowalniamy odpowiedź /api/auth/login
        await page.route('**/api/auth/login', async (route) => {
            await new Promise((r) => setTimeout(r, 800));
            await route.continue();
        });

        await page.locator('input[type="email"]').fill('user@example.com');
        await page.locator('input[type="password"]').fill('Password123!');
        await page.locator('button[type="submit"]').click();

        // Spinner (animate-spin) powinien być widoczny chwilę
        await expect(page.locator('[class*="animate-spin"]')).toBeVisible({ timeout: 2_000 });
    });

    test('link "Forgot your password?" jest widoczny', async ({ page }) => {
        await expect(page.getByRole('link', { name: /forgot/i })).toBeVisible();
    });

    test('logo jako link prowadzi na stronę główną', async ({ page }) => {
        await page.getByRole('link', { name: /pokie paws/i }).first().click();
        await expect(page).toHaveURL('/');
    });
});
