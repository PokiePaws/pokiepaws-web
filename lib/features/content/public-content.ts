import { Building2, Users2, ShieldCheck, MapPin, Star, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ContentItem {
    icon: LucideIcon;
    title: string;
    description: string;
}

export const franchiseSteps: ContentItem[] = [
    {
        icon: MapPin,
        title: 'Wybierz lokalizację',
        description: 'Znajdź idealną lokalizację dla swojej kliniki weterynaryjnej w sieci PokiePaws.',
    },
    {
        icon: ShieldCheck,
        title: 'Dołącz do sieci',
        description: 'Skorzystaj ze sprawdzonego modelu biznesowego i wsparcia centralnego.',
    },
    {
        icon: Star,
        title: 'Rozwijaj biznes',
        description: 'Buduj lojalną bazę klientów z pomocą naszego systemu i marki.',
    },
];

export const networkBenefits: ContentItem[] = [
    {
        icon: Building2,
        title: 'Nowoczesne kliniki',
        description: 'Dostęp do profesjonalnego wyposażenia i standaryzowanych procedur w całej sieci.',
    },
    {
        icon: Users2,
        title: 'Zespół specjalistów',
        description: 'Wykwalifikowani weterynarze i personel dbający o zdrowie Twoich podopiecznych.',
    },
    {
        icon: ShieldCheck,
        title: 'Pełna historia leczenia',
        description: 'Elektroniczna kartoteka medyczna dostępna dla opiekuna i lekarza w każdej chwili.',
    },
];
