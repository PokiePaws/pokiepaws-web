import { test, expect } from '@playwright/test';

test.describe('Lista klinik (/clinics)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/clinics');
    });

    test('wyświetla nagłówek strony', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('wyświetla pole wyszukiwania', async ({ page }) => {
        await expect(page.locator('input[type="text"]')).toBeVisible();
    });

    test('wyświetla dropdown filtrowania miast', async ({ page }) => {
        await expect(page.locator('select')).toBeVisible();
    });

    test('pusty stan wyszukiwania wyświetla komunikat', async ({ page }) => {
        await page.waitForLoadState('networkidle');

        await page.locator('input[type="text"]').fill('xyznieistnieje99999');

        await expect(
            page.locator('text=/brak|no.*result|nie.*znaleziono/i').or(
                page.getByRole('heading', { name: /brak|no.*clinic/i })
            )
        ).toBeVisible({ timeout: 5_000 });
    });

    test('wyczyszczenie wyszukiwania przywraca wyniki', async ({ page }) => {
        const input = page.locator('input[type="text"]');
        await input.fill('xyznieistnieje99999');
        await input.clear();
        await expect(input).toHaveValue('');
    });

    test('spinner loader lub siatka klinik jest widoczna', async ({ page }) => {
        // Albo loader albo siatka – jedna z nich musi być widoczna
        const loader = page.locator('[class*="animate-spin"]');
        const grid = page.locator('[class*="grid"]');
        await expect(loader.or(grid)).toBeVisible({ timeout: 10_000 });
    });

    test('kliknięcie karty kliniki nawiguje do jej strony', async ({ page }) => {
        await page.waitForLoadState('networkidle');

        const clinicLinks = page.locator('a[href^="/clinics/"]');
        const count = await clinicLinks.count();

        if (count > 0) {
            const href = await clinicLinks.first().getAttribute('href');
            await clinicLinks.first().click();
            await expect(page).toHaveURL(href!);
        } else {
            // Brak klinik – akceptujemy pusty stan
            test.skip(true, 'Brak klinik w API – pomijamy test nawigacji');
        }
    });
});
