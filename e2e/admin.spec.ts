import { test, expect } from '@playwright/test';
import {
    loginAs,
    mockSession,
    MOCK_ADMIN_CLINICS,
    MOCK_ADMIN_USERS,
} from './helpers/auth';

test.describe('Panel Admina', () => {
    test.beforeEach(async ({ page, context }) => {
        await loginAs(context, 'Admin');
        await mockSession(page, 'Admin');

        // Mockuj endpointy admina
        await page.route('**/api/backend/api/admin/users', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ADMIN_USERS) }),
        );
        await page.route('**/api/backend/api/clinics', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ADMIN_CLINICS) }),
        );
        await page.route('**/api/backend/api/admin/logs**', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
        );
        await page.route('**/api/backend/api/admin/logs/stats', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
        );
        await page.route('**/api/backend/api/orders**', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
        );

        await page.goto('/admin');
    });

    // ── Sidebar ──────────────────────────────────────────────────────────────

    test('renderuje boczny panel nawigacji z logo PokieAdmin', async ({ page }) => {
        await expect(page.getByText('PokieAdmin')).toBeVisible();
    });

    test('sidebar zawiera przyciski: Panel, Kliniki, Personel, Zamówienia', async ({ page }) => {
        await expect(page.getByRole('button', { name: /panel glowny/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /kliniki/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /personel/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /zamowienia/i })).toBeVisible();
    });

    test('sidebar zawiera przycisk Wyloguj', async ({ page }) => {
        await expect(page.getByRole('button', { name: /wyloguj/i })).toBeVisible();
    });

    // ── Tab: Personel (domyślny) ──────────────────────────────────────────────

    test('domyślnie otwiera zakładkę Personel', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /personel/i })).toBeVisible();
    });

    test('tab Personel wyświetla tabelę pracowników', async ({ page }) => {
        const table = page.locator('table');
        await expect(table).toBeVisible();
    });

    test('tab Personel wyświetla dane mocka (Jan Kowalski)', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.getByText('Jan Kowalski')).toBeVisible({ timeout: 8_000 });
    });

    test('tab Personel: przycisk "+ Nowy Pracownik" otwiera modal', async ({ page }) => {
        await page.getByRole('button', { name: /nowy pracownik/i }).click();
        await expect(page.getByText(/dodaj pracownika/i)).toBeVisible();
    });

    test('modal dodawania pracownika zawiera pola Imię, Nazwisko, Email', async ({ page }) => {
        await page.getByRole('button', { name: /nowy pracownik/i }).click();
        await expect(page.getByPlaceholder(/imie/i)).toBeVisible();
        await expect(page.getByPlaceholder(/nazwisko/i)).toBeVisible();
        await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    });

    test('modal pracownika zawiera select ról (Lekarz, Admin, Magazyn)', async ({ page }) => {
        await page.getByRole('button', { name: /nowy pracownik/i }).click();
        const select = page.locator('select').first();
        await expect(select).toBeVisible();
        await expect(page.getByRole('option', { name: 'Lekarz' })).toBeAttached();
        await expect(page.getByRole('option', { name: 'Admin' })).toBeAttached();
        await expect(page.getByRole('option', { name: 'Magazyn' })).toBeAttached();
    });

    test('walidacja NPWZ odrzuca wartość inną niż 7 cyfr', async ({ page }) => {
        await page.route('**/api/backend/api/admin/users', async (route) => {
            if (route.request().method() === 'POST') {
                return route.fulfill({ status: 201, contentType: 'application/json', body: '{}' });
            }
            return route.continue();
        });

        await page.getByRole('button', { name: /nowy pracownik/i }).click();
        await page.getByPlaceholder(/imie/i).fill('Anna');
        await page.getByPlaceholder(/nazwisko/i).fill('Nowak');
        await page.getByPlaceholder(/email sluzbowy/i).fill('anna@pokiepaws.pl');
        await page.getByPlaceholder(/npwz/i).fill('123'); // za krótkie
        await page.locator('button[type="submit"]').click();

        // Notyfikacja z błędem NPWZ powinna się pojawić
        await expect(page.getByText(/bledny npwz|npwz/i)).toBeVisible({ timeout: 5_000 });
    });

    test('przycisk edycji pracownika otwiera modal z uzupełnionymi danymi', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.getByText('Jan Kowalski')).toBeVisible({ timeout: 8_000 });
        const editBtn = page.locator('table tbody tr').first().getByRole('button').first();
        await editBtn.click();
        await expect(page.getByText(/edytuj uzytkownika/i)).toBeVisible();
        // Formularz powinien mieć wypełnione dane
        await expect(page.getByPlaceholder(/imie/i)).toHaveValue('Jan');
    });

    // ── Tab: Kliniki ──────────────────────────────────────────────────────────

    test('kliknięcie zakładki Kliniki przełącza widok', async ({ page }) => {
        await page.getByRole('button', { name: /kliniki/i }).click();
        await expect(page.getByText(/zarzadzanie siecia/i)).toBeVisible();
    });

    test('tab Kliniki wyświetla kartę kliniki z mocka', async ({ page }) => {
        await page.getByRole('button', { name: /kliniki/i }).click();
        await page.waitForLoadState('networkidle');
        await expect(page.getByText('Klinika Łapa')).toBeVisible({ timeout: 8_000 });
    });

    test('tab Kliniki: przycisk "+ Dodaj Klinikę" otwiera modal', async ({ page }) => {
        await page.getByRole('button', { name: /kliniki/i }).click();
        await page.getByRole('button', { name: /dodaj klinike/i }).click();
        await expect(page.getByText(/dodaj klinike/i).last()).toBeVisible();
    });

    test('modal kliniki zawiera wymagane pola', async ({ page }) => {
        await page.getByRole('button', { name: /kliniki/i }).click();
        await page.getByRole('button', { name: /dodaj klinike/i }).click();
        await expect(page.getByPlaceholder(/nazwa kliniki/i)).toBeVisible();
        await expect(page.getByPlaceholder(/ulica/i)).toBeVisible();
        await expect(page.getByPlaceholder(/miasto/i)).toBeVisible();
    });

    test('walidacja NIP odrzuca wartość inną niż 10 cyfr', async ({ page }) => {
        await page.route('**/api/backend/api/clinics', async (route) => {
            if (route.request().method() === 'POST') {
                return route.fulfill({ status: 201, contentType: 'application/json', body: '{}' });
            }
            return route.continue();
        });

        await page.getByRole('button', { name: /kliniki/i }).click();
        await page.getByRole('button', { name: /dodaj klinike/i }).click();
        await page.getByPlaceholder(/nazwa kliniki/i).fill('Test Klinika');
        await page.getByPlaceholder(/ulica/i).fill('Testowa');
        await page.getByPlaceholder(/numer domu/i).fill('1');
        await page.getByPlaceholder(/kod pocztowy/i).fill('00-001');
        await page.getByPlaceholder(/miasto/i).fill('Warszawa');
        await page.getByPlaceholder('NIP').fill('123'); // za krótki
        await page.locator('button[type="submit"]').click();

        await expect(page.getByText(/bledny nip|nip/i)).toBeVisible({ timeout: 5_000 });
    });

    test('przycisk edycji kliniki otwiera modal z jej danymi', async ({ page }) => {
        await page.getByRole('button', { name: /kliniki/i }).click();
        await page.waitForLoadState('networkidle');
        await expect(page.getByText('Klinika Łapa')).toBeVisible({ timeout: 8_000 });
        await page.getByRole('button', { name: /edytuj/i }).first().click();
        await expect(page.getByText(/edytuj klinike/i)).toBeVisible();
        await expect(page.getByPlaceholder(/nazwa kliniki/i)).toHaveValue('Klinika Łapa');
    });

    // ── Tab: Panel Główny (dashboard) ─────────────────────────────────────────

    test('tab Panel Główny wyświetla karty statystyk', async ({ page }) => {
        await page.getByRole('button', { name: /panel glowny/i }).click();
        await expect(page.getByText(/kliniki/i).first()).toBeVisible();
        await expect(page.getByText(/uzytkownicy/i)).toBeVisible();
        await expect(page.getByText(/logi/i)).toBeVisible();
    });

    // ── Tab: Zamówienia ───────────────────────────────────────────────────────

    test('tab Zamówienia wyświetla sekcję zamówień', async ({ page }) => {
        await page.getByRole('button', { name: /zamowienia/i }).click();
        await expect(page.getByText(/zamowienia od gabinetow/i)).toBeVisible();
    });

    test('tab Zamówienia wyświetla info o braku dostępu lub pustą listę', async ({ page }) => {
        await page.getByRole('button', { name: /zamowienia/i }).click();
        const noAccess = page.getByText(/brak dostepu|brak zamowien/i);
        await expect(noAccess).toBeVisible({ timeout: 8_000 });
    });

    // ── Logout ────────────────────────────────────────────────────────────────

    test('kliknięcie Wyloguj otwiera modal potwierdzenia', async ({ page }) => {
        await page.getByRole('button', { name: /wyloguj/i }).click();
        await expect(page.getByText(/czy chcesz sie wylogowac/i)).toBeVisible();
    });

    test('modal wylogowania zawiera przyciski Anuluj i Wyloguj się', async ({ page }) => {
        await page.getByRole('button', { name: /wyloguj/i }).click();
        await expect(page.getByRole('button', { name: /anuluj/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /wyloguj sie/i })).toBeVisible();
    });

    test('kliknięcie Anuluj zamyka modal wylogowania', async ({ page }) => {
        await page.getByRole('button', { name: /wyloguj/i }).click();
        await page.getByRole('button', { name: /anuluj/i }).click();
        await expect(page.getByText(/czy chcesz sie wylogowac/i)).not.toBeVisible();
    });
});
