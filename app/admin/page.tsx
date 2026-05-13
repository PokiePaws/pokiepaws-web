'use client';

import { useState } from 'react';
import {
    Building2, Users, Pencil, Trash2, ShieldCheck,
    Activity, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from 'store/use-notification-store';
import { cn } from 'lib/utils';

// ─── Walidacja ───────────────────────────────────────────────────────────────
const validatePESEL = (pesel: string) => /^\d{11}$/.test(pesel);
const validateNIP = (nip: string) => /^\d{10}$/.test(nip);
const validateNPWZ = (npwz: string) => /^\d{7}$/.test(npwz);

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_CLINICS = [
    { id: 'c1', name: 'Pokie Paws — Warszawa Centrum', address: 'ul. Marszałkowska 12, 00-001 Warszawa', nip: '1234567890', regon: '123456789', active: true },
];

const INITIAL_USERS = [
    { id: 'u1', firstName: 'Anna', lastName: 'Kowalska', email: 'anna@pokiepaws.pl', role: 'admin', clinic: 'Warszawa Centrum', active: true, pesel: '90010112345', address: 'Warszawa, ul. Miła 1' },
    { id: 'u2', firstName: 'Piotr', lastName: 'Zając', email: 'piotr@pokiepaws.pl', role: 'vet', clinic: 'Warszawa Centrum', active: true, npwz: '1234567', pesel: '85020254321', address: 'Warszawa, ul. Leśna 4' },
];

const INPUT_CLS = 'w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#68b9dc] outline-none text-sm transition-all focus:bg-white';

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function AdminModal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-hidden">
                {children}
            </motion.div>
        </div>
    );
}

export default function AdminPanelPage() {
    const addNotification = useNotificationStore(state => state.addNotification);

    // --- State ---
    const [activeTab, setActiveTab] = useState('users');
    const [clinics, setClinics] = useState(INITIAL_CLINICS);
    const [users, setUsers] = useState(INITIAL_USERS);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // --- Form State ---
    const [showClinicForm, setShowClinicForm] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);
    const [clinicForm, setClinicForm] = useState({ name: '', address: '', nip: '', regon: '', active: true });
    const [userForm, setUserForm] = useState({
        firstName: '', lastName: '', email: '', role: 'vet',
        clinic: '', pesel: '', npwz: '', address: '', active: true
    });

    // --- Handlers ---
    const handleClinicSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateNIP(clinicForm.nip)) return addNotification({ message: 'Błędny NIP (10 cyfr)', type: 'error' });
        setClinics([...clinics, { ...clinicForm, id: `c${Date.now()}` }]);
        setShowClinicForm(false);
        addNotification({ message: 'Klinika dodana', type: 'success' });
    };

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePESEL(userForm.pesel)) return addNotification({ message: 'Błędny PESEL (11 cyfr)', type: 'error' });
        if (userForm.role === 'vet' && !validateNPWZ(userForm.npwz)) return addNotification({ message: 'Błędny NPWZ (7 cyfr)', type: 'error' });

        setUsers([...users, { ...userForm, id: `u${Date.now()}` }]);
        setShowUserForm(false);
        addNotification({ message: 'Pracownik dodany', type: 'success' });
    };

    const handleLogout = () => {
        addNotification({ message: 'Wylogowano pomyślnie', type: 'success' });
        window.location.href = '/login';
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside className="w-72 bg-[#1e293b] text-white flex flex-col fixed h-full z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10 text-xl font-bold">
                        <ShieldCheck className="text-[#68b9dc]" /> PokieAdmin
                    </div>
                    <nav className="space-y-2">
                        {[
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Panel Główny' },
                            { id: 'clinics', icon: Building2, label: 'Kliniki' },
                            { id: 'users', icon: Users, label: 'Personel' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                                    activeTab === item.id ? "bg-[#68b9dc] text-white" : "text-stone-400 hover:bg-white/5"
                                )}
                            >
                                <item.icon size={20} /> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="mt-auto m-8 flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
                >
                    <LogOut size={20} /> Wyloguj
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-12">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-stone-900 capitalize">{activeTab === 'users' ? 'Personel' : activeTab}</h1>
                        <p className="text-stone-500 uppercase text-[10px] font-bold tracking-widest mt-1">Network Operations Center</p>
                    </div>
                </header>

                {activeTab === 'users' && (
                    <section className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-stone-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-emerald-500"/> Katalog Personelu</h2>
                            <button onClick={() => setShowUserForm(true)} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all">
                                + Nowy Pracownik
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Użytkownik</th>
                                <th className="px-8 py-4">Dokumenty</th>
                                <th className="px-8 py-4">Klinika</th>
                                <th className="px-8 py-4 text-right">Akcje</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-stone-50 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 font-bold group-hover:bg-white transition-colors">
                                                {u.firstName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-stone-900">{u.firstName} {u.lastName}</p>
                                                <p className="text-xs text-stone-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-[11px]">
                                        <p className="text-stone-500">PESEL: {u.pesel}</p>
                                        {u.npwz && <p className="text-blue-500 font-bold">NPWZ: {u.npwz}</p>}
                                    </td>
                                    <td className="px-8 py-5 font-medium text-stone-600">{u.clinic}</td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 text-stone-300 hover:text-stone-600"><Pencil size={18}/></button>
                                        <button className="p-2 text-stone-300 hover:text-red-500"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* Sekcja Kliniki (Uproszczona) */}
                {activeTab === 'clinics' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Zarządzanie Siecią</h2>
                            <button onClick={() => setShowClinicForm(true)} className="bg-[#68b9dc] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100">
                                + Dodaj Klinikę
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {clinics.map(c => (
                                <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                                    <h3 className="font-bold text-lg">{c.name}</h3>
                                    <p className="text-sm text-stone-400 mb-4">{c.address}</p>
                                    <div className="flex gap-4 text-[10px] font-bold text-stone-500 uppercase">
                                        <span>NIP: {c.nip}</span>
                                        {c.regon && <span>REGON: {c.regon}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Modal: Dodawanie Pracownika */}
            <AnimatePresence>
                {showUserForm && (
                    <AdminModal onClose={() => setShowUserForm(false)}>
                        <div className="p-10">
                            <h2 className="text-3xl font-bold mb-2">Dodaj Pracownika</h2>
                            <p className="text-stone-400 mb-8">Wprowadź dane medyczne i adresowe.</p>
                            <form onSubmit={handleUserSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Imię" className={INPUT_CLS} onChange={e => setUserForm({...userForm, firstName: e.target.value})} />
                                    <input required placeholder="Nazwisko" className={INPUT_CLS} onChange={e => setUserForm({...userForm, lastName: e.target.value})} />
                                </div>
                                <input required type="email" placeholder="Email służbowy" className={INPUT_CLS} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="PESEL (11 cyfr)" className={INPUT_CLS} onChange={e => setUserForm({...userForm, pesel: e.target.value})} />
                                    <input placeholder="NPWZ (dla lekarzy - 7 cyfr)" className={INPUT_CLS} onChange={e => setUserForm({...userForm, npwz: e.target.value})} />
                                </div>
                                <input required placeholder="Adres zamieszkania" className={INPUT_CLS} onChange={e => setUserForm({...userForm, address: e.target.value})} />
                                <select required className={INPUT_CLS} onChange={e => setUserForm({...userForm, clinic: e.target.value})}>
                                    <option value="">Wybierz Klinikę</option>
                                    {clinics.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                                <button type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all">Zatwierdź Pracownika</button>
                            </form>
                        </div>
                    </AdminModal>
                )}

                {showLogoutConfirm && (
                    <AdminModal onClose={() => setShowLogoutConfirm(false)}>
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><LogOut size={40}/></div>
                            <h2 className="text-2xl font-bold mb-2">Czy chcesz się wylogować?</h2>
                            <p className="text-stone-500 mb-8">Twoja sesja zostanie zakończona.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowLogoutConfirm(false)} className="py-4 bg-stone-100 rounded-2xl font-bold">Anuluj</button>
                                <button onClick={handleLogout} className="py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200">Wyloguj się</button>
                            </div>
                        </div>
                    </AdminModal>
                )}
            </AnimatePresence>
        </div>
    );
}

// Komponent pomocniczy dla ikony
function LayoutDashboard(props: React.ComponentProps<typeof Activity>) {
    return <Activity {...props} />;
}
