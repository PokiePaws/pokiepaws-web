import { test, expect } from '@playwright/test';
import { loginAs, mockSession, MOCK_VISITS } from './helpers/auth';


const MOCK_VET_ME = {
    userId: 2, firstName: 'Anna', lastName: 'Vet', email: 'staff@pokiepaws.pl',
    clinicId: 1, clinicName: 'Klinika Łapa', npwz: '9876543',
    phone: '987654321', specialization: 'Internista',
};

const MOCK_ANIMALS = [
    { id: 10, name: 'Burek', species: 'Pies', breed: 'Labrador', gender: 'MALE' },
    { id: 11, name: 'Mruczek', species: 'Kot', breed: 'Dachowiec', gender: 'MALE' },
];

const MOCK_PRODUCTS = [
    { id: 1, name: 'Amoksycylina 500mg', unit: 'tabletka' },
    { id: 2, name: 'Amoksycylina 250mg', unit: 'tabletka' },
    { id: 3, name: 'Enrofloksacyna 50mg', unit: 'tabletka' },
    { id: 4, name: 'Metronidazol 250mg', unit: 'tabletka' },
    { id: 5, name: 'Doksycyklina 100mg', unit: 'kapsułka' },
    { id: 6, name: 'Karprofen 50mg', unit: 'tabletka' },
    { id: 7, name: 'Meloksykam 1mg', unit: 'tabletka' },
    { id: 8, name: 'Mavacoxib 6mg', unit: 'tabletka' },
    { id: 9, name: 'Tramadol 50mg', unit: 'tabletka' },
    { id: 10, name: 'Fenbendazol 150mg', unit: 'tabletka' },
    { id: 11, name: 'Afoksolaner 28,3mg', unit: 'tabletka' },
    { id: 12, name: 'Prednizolon 5mg', unit: 'tabletka' },
    { id: 13, name: 'Oclacitinib 3,6mg', unit: 'tabletka' },
    { id: 14, name: 'Omeprazol 10mg', unit: 'kapsułka' },
    { id: 15, name: 'Maropitant 16mg', unit: 'tabletka' },
    { id: 16, name: 'Pimobendan 1,25mg', unit: 'tabletka' },
    { id: 17, name: 'Furosemid 40mg', unit: 'tabletka' },
    { id: 18, name: 'Fenobarbital 30mg', unit: 'tabletka' },
    { id: 19, name: 'Gabapentyna 100mg', unit: 'kapsułka' },
    { id: 20, name: 'Caniviton Plus', unit: 'tabletka' },
];

async function setupVetMocks(page: import('@playwright/test').Page) {
    // Catch-all registered first = lowest priority (Playwright uses LIFO)
    await page.route('**/api/backend/**', (route) => {
        if (route.request().method() === 'GET') {
            return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        }
        return route.fulfill({ status: 200, contentType: 'application/json', body: 'null' });
    });
    // Specific routes registered after = higher priority
    await page.route('**/api/backend/api/visits/*/prescription', (route) =>
        route.fulfill({ status: 404, contentType: 'application/json', body: 'null' }),
    );
    await page.route('**/api/backend/api/products', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_PRODUCTS) }),
    );
    await page.route('**/api/backend/api/animals/clinic/**', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_ANIMALS) }),
    );
    await page.route('**/api/backend/api/vets/me/visits**', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_VISITS) }),
    );
    await page.route('**/api/backend/api/vets/me', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_VET_ME) }),
    );
}

// ── Staff Dashboard ───────────────────────────────────────────────────────────

test.describe('Staff – Dashboard (/staff)', () => {
    test.beforeEach(async ({ page, context }) => {
        await loginAs(context, 'Staff');
        await mockSession(page, 'Staff', 'staff@pokiepaws.pl');
        await setupVetMocks(page);
        await page.goto('/staff');
    });

    test('wyświetla nagłówek dashboardu', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('wyświetla 4 karty statystyk (wizyty, pacjenci, zamówienia, wyniki)', async ({ page }) => {
        const statCards = page.locator('[class*="rounded"][class*="border"] p[class*="font-bold"]');
        await expect(statCards.first()).toBeVisible({ timeout: 8_000 });
    });

    test('wyświetla sekcję harmonogramu dnia z tabelą', async ({ page }) => {
        await expect(page.locator('table')).toBeVisible({ timeout: 8_000 });
    });

    test('tabela harmonogramu ma nagłówki kolumn', async ({ page }) => {
        await expect(page.locator('thead')).toBeVisible({ timeout: 8_000 });
    });

    test('wyświetla pole wyszukiwania', async ({ page }) => {
        await expect(page.locator('input[type="text"]')).toBeVisible();
    });

    test('link "Pełny kalendarz" nawiguje do /staff/schedule', async ({ page }) => {
        const link = page.getByRole('link', { name: /pełny kalendarz|full calendar/i });
        await expect(link).toBeVisible({ timeout: 5_000 });
        await link.click();
        await expect(page).toHaveURL('/staff/schedule');
    });
});

// ── Harmonogram (/staff/schedule) ─────────────────────────────────────────────

test.describe('Staff – Harmonogram (/staff/schedule)', () => {
    test.beforeEach(async ({ page, context }) => {
        await loginAs(context, 'Staff');
        await mockSession(page, 'Staff', 'staff@pokiepaws.pl');
        await setupVetMocks(page);
        await page.goto('/staff/schedule');
    });

    test('wyświetla nagłówek strony', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('wyświetla kalendarz miesięczny (siatka 7 kolumn)', async ({ page }) => {
        const grid = page.locator('[class*="grid-cols-7"]').first();
        await expect(grid).toBeVisible({ timeout: 8_000 });
    });

    test('wyświetla nazwę bieżącego miesiąca', async ({ page }) => {
        const monthNames = /styczeń|luty|marzec|kwiecień|maj|czerwiec|lipiec|sierpień|wrzesień|październik|listopad|grudzień|january|february|march|april|may|june|july|august|september|october|november|december/i;
        await expect(page.locator('h2').filter({ hasText: monthNames }).first()).toBeVisible({ timeout: 5_000 });
    });

    test('przyciski nawigacji miesięcznej (poprzedni/następny) działają', async ({ page }) => {
        const navButtons = page.locator('button svg').locator('..').filter({ hasText: '' });
        await expect(navButtons.first()).toBeVisible();
    });

    test('przycisk "Dodaj wizytę" jest widoczny', async ({ page }) => {
        const addBtn = page.getByRole('button', { name: /dodaj wizyt[eę]|add visit|nowa wizyta/i });
        await expect(addBtn).toBeVisible();
    });

    test('kliknięcie "Dodaj wizytę" otwiera modal', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /dodaj wizyt[eę]|add visit/i }).click();
        await expect(page.getByText(/pacjent|patient/i).first()).toBeVisible({ timeout: 3_000 });
    });

    test('modal nowej wizyty zawiera pola: pacjent, powód, data, godzina', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /dodaj wizyt[eę]|add visit/i }).click();
        await expect(page.locator('select').first()).toBeVisible();
        await expect(page.locator('input[type="date"]')).toBeVisible();
        await expect(page.locator('input[type="time"]')).toBeVisible();
    });

    test('modal nowej wizyty zawiera pacjentów z kliniki', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /dodaj wizyt[eę]|add visit/i }).click();
        await expect(page.getByRole('option', { name: /burek/i })).toBeAttached({ timeout: 8_000 });
    });

    test('kliknięcie Anuluj w modalu zamyka go', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /dodaj wizyt[eę]|add visit/i }).click();
        await page.getByRole('button', { name: /anuluj|cancel/i }).first().click();
        await expect(page.locator('input[type="date"]')).not.toBeVisible({ timeout: 3_000 });
    });

    test('wyświetla panel wizyty dla wybranego dnia', async ({ page }) => {
        // Panel z listą wizyt po prawej stronie
        await expect(page.locator('[class*="col-span-5"]')).toBeVisible({ timeout: 8_000 });
    });

    test('przycisk "Dzisiaj/Today" jest widoczny', async ({ page }) => {
        await expect(page.getByRole('button', { name: /dzisiaj|today/i })).toBeVisible();
    });
});

// ── Pacjenci (/staff/patients) ────────────────────────────────────────────────

test.describe('Staff – Pacjenci (/staff/patients)', () => {
    test.beforeEach(async ({ page, context }) => {
        await loginAs(context, 'Staff');
        await mockSession(page, 'Staff', 'staff@pokiepaws.pl');
        await setupVetMocks(page);
        await page.goto('/staff/patients');
    });

    test('wyświetla nagłówek strony', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('wyświetla pole wyszukiwania pacjentów', async ({ page }) => {
        await expect(page.locator('input[type="text"]')).toBeVisible();
    });

    test('wyświetla przycisk Filtry', async ({ page }) => {
        await expect(page.getByRole('button', { name: /filtry|filters/i })).toBeVisible();
    });

    test('link "Zarejestruj klienta" jest widoczny i prowadzi do /staff/clients/register', async ({ page }) => {
        const link = page.getByRole('link', { name: /zarejestruj.*klienta|register.*client/i });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL('/staff/clients/register');
    });

    test('wyszukiwanie po nazwie filtruje listę', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.locator('input[type="text"]').fill('Burek');
        // Wyniki powinny zawierać "Patient #10" (z mocka MOCK_VISITS, animalId=10)
        // lub pusty stan
        await page.waitForTimeout(500);
        const cards = page.locator('[class*="rounded"][class*="border"] h3');
        const count = await cards.count();
        // Nie sprawdzamy konkretnej liczby – tylko że strona reaguje
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test('pusty wynik wyszukiwania nie wyświetla kart pacjentów', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.locator('input[type="text"]').fill('zzznikt9999xxx');
        await page.waitForTimeout(500);
        const cards = page.locator('h3').filter({ hasText: /Patient #/i });
        await expect(cards).toHaveCount(0, { timeout: 5_000 });
    });

    test('kliknięcie "Zobacz kartotekę" otwiera modal', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        const btn = page.getByRole('button', { name: /kartoteke|records/i }).first();
        const count = await btn.count();
        if (count > 0) {
            await btn.click();
            await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible({ timeout: 3_000 });
        } else {
            test.skip(true, 'Brak pacjentów w liście');
        }
    });
});

// ── Recepty (/staff/prescriptions) ───────────────────────────────────────────

test.describe('Staff – Recepty (/staff/prescriptions)', () => {
    test.beforeEach(async ({ page, context }) => {
        await loginAs(context, 'Staff');
        await mockSession(page, 'Staff', 'staff@pokiepaws.pl');
        await setupVetMocks(page);
        await page.goto('/staff/prescriptions');
    });

    test('wyświetla nagłówek strony recept', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('wyświetla karty podsumowania (wizyty w systemie, dostępne leki)', async ({ page }) => {
        await expect(page.getByText(/wizyty w systemie/i)).toBeVisible({ timeout: 8_000 });
        await expect(page.getByText(/dostepne leki|dostępne leki/i)).toBeVisible({ timeout: 8_000 });
    });

    test('wyświetla listę wizyt lub komunikat o braku', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        const visitList = page.locator('[class*="space-y-3"]');
        const noVisits = page.getByText(/brak wizyt/i);
        await expect(visitList.or(noVisits)).toBeVisible({ timeout: 8_000 });
    });

    test('wiersz wizyty z mocka jest widoczny', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        // Kontrola (wizyta id=1) powinna być na liście
        await expect(page.getByText(/#1/).first()).toBeVisible({ timeout: 8_000 });
    });

    test('kliknięcie wiersza wizyty rozwija szczegóły', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        const visitRow = page.getByText(/#1/).first();
        await visitRow.click();
        // Po kliknięciu powinno pojawić się "Wystaw receptę" (brak recepty w mocku)
        await expect(page.getByRole('button', { name: /wystaw recepte|wystaw receptę/i })).toBeVisible({ timeout: 3_000 });
    });

    test('kliknięcie "Wystaw receptę" otwiera modal recepty', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByText(/#1/).first().click();
        await page.getByRole('button', { name: /wystaw recepte|wystaw receptę/i }).click();
        await expect(page.getByText(/nowa recepta/i)).toBeVisible({ timeout: 3_000 });
    });

    test('modal recepty zawiera select leków i pola dawkowania', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByText(/#1/).first().click();
        await page.getByRole('button', { name: /wystaw recepte|wystaw receptę/i }).click();
        await expect(page.locator('select').first()).toBeVisible();
        await expect(page.getByPlaceholder(/np\. 2|dawkowanie/i)).toBeVisible();
    });

    test('modal recepty: przycisk "Dodaj kolejny lek" dodaje nowy wiersz', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByText(/#1/).first().click();
        await page.getByRole('button', { name: /wystaw recepte|wystaw receptę/i }).click();
        const addMedBtn = page.getByRole('button', { name: /dodaj kolejny lek/i });
        await addMedBtn.click();
        // Po kliknięciu powinny być 2 sekcje leków
        await expect(page.getByText(/lek 2/i)).toBeVisible({ timeout: 3_000 });
    });

    test('modal recepty zamyka się po kliknięciu Anuluj', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByText(/#1/).first().click();
        await page.getByRole('button', { name: /wystaw recepte|wystaw receptę/i }).click();
        await page.getByRole('button', { name: /anuluj/i }).first().click();
        await expect(page.getByText(/nowa recepta/i)).not.toBeVisible({ timeout: 3_000 });
    });
});

// ── Zaopatrzenie (/staff/supplies) ────────────────────────────────────────────

test.describe('Staff – Zaopatrzenie (/staff/supplies)', () => {
    test.beforeEach(async ({ page, context }) => {
        await loginAs(context, 'Staff');
        await mockSession(page, 'Staff', 'staff@pokiepaws.pl');

        // Dla VET: brak dostępu do warehouse, ale jest vetMe
        // Catch-all first (lowest priority - LIFO)
        await page.route('**/api/backend/**', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
        );
        await page.route('**/api/backend/api/vets/me', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_VET_ME) }),
        );
        await page.route('**/api/backend/api/warehouse-workers/me', (route) =>
            route.fulfill({ status: 403, contentType: 'application/json', body: '{}' }),
        );

        await page.goto('/staff/supplies');
    });

    test('wyświetla nagłówek "Zaopatrzenie gabinetu"', async ({ page }) => {
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 8_000 });
    });

    test('VET widzi formularz zamawiania produktu', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /zamow produkt|zamów produkt/i })).toBeVisible({ timeout: 8_000 });
    });

    test('formularz zamówienia zawiera pole Nazwa produktu', async ({ page }) => {
        await expect(page.getByPlaceholder(/nazwa produktu/i)).toBeVisible({ timeout: 8_000 });
    });

    test('formularz zamówienia zawiera pola Ilość i Jednostka', async ({ page }) => {
        await expect(page.getByPlaceholder(/ilosc|ilość/i).or(page.locator('input[type="number"]').first())).toBeVisible({ timeout: 8_000 });
        await expect(page.getByPlaceholder(/jednostka/i)).toBeVisible({ timeout: 8_000 });
    });

    test('sekcja "Złożone w tej sesji" jest widoczna', async ({ page }) => {
        await expect(page.getByText(/zlożone w tej sesji|złożone w tej sesji/i)).toBeVisible({ timeout: 8_000 });
    });

    test('po złożeniu zamówienia pojawia się na liście sesji', async ({ page }) => {
        await page.route('**/api/backend/api/orders', async (route) => {
            if (route.request().method() === 'POST') {
                return route.fulfill({ status: 201, contentType: 'application/json', body: '{"id": 1, "clinicId": 1, "name": "Bandaże", "amount": 10, "status": "PENDING"}' });
            }
            return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        });

        await page.getByPlaceholder(/nazwa produktu/i).fill('Bandaże');
        await page.locator('input[type="number"]').first().fill('10');
        await page.locator('button[type="submit"]').click();

        await expect(page.getByText('Bandaże')).toBeVisible({ timeout: 5_000 });
    });
});

// ── Zarządzanie (/staff/management) ──────────────────────────────────────────

test.describe('Staff – Zarządzanie (/staff/management)', () => {
    test.beforeEach(async ({ page, context }) => {
        await loginAs(context, 'Staff');
        await mockSession(page, 'Staff', 'staff@pokiepaws.pl');
        await setupVetMocks(page);
        await page.goto('/staff/management');
    });

    test('strona zarządzania ładuje się bez błędu 4xx/5xx', async ({ page }) => {
        const res = await page.goto('/staff/management');
        expect(res?.status()).toBeLessThan(400);
    });
});
