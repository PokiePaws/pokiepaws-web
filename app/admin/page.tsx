'use client';

import { useState } from 'react';
import { Activity, Building2, LogOut, Package, Pencil, ShieldCheck, Trash2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from 'store/use-notification-store';
import { cn } from 'lib/utils';
import {
    useAdminClinics,
    useAdminLogStats,
    useAdminLogs,
    useAdminUsers,
    useCreateAdminClinic,
    useCreateAdminUser,
    useDeleteAdminClinic,
    useDeleteAdminUser,
    useUpdateAdminClinic,
    useUpdateAdminUser,
    useUpdateOrderStatus,
    useWarehouseOrders,
} from 'lib/features/api-hooks';
import { authApi } from 'lib/features/auth/auth-api';

const ORDER_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Oczekuje',
    APPROVED: 'Zatwierdzone',
    REJECTED: 'Odrzucone',
    COMPLETED: 'Zrealizowane',
};

const ORDER_STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-600',
    COMPLETED: 'bg-blue-100 text-blue-700',
};

const validateNIP = (nip: string) => !nip || /^\d{10}$/.test(nip);
const validateNPWZ = (npwz: string) => !npwz || /^\d{7}$/.test(npwz);
const INPUT_CLS = 'w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#68b9dc] outline-none text-sm transition-all focus:bg-white';

function AdminModal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-hidden"
            >
                {children}
            </motion.div>
        </div>
    );
}

export default function AdminPanelPage() {
    const addNotification = useNotificationStore(state => state.addNotification);
    const [activeTab, setActiveTab] = useState('users');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showClinicForm, setShowClinicForm] = useState(false);
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingClinicId, setEditingClinicId] = useState<number | null>(null);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const { data: clinics = [] } = useAdminClinics();
    const { data: users = [] } = useAdminUsers();
    const { data: logs = [] } = useAdminLogs();
    const { data: logStats = {} } = useAdminLogStats();
    const { data: orders = [], isError: ordersError } = useWarehouseOrders();
    const updateOrderStatus = useUpdateOrderStatus();
    const createClinic = useCreateAdminClinic();
    const createUser = useCreateAdminUser();
    const updateClinic = useUpdateAdminClinic();
    const updateUser = useUpdateAdminUser();
    const deleteClinic = useDeleteAdminClinic();
    const deleteUser = useDeleteAdminUser();
    const [clinicForm, setClinicForm] = useState({
        clinicName: '',
        street: '',
        houseNumber: '',
        postalCode: '',
        city: '',
        country: 'Polska',
        nip: '',
        regon: '',
        workingHours: '',
        phone: '',
        email: '',
        active: true,
    });
    const [userForm, setUserForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'VET',
        clinicId: '',
        npwz: '',
        phone: '',
        specialization: '',
        active: true,
    });

    const resetClinicForm = () => {
        setEditingClinicId(null);
        setClinicForm({
            clinicName: '',
            street: '',
            houseNumber: '',
            postalCode: '',
            city: '',
            country: 'Polska',
            nip: '',
            regon: '',
            workingHours: '',
            phone: '',
            email: '',
            active: true,
        });
    };

    const resetUserForm = () => {
        setEditingUserId(null);
        setUserForm({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 'VET',
            clinicId: '',
            npwz: '',
            phone: '',
            specialization: '',
            active: true,
        });
    };

    const handleClinicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateNIP(clinicForm.nip)) {
            addNotification({ message: 'Bledny NIP (10 cyfr)', type: 'error' });
            return;
        }

        if (editingClinicId) {
            await updateClinic.mutateAsync({ id: editingClinicId, payload: clinicForm });
        } else {
            await createClinic.mutateAsync(clinicForm);
        }
        setShowClinicForm(false);
        resetClinicForm();
        addNotification({ message: editingClinicId ? 'Klinika zaktualizowana' : 'Klinika dodana', type: 'success' });
    };

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateNPWZ(userForm.npwz)) {
            addNotification({ message: 'Bledny NPWZ (7 cyfr)', type: 'error' });
            return;
        }

        const payload = {
            ...userForm,
            clinicId: userForm.clinicId ? Number(userForm.clinicId) : undefined,
        };

        if (editingUserId) {
            await updateUser.mutateAsync({ id: editingUserId, payload });
        } else {
            await createUser.mutateAsync(payload);
        }
        setShowUserForm(false);
        resetUserForm();
        addNotification({ message: editingUserId ? 'Uzytkownik zaktualizowany' : 'Pracownik dodany', type: 'success' });
    };

    const openClinicForm = () => {
        resetClinicForm();
        setShowClinicForm(true);
    };

    const openUserForm = () => {
        resetUserForm();
        setShowUserForm(true);
    };

    const editClinic = (clinic: typeof clinics[number]) => {
        setEditingClinicId(clinic.id);
        setClinicForm({
            clinicName: clinic.clinicName,
            street: clinic.street,
            houseNumber: clinic.houseNumber,
            postalCode: clinic.postalCode,
            city: clinic.city,
            country: clinic.country,
            nip: clinic.nip || '',
            regon: clinic.regon || '',
            workingHours: clinic.workingHours || '',
            phone: clinic.phone || '',
            email: clinic.email || '',
            active: clinic.active,
        });
        setShowClinicForm(true);
    };

    const editUser = (user: typeof users[number]) => {
        setEditingUserId(user.id);
        setUserForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email,
            password: '',
            role: user.role,
            clinicId: user.clinicId ? String(user.clinicId) : '',
            npwz: user.npwz || '',
            phone: user.phone || '',
            specialization: user.specialization || '',
            active: user.active ?? true,
        });
        setShowUserForm(true);
    };

    const toggleClinicActive = async (clinic: typeof clinics[number]) => {
        await updateClinic.mutateAsync({
            id: clinic.id,
            payload: {
                clinicName: clinic.clinicName,
                street: clinic.street,
                houseNumber: clinic.houseNumber,
                apartmentNumber: clinic.apartmentNumber || undefined,
                postalCode: clinic.postalCode,
                city: clinic.city,
                country: clinic.country,
                nip: clinic.nip || undefined,
                regon: clinic.regon || undefined,
                workingHours: clinic.workingHours || undefined,
                phone: clinic.phone || undefined,
                email: clinic.email || undefined,
                active: !clinic.active,
            },
        });
        addNotification({ message: clinic.active ? 'Klinika zawieszona' : 'Klinika aktywowana', type: 'success' });
    };

    const toggleUserActive = async (user: typeof users[number]) => {
        await updateUser.mutateAsync({
            id: user.id,
            payload: {
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email,
                role: user.role,
                clinicId: user.clinicId || undefined,
                npwz: user.npwz || undefined,
                phone: user.phone || undefined,
                specialization: user.specialization || undefined,
                active: !(user.active ?? true),
            },
        });
        addNotification({ message: user.active ? 'Uzytkownik zawieszony' : 'Uzytkownik aktywowany', type: 'success' });
    };

    const handleLogout = async () => {
        await authApi.logout();
        addNotification({ message: 'Wylogowano pomyslnie', type: 'success' });
        window.location.href = '/';
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <aside className="w-72 bg-[#1e293b] text-white flex flex-col fixed h-full z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10 text-xl font-bold">
                        <ShieldCheck className="text-[#68b9dc]" /> PokieAdmin
                    </div>
                    <nav className="space-y-2">
                        {[
                            { id: 'dashboard', icon: Activity, label: 'Panel Glowny' },
                            { id: 'clinics', icon: Building2, label: 'Kliniki' },
                            { id: 'users', icon: Users, label: 'Personel' },
                            { id: 'orders', icon: Package, label: 'Zamowienia' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    'w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all',
                                    activeTab === item.id ? 'bg-[#68b9dc] text-white' : 'text-stone-400 hover:bg-white/5',
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

            <main className="flex-1 ml-72 p-12">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-stone-900">
                            {activeTab === 'users' ? 'Personel' : activeTab === 'clinics' ? 'Kliniki' : activeTab === 'orders' ? 'Zamowienia' : 'Panel'}
                        </h1>
                        <p className="text-stone-500 uppercase text-[10px] font-bold tracking-widest mt-1">
                            Produkcyjne dane z PokiePaws API
                        </p>
                    </div>
                </header>

                {activeTab === 'dashboard' && (
                    <section className="grid grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                            <p className="text-sm text-stone-400 font-bold uppercase">Kliniki</p>
                            <p className="text-4xl font-bold mt-2">{clinics.length}</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                            <p className="text-sm text-stone-400 font-bold uppercase">Uzytkownicy</p>
                            <p className="text-4xl font-bold mt-2">{users.length}</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                            <p className="text-sm text-stone-400 font-bold uppercase">Logi</p>
                            <p className="text-4xl font-bold mt-2">{logs.length}</p>
                        </div>
                        <div className="col-span-3 bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Statystyki zdarzen</h2>
                            <div className="grid grid-cols-4 gap-3">
                                {Object.entries(logStats).map(([type, count]) => (
                                    <div key={type} className="rounded-2xl bg-stone-50 p-4">
                                        <p className="text-[10px] font-bold uppercase text-stone-400">{type}</p>
                                        <p className="text-2xl font-bold text-stone-900">{count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'users' && (
                    <section className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-stone-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="text-emerald-500" /> Katalog Personelu
                            </h2>
                            <button onClick={openUserForm} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all">
                                + Nowy Pracownik
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Uzytkownik</th>
                                <th className="px-8 py-4">Rola</th>
                                <th className="px-8 py-4">Klinika</th>
                                <th className="px-8 py-4 text-right">Akcje</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-stone-50 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 font-bold group-hover:bg-white transition-colors">
                                                {(user.firstName || user.email)[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-stone-900">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-stone-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-[11px]">
                                        <p className="text-stone-500">{user.role}</p>
                                        {user.npwz && <p className="text-blue-500 font-bold">NPWZ: {user.npwz}</p>}
                                    </td>
                                    <td className="px-8 py-5 font-medium text-stone-600">{user.clinicName || '-'}</td>
                                    <td className="px-8 py-5 text-right">
                                        <button onClick={() => editUser(user)} className="p-2 text-stone-300 hover:text-stone-600"><Pencil size={18}/></button>
                                        <button onClick={() => toggleUserActive(user)} className="px-3 py-2 text-xs font-bold text-stone-500 hover:text-amber-600">
                                            {user.active === false ? 'Aktywuj' : 'Zawies'}
                                        </button>
                                        <button onClick={() => deleteUser.mutate(user.id)} className="p-2 text-stone-300 hover:text-red-500"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {activeTab === 'clinics' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Zarzadzanie Siecia</h2>
                            <button onClick={openClinicForm} className="bg-[#68b9dc] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100">
                                + Dodaj Klinike
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {clinics.map(clinic => (
                                <div key={clinic.id} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm">
                                    <h3 className="font-bold text-lg">{clinic.clinicName}</h3>
                                    <p className="text-sm text-stone-400 mb-4">
                                        {clinic.street} {clinic.houseNumber}, {clinic.postalCode} {clinic.city}
                                    </p>
                                    <div className="flex gap-4 text-[10px] font-bold text-stone-500 uppercase">
                                        <span>NIP: {clinic.nip || '-'}</span>
                                        <span>REGON: {clinic.regon || '-'}</span>
                                    </div>
                                    <div className="mt-5 flex justify-end gap-2">
                                        <button onClick={() => editClinic(clinic)} className="px-3 py-2 rounded-xl bg-stone-50 text-stone-600 text-xs font-bold">Edytuj</button>
                                        <button onClick={() => toggleClinicActive(clinic)} className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold">
                                            {clinic.active ? 'Zawies' : 'Aktywuj'}
                                        </button>
                                        <button onClick={() => deleteClinic.mutate(clinic.id)} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold">Usun</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'orders' && (
                    <section className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-stone-50">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Package className="text-[#68b9dc]" /> Zamowienia od gabinetow
                            </h2>
                        </div>
                        {ordersError ? (
                            <div className="py-16 text-center text-stone-400 text-sm">
                                Brak dostepu do zamowien. Endpointy magazynu wymagaja roli WAREHOUSE.
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="py-16 text-center text-stone-400 text-sm">Brak zamowien</div>
                        ) : (
                            <div className="divide-y divide-stone-50">
                                {orders.map((order) => (
                                    <div key={order.id} className="px-8 py-5 flex items-center justify-between gap-6">
                                        <div>
                                            <p className="font-bold text-stone-900">{order.name}</p>
                                            <p className="text-sm text-stone-400 mt-0.5">
                                                {order.clinicName ?? `Gabinet #${order.clinicId}`}
                                                {' · '}{order.amount}{order.unit ? ` ${order.unit}` : ''}
                                                {order.category ? ` · ${order.category}` : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={cn('px-3 py-1 rounded-xl text-xs font-bold', ORDER_STATUS_COLORS[order.status] ?? 'bg-stone-100 text-stone-600')}>
                                                {ORDER_STATUS_LABELS[order.status] ?? order.status}
                                            </span>
                                            {order.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => updateOrderStatus.mutate({ id: order.id, status: 'APPROVED' })}
                                                        disabled={updateOrderStatus.isPending}
                                                        className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                                    >
                                                        Zatwierdz
                                                    </button>
                                                    <button
                                                        onClick={() => updateOrderStatus.mutate({ id: order.id, status: 'REJECTED' })}
                                                        disabled={updateOrderStatus.isPending}
                                                        className="px-3 py-1 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    >
                                                        Odrzuc
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>

            <AnimatePresence>
                {showClinicForm && (
                    <AdminModal onClose={() => { setShowClinicForm(false); resetClinicForm(); }}>
                        <div className="p-10">
                            <h2 className="text-3xl font-bold mb-2">{editingClinicId ? 'Edytuj Klinike' : 'Dodaj Klinike'}</h2>
                            <form onSubmit={handleClinicSubmit} className="space-y-4 mt-8">
                                <input required placeholder="Nazwa kliniki" className={INPUT_CLS} value={clinicForm.clinicName} onChange={e => setClinicForm({ ...clinicForm, clinicName: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Ulica" className={INPUT_CLS} value={clinicForm.street} onChange={e => setClinicForm({ ...clinicForm, street: e.target.value })} />
                                    <input required placeholder="Numer domu" className={INPUT_CLS} value={clinicForm.houseNumber} onChange={e => setClinicForm({ ...clinicForm, houseNumber: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Kod pocztowy" className={INPUT_CLS} value={clinicForm.postalCode} onChange={e => setClinicForm({ ...clinicForm, postalCode: e.target.value })} />
                                    <input required placeholder="Miasto" className={INPUT_CLS} value={clinicForm.city} onChange={e => setClinicForm({ ...clinicForm, city: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="NIP" className={INPUT_CLS} value={clinicForm.nip} onChange={e => setClinicForm({ ...clinicForm, nip: e.target.value })} />
                                    <input placeholder="REGON" className={INPUT_CLS} value={clinicForm.regon} onChange={e => setClinicForm({ ...clinicForm, regon: e.target.value })} />
                                </div>
                                <input placeholder="Godziny pracy" className={INPUT_CLS} value={clinicForm.workingHours} onChange={e => setClinicForm({ ...clinicForm, workingHours: e.target.value })} />
                                <label className="flex items-center gap-3 text-sm font-bold text-stone-600">
                                    <input type="checkbox" checked={clinicForm.active} onChange={e => setClinicForm({ ...clinicForm, active: e.target.checked })} />
                                    Klinika aktywna
                                </label>
                                <button disabled={createClinic.isPending || updateClinic.isPending} type="submit" className="w-full py-5 bg-[#68b9dc] text-white rounded-3xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-500 transition-all">
                                    {editingClinicId ? 'Zapisz zmiany' : 'Zapisz Klinike'}
                                </button>
                            </form>
                        </div>
                    </AdminModal>
                )}

                {showUserForm && (
                    <AdminModal onClose={() => { setShowUserForm(false); resetUserForm(); }}>
                        <div className="p-10">
                            <h2 className="text-3xl font-bold mb-2">{editingUserId ? 'Edytuj Uzytkownika' : 'Dodaj Pracownika'}</h2>
                            <form onSubmit={handleUserSubmit} className="space-y-4 mt-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Imie" className={INPUT_CLS} value={userForm.firstName} onChange={e => setUserForm({ ...userForm, firstName: e.target.value })} />
                                    <input required placeholder="Nazwisko" className={INPUT_CLS} value={userForm.lastName} onChange={e => setUserForm({ ...userForm, lastName: e.target.value })} />
                                </div>
                                <input required type="email" placeholder="Email sluzbowy" className={INPUT_CLS} value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
                                <input type="password" placeholder="Haslo startowe" className={INPUT_CLS} value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <select className={INPUT_CLS} value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                                        <option value="VET">Lekarz</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="WAREHOUSE">Magazyn</option>
                                    </select>
                                    <select className={INPUT_CLS} value={userForm.clinicId} onChange={e => setUserForm({ ...userForm, clinicId: e.target.value })}>
                                        <option value="">Wybierz klinike</option>
                                        {clinics.map(clinic => <option key={clinic.id} value={clinic.id}>{clinic.clinicName}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="NPWZ" className={INPUT_CLS} value={userForm.npwz} onChange={e => setUserForm({ ...userForm, npwz: e.target.value })} />
                                    <input placeholder="Telefon" className={INPUT_CLS} value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} />
                                </div>
                                <input placeholder="Specjalizacja" className={INPUT_CLS} value={userForm.specialization} onChange={e => setUserForm({ ...userForm, specialization: e.target.value })} />
                                <label className="flex items-center gap-3 text-sm font-bold text-stone-600">
                                    <input type="checkbox" checked={userForm.active} onChange={e => setUserForm({ ...userForm, active: e.target.checked })} />
                                    Uzytkownik aktywny
                                </label>
                                <button disabled={createUser.isPending || updateUser.isPending} type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all">
                                    {editingUserId ? 'Zapisz zmiany' : 'Zatwierdz Pracownika'}
                                </button>
                            </form>
                        </div>
                    </AdminModal>
                )}

                {showLogoutConfirm && (
                    <AdminModal onClose={() => setShowLogoutConfirm(false)}>
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><LogOut size={40}/></div>
                            <h2 className="text-2xl font-bold mb-2">Czy chcesz sie wylogowac?</h2>
                            <p className="text-stone-500 mb-8">Twoja sesja zostanie zakonczona.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowLogoutConfirm(false)} className="py-4 bg-stone-100 rounded-2xl font-bold">Anuluj</button>
                                <button onClick={handleLogout} className="py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200">Wyloguj sie</button>
                            </div>
                        </div>
                    </AdminModal>
                )}
            </AnimatePresence>
        </div>
    );
}
