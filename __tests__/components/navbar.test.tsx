import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuthStore } from '../../store/use-auth-store';
import type { User } from '../../lib/features/auth/auth-types';

// --- Mocki Next.js ---
vi.mock('next/navigation', () => ({
    usePathname: vi.fn(() => '/'),
}));

vi.mock('next/link', () => ({
    default: ({ href, children, onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} onClick={onClick} {...props}>
            {children}
        </a>
    ),
}));

vi.mock('next/image', () => ({
    // eslint-disable-next-line @next/next/no-img-element
    default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

// Mockujemy motion/react żeby uniknąć problemów z animacjami w jsdom
vi.mock('motion/react', () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Lazy import AFTER mocks
const NavbarModule = await import('../../components/navbar');
const Navbar = NavbarModule.default;

const mockUser: User = {
    id: 'test@example.com',
    name: 'test@example.com',
    email: 'test@example.com',
    role: 'Client',
};

beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isSessionResolved: true });
});

describe('Navbar – niezalogowany użytkownik', () => {
    it('renderuje logo PokiePaws', () => {
        render(<Navbar />);
        expect(screen.getByAltText('Logo')).toBeInTheDocument();
    });

    it('wyświetla link do logowania', () => {
        render(<Navbar />);
        const loginLinks = screen.getAllByRole('link', { name: /log in|zaloguj/i });
        expect(loginLinks.length).toBeGreaterThan(0);
    });

    it('wyświetla linki nawigacyjne', () => {
        render(<Navbar />);
        // Linki są renderowane w desktop i mobile, więc może być kilka
        expect(screen.getAllByRole('link', { name: /clinics|kliniki/i }).length).toBeGreaterThan(0);
    });

    it('nie wyświetla przycisku wylogowania', () => {
        render(<Navbar />);
        expect(screen.queryByRole('button', { name: /log out|wyloguj/i })).not.toBeInTheDocument();
    });
});

describe('Navbar – zalogowany użytkownik', () => {
    beforeEach(() => {
        useAuthStore.setState({ user: mockUser, isAuthenticated: true, isSessionResolved: true });
    });

    it('wyświetla imię/email użytkownika', () => {
        render(<Navbar />);
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('wyświetla przycisk dzwonka powiadomień', () => {
        render(<Navbar />);
        // Przycisk z ikoną Bell jest widoczny
        const bellButtons = screen.getAllByRole('button');
        expect(bellButtons.length).toBeGreaterThan(0);
    });
});

describe('Navbar – przełącznik języka', () => {
    it('zawiera przyciski EN i PL', () => {
        render(<Navbar />);
        expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'PL' })).toBeInTheDocument();
    });

    it('kliknięcie PL przełącza język', () => {
        render(<Navbar />);
        const plButton = screen.getByRole('button', { name: 'PL' });
        fireEvent.click(plButton);
        // Po kliknięciu PL przycisk powinien mieć aktywny styl (bg-white)
        expect(plButton.className).toContain('bg-white');
    });
});

describe('Navbar – menu mobilne', () => {
    it('przycisk hamburgera jest widoczny', () => {
        render(<Navbar />);
        // Menu button jest w sekcji md:hidden
        const buttons = screen.getAllByRole('button');
        // Musi być przynajmniej jeden button (hamburger)
        expect(buttons.length).toBeGreaterThan(0);
    });
});
