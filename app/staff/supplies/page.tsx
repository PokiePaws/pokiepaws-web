'use client';

import { AlertTriangle, PackageSearch } from 'lucide-react';

const requiredEndpoints = [
    'GET /api/products',
    'GET /api/vets/me/orders',
    'POST /api/vets/me/orders',
    'GET /api/vets/me/orders/{id}',
];

export default function SuppliesPage() {
    return (
        <div className="space-y-8 pb-12">
            <header>
                <p className="text-xs font-bold uppercase tracking-widest text-[#d4585b]">Sklep centralny</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Katalog i zamowienia</h1>
                <p className="mt-2 max-w-3xl text-slate-600">
                    Ten modul musi byc polaczony z API. Aktualny kontrakt OpenAPI z zalacznika nie udostepnia jeszcze
                    endpointow produktow, koszyka ani zamowien gabinetu, wiec ekran nie pokazuje lokalnych danych.
                </p>
            </header>

            <section className="rounded-lg border border-amber-100 bg-amber-50 p-6 shadow-sm">
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-amber-950">Brakuje endpointow w API</h2>
                        <p className="mt-2 text-sm leading-6 text-amber-900">
                            Specyfikacja funkcjonalna wymaga PP-27, PP-28 i PP-29, ale OpenAPI zawiera obecnie tylko
                            kliniki, wizyty, zwierzeta, recepty, sloty dostepnosci, uzytkownikow admina, logi oraz auth.
                            Zeby zachowac clean architecture, frontend nie powinien udawac katalogu ani historii
                            zamowien poza API.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <PackageSearch className="h-5 w-5 text-[#68b9dc]" />
                        <h2 className="font-bold text-slate-950">Endpointy potrzebne do wlaczenia modulu</h2>
                    </div>
                    <ul className="space-y-3">
                        {requiredEndpoints.map((endpoint) => (
                            <li key={endpoint} className="rounded-lg bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">
                                {endpoint}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                    <h2 className="font-bold text-slate-950">Co juz jest podpiete do API</h2>
                    <div className="mt-5 space-y-3 text-sm text-slate-600">
                        <p>Logowanie i 2FA ida przez endpointy auth.</p>
                        <p>Panel admina korzysta z /api/admin/users, /api/clinics oraz /api/admin/logs.</p>
                        <p>Kalendarz, dokumentacja medyczna i recepty korzystaja z endpointow wizyt oraz recept.</p>
                        <p>Lista gabinetow publicznych pobiera dane z /api/clinics.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

