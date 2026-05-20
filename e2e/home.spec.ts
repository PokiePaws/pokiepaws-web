import { test, expect } from '@playwright/test';

test.describe('Strona główna', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('ładuje się i wyświetla hero z polem wyszukiwania', async ({ page }) => {
        await expect(page.getByRole('textbox').first()).toBeVisible();
    });

    test('wyświetla pasek nawigacji z logo', async ({ page }) => {
        await expect(page.getByRole('navigation').getByAltText('Logo')).toBeVisible();
    });

    test('wyświetla statystyki sieci (10+, 5 000+, 24/7)', async ({ page }) => {
        await expect(page.getByText('10+')).toBeVisible();
        await expect(page.getByText('5 000+')).toBeVisible();
        await expect(page.getByText('24/7')).toBeVisible();
    });

    test('sekcja klinik jest widoczna', async ({ page }) => {
        // Sekcja na stronie głównej zawiera nagłówek klinik
        const clinicsSection = page.locator('section').nth(2);
        await expect(clinicsSection).toBeVisible();
    });

    test('link "Zobacz wszystkie" prowadzi do /clinics', async ({ page }) => {
        const link = page.getByRole('link').filter({ hasText: /view all|zobacz/i });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL('/clinics');
    });

    test('link franczyzy prowadzi do /contact', async ({ page }) => {
        const link = page.getByRole('link', { name: /porozmawiaj o franczyzie/i });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL('/contact');
    });

    test('wyświetla stopkę z nazwą marki', async ({ page }) => {
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
        await expect(footer.getByText(/pokie paws/i).first()).toBeVisible();
    });

    test('linki nawigacyjne w stopce działają', async ({ page }) => {
        const clinicsFooterLink = page.locator('footer').getByRole('link').filter({ hasText: /clinics|kliniki/i });
        await expect(clinicsFooterLink).toBeVisible();
    });
});
