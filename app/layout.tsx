import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from '../components/providers';
import NotificationToast from '../components/notification-toast'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-display',
});

export const metadata: Metadata = {
    title: 'VetCare - Veterinary Clinic Management',
    description: 'Comprehensive management system for veterinary clinics and their clients.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body suppressHydrationWarning className="font-sans antialiased bg-stone-50 text-stone-900">
        <Providers>
            {children}
            <NotificationToast />
        </Providers>
        </body>
        </html>
    );
}
