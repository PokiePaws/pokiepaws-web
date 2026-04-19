'use client';

import { useState } from 'react';
import {
    Building2, Users, Plus, Pencil, Trash2, X, ShieldCheck,
    LogIn, FileText, ShoppingBag, FlaskConical, Clock,
    ChevronDown, ChevronUp, ToggleLeft, ToggleRight, MapPin, Search, Activity, User, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from 'store/use-notification-store';
import { useLanguageStore } from 'store/use-language-store';
import { translations } from 'lib/translations';
import { cn } from 'lib/utils';

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_CLINICS = [
    { id: 'c1', name: 'Pokie Paws — Warszawa Centrum', address: 'ul. Marszałkowska 12, 00-001 Warszawa', hours: 'Pon–Pt 8:00–20:00', active: true, adminName: 'Anna Kowalska' },
    { id: 'c2', name: 'Pokie Paws — Kraków', address: 'ul. Floriańska 5, 31-021 Kraków', hours: 'Pon–Sob 9:00–18:00', active: true, adminName: 'Marek Nowak' },
    { id: 'c3', name: 'Pokie Paws — Gdańsk', address: 'ul. Długa 22, 80-001 Gdańsk', hours: 'Pon–Pt 8:00–18:00', active: false, adminName: 'Karolina Wiśniewska' },
];

const INITIAL_USERS = [
    { id: 'u1', name: 'Anna Kowalska', email: 'anna@pokiepaws.pl', role: 'admin', clinic: 'Warszawa Centrum', active: true },
    { id: 'u2', name: 'Dr Piotr Zając', email: 'piotr@pokiepaws.pl', role: 'vet', clinic: 'Warszawa Centrum', active: true, npwz: '1234567' },
    { id: 'u3', name: 'Marek Nowak', email: 'marek@pokiepaws.pl', role: 'admin', clinic: 'Kraków', active: true },
    { id: 'u4', name: 'Karolina Wiśniewska', email: 'karolina@pokiepaws.pl', role: 'admin', clinic: 'Gdańsk', active: false },
    { id: 'u5', name: 'Tomasz Bąk', email: 'tomasz@pokiepaws.pl', role: 'warehouse', clinic: 'Kraków', active: true },
];

const LOGS = [
    { id: 'l1', type: 'login', user: 'anna@pokiepaws.pl', detail: 'Logowanie do systemu', clinic: 'Warszawa Centrum', time: '2024-05-14 09:12' },
    { id: 'l2', type: 'data', user: 'piotr@pokiepaws.pl', detail: 'Edytowano dane pacjenta: Burek (ID #4421)', clinic: 'Warszawa Centrum', time: '2024-05-14 09:45' },
    { id: 'l3', type: 'supply', user: 'tomasz@pokiepaws.pl', detail: 'Zamówiono: Rękawice lateksowe (M) × 10 pudełek', clinic: 'Kraków', time: '2024-05-14 10:03' },
    { id: 'l4', type: 'lab', user: 'piotr@pokiepaws.pl', detail: 'Zlecono badanie: morfologia — Azor (ID #3312)', clinic: 'Warszawa Centrum', time: '2024-05-14 10:30' },
    { id: 'l5', type: 'prescription', user: 'piotr@pokiepaws.pl', detail: 'Wystawiono receptę: Amoxicillin 250mg — Mruczek (ID #2201)', clinic: 'Warszawa Centrum', time: '2024-05-14 11:00' },
    { id: 'l6', type: 'login', user: 'marek@pokiepaws.pl', detail: 'Logowanie do systemu', clinic: 'Kraków', time: '2024-05-14 11:15' },
    { id: 'l7', type: 'data', user: 'karolina@pokiepaws.pl', detail: 'Zaktualizowano grafik wizyt', clinic: 'Gdańsk', time: '2024-05-14 11:40' },
    { id: 'l8', type: 'supply', user: 'tomasz@pokiepaws.pl', detail: 'Zamówiono: Strzykawki 5ml × 50 szt.', clinic: 'Kraków', time: '2024-05-14 12:10' },
];

// ─── Design tokens ────────────────────────────────────────────────────────────

const B_BLUE = '#68b9dc';
const B_RED  = '#d4585b';
const B_DARK = '#335f7d';

const ROLE_LABELS: Record<string, string> = {
    admin: 'Admin', vet: 'Weterynarz', warehouse: 'Magazyn', superAdmin: 'SuperAdmin',
};
const LOG_META: Record<string, { icon: any; bg: string; color: string; label: string }> = {
    login:        { icon: LogIn,        bg: 'bg-blue-50', color: 'text-blue-600', label: 'Logowanie' },
    data:         { icon: FileText,     bg: 'bg-slate-100', color: 'text-slate-600', label: 'Zmiana danych' },
    supply:       { icon: ShoppingBag,  bg: 'bg-amber-50', color: 'text-amber-600', label: 'Zaopatrzenie' },
    lab:          { icon: FlaskConical,  bg: 'bg-purple-50', color: 'text-purple-600', label: 'Zlecenie lab' },
    prescription: { icon: FileText,     bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'Recepta' },
};

const emptyClinic = { name: '', address: '', hours: '', active: true };
const emptyUser   = { name: '', email: '', role: 'vet', clinic: '', active: true, npwz: '' };
const INPUT_CLS   = 'w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#68b9dc] outline-none text-sm transition-all focus:bg-white';

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
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-hidden">
                {children}
            </motion.div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminPanelPage() {
    const addNotification = useNotificationStore(state => state.addNotification);
    const { language } = useLanguageStore();
    const t = translations[language];

    const [clinics, setClinics]               = useState(INITIAL_CLINICS);
    const [clinicForm, setClinicForm]         = useState<typeof emptyClinic & { id?: string }>(emptyClinic);
    const [showClinicForm, setShowClinicForm] = useState(false);
    const [editingClinicId, setEditingClinicId] = useState<string | null>(null);

    const [users, setUsers]                 = useState(INITIAL_USERS);
    const [userForm, setUserForm]           = useState<typeof emptyUser & { id?: string }>(emptyUser);
    const [showUserForm, setShowUserForm]   = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    const [logFilter, setLogFilter]       = useState('all');
    const [logsExpanded, setLogsExpanded] = useState(true);

    // Clinic handlers
    const openAddClinic = () => { setClinicForm(emptyClinic); setEditingClinicId(null); setShowClinicForm(true); };
    const openEditClinic = (id: string) => {
        const c = clinics.find(c => c.id === id)!;
        setClinicForm({ name: c.name, address: c.address, hours: c.hours, active: c.active });
        setEditingClinicId(id); setShowClinicForm(true);
    };
    const handleClinicSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClinicId) {
            setClinics(prev => prev.map(c => c.id === editingClinicId ? { ...c, ...clinicForm } : c));
            addNotification({ message: language === 'pl' ? 'Dane kliniki zostały zaktualizowane' : 'Clinic data updated', type: 'success' });
        } else {
            setClinics(prev => [...prev, { ...clinicForm, id: `c${Date.now()}`, adminName: '—' }]);
            addNotification({ message: language === 'pl' ? 'Klinika została dodana' : 'Clinic added', type: 'success' });
        }
        setShowClinicForm(false);
    };
    const handleDeleteClinic = (id: string) => {
        setClinics(prev => prev.filter(c => c.id !== id));
        addNotification({ message: language === 'pl' ? 'Klinika została usunięta' : 'Clinic deleted', type: 'success' });
    };
    const toggleClinicActive = (id: string) =>
        setClinics(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));

    // User handlers
    const openAddUser = () => { setUserForm(emptyUser); setEditingUserId(null); setShowUserForm(true); };
    const openEditUser = (id: string) => {
        const u = users.find(u => u.id === id)!;
        setUserForm({ name: u.name, email: u.email, role: u.role, clinic: u.clinic, active: u.active, npwz: u.npwz || '' });
        setEditingUserId(id); setShowUserForm(true);
    };
    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUserId) {
            setUsers(prev => prev.map(u => u.id === editingUserId ? { ...u, ...userForm } : u));
            addNotification({ message: language === 'pl' ? 'Dane użytkownika zostały zaktualizowane' : 'User data updated', type: 'success' });
        } else {
            setUsers(prev => [...prev, { ...userForm, id: `u${Date.now()}` }]);
            addNotification({ message: language === 'pl' ? 'Użytkownik został dodany' : 'User added', type: 'success' });
        }
        setShowUserForm(false);
    };
    const handleDeleteUser = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        addNotification({ message: language === 'pl' ? 'Użytkownik został usunięty' : 'User deleted', type: 'success' });
    };

    const filteredLogs = logFilter === 'all' ? LOGS : LOGS.filter(l => l.type === logFilter);

    const statCards = [
        { label: language === 'pl' ? 'Kliniki' : 'Clinics', value: clinics.length, sub: `${clinics.filter(c => c.active).length} ${language === 'pl' ? 'aktywnych' : 'active'}`, color: 'text-[#68b9dc]', bg: 'bg-blue-50/50' },
        { label: language === 'pl' ? 'Użytkownicy' : 'Users', value: users.length, sub: `${users.filter(u => u.active).length} ${language === 'pl' ? 'aktywnych' : 'active'}`, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
        { label: language === 'pl' ? 'Admini' : 'Admins', value: users.filter(u => u.role === 'admin').length, sub: language === 'pl' ? 'w sieci' : 'in network', color: 'text-[#335f7d]', bg: 'bg-stone-50' },
        { label: language === 'pl' ? 'Logi dziś' : 'Logs today', value: LOGS.length, sub: language === 'pl' ? 'zdarzeń' : 'events', color: 'text-[#d4585b]', bg: 'bg-red-50/50' },
    ];

    return (
        <div className="space-y-12 pb-20">

            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-display font-bold text-stone-900 tracking-tight">Admin Console</h1>
                    <p className="text-stone-500 mt-2 text-lg">Network management hub and activity monitoring.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-blue-100 bg-blue-50/50 self-start sm:self-center shadow-sm">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                        <ShieldCheck className="h-5 w-5 text-[#68b9dc]" />
                    </div>
                    <span className="text-sm font-bold text-[#335f7d] tracking-wide uppercase">Super Admin Access</span>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(s => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={s.label}
                        className={cn("bg-white rounded-3xl border border-stone-100 shadow-sm p-6 hover:shadow-md transition-shadow", s.bg)}
                    >
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 leading-none">{s.label}</p>
                        <div className="flex items-baseline gap-2">
                            <p className={cn("text-4xl font-bold font-display", s.color)}>{s.value}</p>
                            <p className="text-xs font-semibold text-stone-400">{s.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* ── Clinics ─────────────────────────────────────────────────── */}
                <section className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-stone-50 flex items-center justify-between bg-stone-50/30">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2.5 rounded-2xl">
                                <Building2 className="h-6 w-6 text-[#68b9dc]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-stone-900">Clinics</h2>
                                <p className="text-xs text-stone-400">Manage network locations</p>
                            </div>
                        </div>
                        <button onClick={openAddClinic}
                                className="bg-[#68b9dc] text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-8 space-y-4 flex-grow max-h-[500px] overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {clinics.map(clinic => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={clinic.id}
                                    className="flex items-start justify-between p-5 rounded-3xl bg-stone-50 hover:bg-stone-100/50 border border-stone-100 transition-colors group"
                                >
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <p className="font-bold text-stone-900 leading-none">{clinic.name}</p>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm",
                                                clinic.active ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-500"
                                            )}>
                                                {clinic.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-stone-500 flex items-center gap-1.5">
                                                <MapPin className="h-3 w-3 text-[#68b9dc]" />
                                                {clinic.address}
                                            </p>
                                            <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                                                <Clock className="h-3 w-3" />
                                                {clinic.hours}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 sm:flex-row">
                                        <button onClick={() => toggleClinicActive(clinic.id)}
                                                className="p-2.5 hover:bg-white rounded-xl transition-all text-stone-300 hover:text-emerald-500 shadow-sm group-hover:shadow hover:scale-110 active:scale-90">
                                            {clinic.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                                        </button>
                                        <button onClick={() => openEditClinic(clinic.id)}
                                                className="p-2.5 hover:bg-white rounded-xl transition-all text-stone-300 hover:text-blue-500 shadow-sm group-hover:shadow hover:scale-110 active:scale-90">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDeleteClinic(clinic.id)}
                                                className="p-2.5 hover:bg-red-50 rounded-xl transition-all text-stone-300 hover:text-red-500 shadow-sm group-hover:shadow hover:scale-110 active:scale-90">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* ── Users ───────────────────────────────────────────────────── */}
                <section className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-stone-50 flex items-center justify-between bg-stone-50/30">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 p-2.5 rounded-2xl">
                                <Users className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-stone-900">Directory</h2>
                                <p className="text-xs text-stone-400">Team members & access control</p>
                            </div>
                        </div>
                        <button onClick={openAddUser}
                                className="bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95">
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="overflow-x-auto p-4 sm:p-8">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                            <tr>
                                {['User', 'Role', 'Status', ''].map(h => (
                                    <th key={h} className="pb-4 px-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="group cursor-default">
                                    <td className="py-4 px-4 bg-stone-50 rounded-l-[1.25rem] group-hover:bg-stone-100/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 shadow-sm group-hover:shadow transition-shadow">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-stone-900 text-sm leading-none mb-1">{user.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[10px] font-medium text-stone-400">{user.email}</p>
                                                    {user.npwz && (
                                                        <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                                NPWZ: {user.npwz}
                                                            </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 bg-stone-50 group-hover:bg-stone-100/50 transition-colors">
                                            <span className={cn(
                                                "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                                user.role === 'admin' ? "bg-blue-100 text-blue-700" :
                                                    user.role === 'vet' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                            )}>
                                                {ROLE_LABELS[user.role]}
                                            </span>
                                    </td>
                                    <td className="py-4 px-4 bg-stone-50 group-hover:bg-stone-100/50 transition-colors">
                                        <div className="flex items-center gap-1.5">
                                            <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm animate-pulse", user.active ? "bg-emerald-500" : "bg-stone-300")} />
                                            <span className="text-[11px] font-bold text-stone-500 uppercase">{user.active ? 'Online' : 'Offline'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 bg-stone-50 rounded-r-[1.25rem] text-right group-hover:bg-stone-100/50 transition-colors">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openEditUser(user.id)}
                                                    className="p-2 hover:bg-white rounded-xl transition-all text-stone-300 hover:text-stone-700">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 hover:bg-white rounded-xl transition-all text-stone-300 hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* ── Logs ────────────────────────────────────────────────────── */}
            <section className="bg-[#335f7d] rounded-[3rem] shadow-2xl shadow-blue-900/10 overflow-hidden">
                <div className="p-8 sm:p-10 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-white">
                        <div className="bg-white/10 p-3 rounded-[1.5rem] backdrop-blur-md border border-white/10">
                            <Activity className="h-7 w-7 text-[#68b9dc]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-bold">Activity Pulse</h2>
                            <p className="text-white/40 text-sm">Real-time network events logging</p>
                        </div>
                    </div>
                    <button onClick={() => setLogsExpanded(p => !p)}
                            className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-white/50 hover:text-white border border-white/5">
                        {logsExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                </div>

                <AnimatePresence initial={false}>
                    {logsExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="bg-white/5"
                        >
                            <div className="p-8 sm:p-10">
                                <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-8">
                                    {[
                                        { key: 'all',          label: 'All Activity' },
                                        { key: 'login',        label: 'Auth' },
                                        { key: 'data',         label: 'Entities' },
                                        { key: 'supply',       label: 'Inventory' },
                                        { key: 'lab',          label: 'Lab' },
                                        { key: 'prescription', label: 'Meds' },
                                    ].map(f => (
                                        <button key={f.key} onClick={() => setLogFilter(f.key)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-2xl text-[11px] font-bold transition-all uppercase tracking-widest border",
                                                    logFilter === f.key
                                                        ? "bg-[#68b9dc] text-white border-transparent shadow-lg shadow-blue-500/20"
                                                        : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white"
                                                )}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                                    {filteredLogs.map((log, idx) => {
                                        const meta = LOG_META[log.type];
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={log.id}
                                                className="flex items-start gap-5 p-5 rounded-[2rem] bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
                                            >
                                                <div className={cn("p-3 rounded-2xl shrink-0 backdrop-blur-md shadow-sm border border-white/10", meta.bg, meta.color)}>
                                                    <meta.icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 min-w-0 py-1">
                                                    <p className="text-sm font-bold text-white/90 mb-1 group-hover:text-white transition-colors">{log.detail}</p>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                                        <span className="text-[#68b9dc] bg-blue-500/10 px-2 py-0.5 rounded-lg">{log.user}</span>
                                                        <span>•</span>
                                                        <span>{log.clinic}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0 py-1">
                                                    <span className={cn("px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] border border-white/5", meta.bg, meta.color)}>
                                                        {meta.label}
                                                    </span>
                                                    <p className="text-[10px] font-bold text-white/20 mt-3 tabular-nums">{log.time.split(' ')[1]}</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* ── Clinic modal ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {showClinicForm && (
                    <AdminModal onClose={() => setShowClinicForm(false)}>
                        <div className="p-10 sm:p-12">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-stone-900 leading-none">
                                        {editingClinicId ? 'Update Clinic' : 'Create Clinic'}
                                    </h2>
                                    <p className="text-stone-400 text-sm mt-3">Enter the details for the network location</p>
                                </div>
                                <button onClick={() => setShowClinicForm(false)}
                                        className="w-10 h-10 bg-stone-50 rounded-2xl flex items-center justify-center hover:bg-stone-100 transition-colors">
                                    <X className="h-5 w-5 text-stone-400" />
                                </button>
                            </div>
                            <form className="space-y-6" onSubmit={handleClinicSubmit}>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-2">Clinic Identity</label>
                                    <input required value={clinicForm.name}
                                           onChange={e => setClinicForm(p => ({ ...p, name: e.target.value }))}
                                           className={INPUT_CLS} placeholder="Pokie Paws — Miasto" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-2">Street Address</label>
                                    <input required value={clinicForm.address}
                                           onChange={e => setClinicForm(p => ({ ...p, address: e.target.value }))}
                                           className={INPUT_CLS} placeholder="ul. Przykładowa 1, 00-000 Miasto" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-2">Operational Hours</label>
                                    <input required value={clinicForm.hours}
                                           onChange={e => setClinicForm(p => ({ ...p, hours: e.target.value }))}
                                           className={INPUT_CLS} placeholder="Pon–Pt 8:00–20:00" />
                                </div>
                                <label className="flex items-center gap-4 p-5 bg-stone-50 rounded-3xl border border-stone-200 cursor-pointer select-none group hover:border-[#68b9dc] transition-colors">
                                    <div className={cn(
                                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                        clinicForm.active ? "bg-[#68b9dc] border-[#68b9dc]" : "bg-white border-stone-300"
                                    )}>
                                        {clinicForm.active && <Check className="h-4 w-4 text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={clinicForm.active}
                                           onChange={e => setClinicForm(p => ({ ...p, active: e.target.checked }))} />
                                    <span className="font-bold text-stone-700">Set as active location</span>
                                </label>
                                <button type="submit"
                                        className="w-full py-5 text-white rounded-[2rem] font-bold text-lg bg-[#68b9dc] shadow-xl shadow-blue-200 hover:shadow-2xl transition-all active:scale-95 mt-4">
                                    {editingClinicId ? 'Save Configuration' : 'Confirm & Deploy'}
                                </button>
                            </form>
                        </div>
                    </AdminModal>
                )}
            </AnimatePresence>

            {/* ── User modal ───────────────────────────────────────────────── */}
            <AnimatePresence>
                {showUserForm && (
                    <AdminModal onClose={() => setShowUserForm(false)}>
                        <div className="p-10 sm:p-12">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-stone-900 leading-none">
                                        {editingUserId ? 'Modify Member' : 'Invite Member'}
                                    </h2>
                                    <p className="text-stone-400 text-sm mt-3">Team member credentials and access level</p>
                                </div>
                                <button onClick={() => setShowUserForm(false)}
                                        className="w-10 h-10 bg-stone-50 rounded-2xl flex items-center justify-center hover:bg-stone-100 transition-colors">
                                    <X className="h-5 w-5 text-stone-400" />
                                </button>
                            </div>
                            <form className="space-y-6" onSubmit={handleUserSubmit}>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-2">Contact Info</label>
                                    <input required value={userForm.name}
                                           onChange={e => setUserForm(p => ({ ...p, name: e.target.value }))}
                                           className={cn(INPUT_CLS, "mb-3")} placeholder="Jan Kowalski" />
                                    <input required type="email" value={userForm.email}
                                           onChange={e => setUserForm(p => ({ ...p, email: e.target.value }))}
                                           className={INPUT_CLS} placeholder="jan@pokiepaws.pl" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-2">Access Type</label>
                                        <select value={userForm.role}
                                                onChange={e => setUserForm(p => ({ ...p, role: e.target.value }))}
                                                className={INPUT_CLS}>
                                            <option value="vet">Veterinarian</option>
                                            <option value="admin">Admin</option>
                                            <option value="warehouse">Warehouse</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-2">Assignment</label>
                                        <select value={userForm.clinic}
                                                onChange={e => setUserForm(p => ({ ...p, clinic: e.target.value }))}
                                                className={INPUT_CLS}>
                                            <option value="">Choose Location...</option>
                                            {clinics.map(c => (
                                                <option key={c.id} value={c.name.replace('Pokie Paws — ', '')}>
                                                    {c.name.split('—')[1]?.trim() || c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {userForm.role === 'vet' && (
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest px-2">Professional License (NPWZ)</label>
                                        <input
                                            required
                                            value={userForm.npwz}
                                            onChange={e => setUserForm(p => ({ ...p, npwz: e.target.value }))}
                                            className={INPUT_CLS}
                                            placeholder="np. 1234567"
                                        />
                                    </div>
                                )}
                                <label className="flex items-center gap-4 p-5 bg-stone-50 rounded-3xl border border-stone-200 cursor-pointer select-none transition-colors hover:border-emerald-500 group">
                                    <div className={cn(
                                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                        userForm.active ? "bg-emerald-500 border-emerald-500" : "bg-white border-stone-300"
                                    )}>
                                        {userForm.active && <Check className="h-4 w-4 text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={userForm.active}
                                           onChange={e => setUserForm(p => ({ ...p, active: e.target.checked }))} />
                                    <span className="font-bold text-stone-700">Account status active</span>
                                </label>
                                <button type="submit"
                                        className="w-full py-5 text-white rounded-[2rem] font-bold text-lg bg-emerald-500 shadow-xl shadow-emerald-200 hover:shadow-2xl transition-all active:scale-95 mt-4">
                                    {editingUserId ? 'Update Permissions' : 'Send Invite'}
                                </button>
                            </form>
                        </div>
                    </AdminModal>
                )}
            </AnimatePresence>
        </div>
    );
}
