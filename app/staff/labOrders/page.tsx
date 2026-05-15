'use client';

import { FlaskConical } from 'lucide-react';
import { useLanguageStore } from '../../../store/use-language-store';
import { translations } from '../../../lib/translations';

export default function LabOrdersPage() {
    const { language } = useLanguageStore();
    const t = translations[language];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-display font-bold text-slate-900">{t.labOrders.title}</h1>
                <p className="text-slate-500">{t.labOrders.subtitle}</p>
            </header>

            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <FlaskConical className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                    {language === 'pl' ? 'Modul czeka na endpoint API' : 'Module waiting for API endpoint'}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
                    {language === 'pl'
                        ? 'OpenAPI backendu nie udostepnia jeszcze endpointow dla zlecen laboratoryjnych. Ekran nie pokazuje danych demonstracyjnych, zeby nie udawac produkcyjnej funkcji.'
                        : 'The backend OpenAPI contract does not expose lab-order endpoints yet. This screen intentionally avoids demo data so the production app stays honest.'}
                </p>
            </section>
        </div>
    );
}
