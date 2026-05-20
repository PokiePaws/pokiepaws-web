'use client';

import { useState } from 'react';
import { Package, PackagePlus, ClipboardList, Pencil, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNotificationStore } from 'store/use-notification-store';
import { cn } from 'lib/utils';
import {
    useWarehouseMe,
    useWarehouseStock,
    useWarehouseOrders,
    useCreateStockItem,
    useUpdateStockItem,
    useDeleteStockItem,
    useUpdateOrderStatus,
    useVetMe,
    useCreateOrder,
} from 'lib/features/api-hooks';
import type { WarehouseStockItem } from 'lib/features/api-schemas';

const INPUT = 'w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#68b9dc] outline-none text-sm transition-all focus:bg-white';

const ORDER_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Oczekuje',
    APPROVED: 'Zatwierdzone',
    REJECTED: 'Odrzucone',
    COMPLETED: 'Zrealizowane',
};

const ORDER_STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    APPROVED: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-red-50 text-red-600',
    COMPLETED: 'bg-blue-50 text-blue-700',
};

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={cn('inline-block px-2 py-0.5 rounded-lg text-xs font-bold', ORDER_STATUS_COLORS[status] ?? 'bg-stone-50 text-stone-600')}>
            {ORDER_STATUS_LABELS[status] ?? status}
        </span>
    );
}

// ─── WAREHOUSE WORKER VIEW ────────────────────────────────────────────────────

function StockTab({ warehouseId }: { warehouseId: number }) {
    const addNotification = useNotificationStore((s) => s.addNotification);
    const { data: stock = [], isLoading } = useWarehouseStock(warehouseId);
    const createItem = useCreateStockItem();
    const updateItem = useUpdateStockItem();
    const deleteItem = useDeleteStockItem();

    const emptyForm = { name: '', assortmentDescription: '', price: '', unit: '', category: '', amount: '', expiryDate: '', status: 'AVAILABLE' };
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };

    const openEdit = (item: WarehouseStockItem) => {
        setForm({
            name: item.name,
            assortmentDescription: item.assortmentDescription ?? '',
            price: item.price != null ? String(item.price) : '',
            unit: item.unit ?? '',
            category: item.category ?? '',
            amount: String(item.amount),
            expiryDate: item.expiryDate ?? '',
            status: item.status ?? 'AVAILABLE',
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            warehouseId,
            name: form.name,
            assortmentDescription: form.assortmentDescription || undefined,
            price: form.price ? Number(form.price) : undefined,
            unit: form.unit || undefined,
            category: form.category || undefined,
            amount: Number(form.amount),
            expiryDate: form.expiryDate || undefined,
            status: form.status || undefined,
        };
        try {
            if (editingId != null) {
                await updateItem.mutateAsync({ id: editingId, payload });
                addNotification({ message: 'Produkt zaktualizowany', type: 'success' });
            } else {
                await createItem.mutateAsync(payload);
                addNotification({ message: 'Produkt dodany', type: 'success' });
            }
            setShowForm(false);
        } catch {
            addNotification({ message: 'Błąd zapisu produktu', type: 'error' });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteItem.mutateAsync(id);
            addNotification({ message: 'Produkt usunięty', type: 'success' });
        } catch {
            addNotification({ message: 'Błąd usuwania produktu', type: 'error' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-stone-900">Stan magazynu</h2>
                <button onClick={openCreate} className="flex items-center gap-2 bg-[#68b9dc] text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-blue-500 transition-all">
                    <PackagePlus className="h-4 w-4" /> Dodaj produkt
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h3 className="font-bold text-stone-900">{editingId ? 'Edytuj produkt' : 'Nowy produkt'}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="Nazwa *" className={INPUT} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <input placeholder="Kategoria" className={INPUT} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    </div>
                    <input placeholder="Opis" className={INPUT} value={form.assortmentDescription} onChange={(e) => setForm({ ...form, assortmentDescription: e.target.value })} />
                    <div className="grid grid-cols-3 gap-4">
                        <input required type="number" min="0" placeholder="Ilość *" className={INPUT} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                        <input placeholder="Jednostka (szt, op…)" className={INPUT} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                        <input type="number" min="0" step="0.01" placeholder="Cena" className={INPUT} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-stone-500 mb-1 block">Data ważności</label>
                            <input type="date" className={INPUT} value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs text-stone-500 mb-1 block">Status</label>
                            <select className={INPUT} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="AVAILABLE">Dostępny</option>
                                <option value="LOW">Niski stan</option>
                                <option value="OUT_OF_STOCK">Brak</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-stone-100 rounded-xl text-sm font-semibold">Anuluj</button>
                        <button type="submit" disabled={createItem.isPending || updateItem.isPending} className="px-6 py-2 bg-[#68b9dc] text-white rounded-xl text-sm font-semibold hover:bg-blue-500 disabled:opacity-50">
                            Zapisz
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="py-16 text-center text-stone-400">Ładowanie…</div>
            ) : stock.length === 0 ? (
                <div className="py-16 text-center text-stone-400">Magazyn jest pusty</div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-3">Produkt</th>
                            <th className="px-6 py-3">Kategoria</th>
                            <th className="px-6 py-3 text-right">Ilość</th>
                            <th className="px-6 py-3">Jednostka</th>
                            <th className="px-6 py-3">Ważność</th>
                            <th className="px-6 py-3 text-right">Akcje</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                        {stock.map((item) => (
                            <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-stone-900">{item.name}</td>
                                <td className="px-6 py-4 text-stone-500">{item.category ?? '—'}</td>
                                <td className={cn('px-6 py-4 text-right font-bold', item.amount <= 0 ? 'text-red-500' : item.amount <= 5 ? 'text-amber-500' : 'text-stone-900')}>
                                    {item.amount}
                                </td>
                                <td className="px-6 py-4 text-stone-500">{item.unit ?? '—'}</td>
                                <td className="px-6 py-4 text-stone-500">{item.expiryDate ?? '—'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => openEdit(item)} className="p-1.5 text-stone-300 hover:text-stone-600 transition-colors"><Pencil className="h-4 w-4" /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-stone-300 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function OrdersTab() {
    const addNotification = useNotificationStore((s) => s.addNotification);
    const [statusFilter, setStatusFilter] = useState('');
    const { data: orders = [], isLoading } = useWarehouseOrders(undefined, statusFilter || undefined);
    const updateStatus = useUpdateOrderStatus();

    const handleStatus = async (id: number, status: string) => {
        try {
            await updateStatus.mutateAsync({ id, status });
            addNotification({ message: 'Status zaktualizowany', type: 'success' });
        } catch {
            addNotification({ message: 'Błąd aktualizacji statusu', type: 'error' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-900">Zamówienia od gabinetów</h2>
                <select className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[#68b9dc]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">Wszystkie statusy</option>
                    <option value="PENDING">Oczekujące</option>
                    <option value="APPROVED">Zatwierdzone</option>
                    <option value="REJECTED">Odrzucone</option>
                    <option value="COMPLETED">Zrealizowane</option>
                </select>
            </div>

            {isLoading ? (
                <div className="py-16 text-center text-stone-400">Ładowanie…</div>
            ) : orders.length === 0 ? (
                <div className="py-16 text-center text-stone-400">Brak zamówień</div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="font-semibold text-stone-900">{order.name}</p>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <p className="text-sm text-stone-500">
                                        Gabinet: <span className="font-medium text-stone-700">{order.clinicName ?? `#${order.clinicId}`}</span>
                                        {' · '}Ilość: <span className="font-medium text-stone-700">{order.amount}{order.unit ? ` ${order.unit}` : ''}</span>
                                        {order.category && <>{' · '}Kategoria: <span className="font-medium text-stone-700">{order.category}</span></>}
                                    </p>
                                    {order.description && <p className="text-xs text-stone-400 mt-1">{order.description}</p>}
                                </div>
                                {order.status === 'PENDING' && (
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => handleStatus(order.id, 'APPROVED')} disabled={updateStatus.isPending} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50">
                                            <CheckCircle className="h-3.5 w-3.5" /> Zatwierdź
                                        </button>
                                        <button onClick={() => handleStatus(order.id, 'REJECTED')} disabled={updateStatus.isPending} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50">
                                            <XCircle className="h-3.5 w-3.5" /> Odrzuć
                                        </button>
                                    </div>
                                )}
                                {order.status === 'APPROVED' && (
                                    <button onClick={() => handleStatus(order.id, 'COMPLETED')} disabled={updateStatus.isPending} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors disabled:opacity-50">
                                        <CheckCircle className="h-3.5 w-3.5" /> Zrealizuj
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function WarehouseView({ warehouseId }: { warehouseId: number }) {
    const [tab, setTab] = useState<'stock' | 'orders'>('orders');

    return (
        <div className="space-y-6">
            <div className="flex gap-2 bg-stone-100 p-1 rounded-2xl w-fit">
                <button onClick={() => setTab('orders')} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all', tab === 'orders' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700')}>
                    <ClipboardList className="h-4 w-4" /> Zamówienia
                </button>
                <button onClick={() => setTab('stock')} className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all', tab === 'stock' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700')}>
                    <Package className="h-4 w-4" /> Stan magazynu
                </button>
            </div>

            {tab === 'orders' ? <OrdersTab /> : <StockTab warehouseId={warehouseId} />}
        </div>
    );
}

// ─── VET VIEW ─────────────────────────────────────────────────────────────────

function VetView({ clinicId }: { clinicId: number }) {
    const addNotification = useNotificationStore((s) => s.addNotification);
    const createOrder = useCreateOrder();
    const emptyForm = { name: '', amount: '1', unit: '', category: '', description: '', expiryDate: '' };
    const [form, setForm] = useState(emptyForm);
    const [submitted, setSubmitted] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createOrder.mutateAsync({
                clinicId,
                name: form.name,
                amount: Number(form.amount),
                unit: form.unit || undefined,
                category: form.category || undefined,
                description: form.description || undefined,
                expiryDate: form.expiryDate || undefined,
            });
            setSubmitted((prev) => [`${form.name} × ${form.amount}${form.unit ? ' ' + form.unit : ''}`, ...prev]);
            setForm(emptyForm);
            addNotification({ message: 'Zamówienie złożone', type: 'success' });
        } catch {
            addNotification({ message: 'Błąd składania zamówienia', type: 'error' });
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-stone-900 mb-5 flex items-center gap-2">
                    <PackagePlus className="h-5 w-5 text-[#68b9dc]" /> Zamów produkt
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input required placeholder="Nazwa produktu *" className={INPUT} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input required type="number" min="1" placeholder="Ilość *" className={INPUT} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                        <input placeholder="Jednostka (szt, op…)" className={INPUT} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                    </div>
                    <input placeholder="Kategoria" className={INPUT} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    <textarea placeholder="Uwagi / opis" rows={3} className={INPUT + ' resize-none'} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <div>
                        <label className="text-xs text-stone-500 mb-1 block">Data ważności (opcjonalnie)</label>
                        <input type="date" className={INPUT} value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                    </div>
                    <button type="submit" disabled={createOrder.isPending} className="w-full py-3 bg-[#68b9dc] text-white rounded-xl font-semibold hover:bg-blue-500 transition-all disabled:opacity-50">
                        {createOrder.isPending ? 'Wysyłanie…' : 'Złóż zamówienie'}
                    </button>
                </form>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-stone-900 mb-5 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-stone-400" /> Złożone w tej sesji
                </h2>
                {submitted.length === 0 ? (
                    <p className="text-stone-400 text-sm">Jeszcze nie złożono żadnego zamówienia.</p>
                ) : (
                    <ul className="space-y-2">
                        {submitted.map((label, i) => (
                            <li key={i} className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-0">
                                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span className="text-sm text-stone-700">{label}</span>
                                <StatusBadge status="PENDING" />
                            </li>
                        ))}
                    </ul>
                )}
                <p className="text-xs text-stone-400 mt-4">Zamówienia trafiają do magazynu centralnego. Status możesz śledzić u magazyniera.</p>
            </div>
        </div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SuppliesPage() {
    const { data: warehouseMe, isLoading: loadingWarehouse, isError: notWarehouse } = useWarehouseMe();
    const { data: vetMe, isLoading: loadingVet } = useVetMe();

    const isLoading = loadingWarehouse || (notWarehouse && loadingVet);

    const title = warehouseMe ? 'Zarządzanie magazynem' : 'Zaopatrzenie gabinetu';
    const subtitle = warehouseMe
        ? `Magazyn: ${warehouseMe.warehouseName}`
        : vetMe?.clinicName
        ? `Gabinet: ${vetMe.clinicName}`
        : 'Sklep centralny';

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-display font-bold text-stone-900">{title}</h1>
                <p className="text-stone-500 mt-1">{subtitle}</p>
            </header>

            {isLoading && (
                <div className="py-16 text-center text-stone-400">Ładowanie…</div>
            )}

            {!isLoading && warehouseMe && (
                <WarehouseView warehouseId={warehouseMe.warehouseId} />
            )}

            {!isLoading && notWarehouse && vetMe?.clinicId != null && (
                <VetView clinicId={vetMe.clinicId} />
            )}

            {!isLoading && notWarehouse && vetMe && vetMe.clinicId == null && (
                <div className="py-16 text-center text-stone-400 text-sm">
                    Twoje konto lekarza nie ma przypisanej kliniki. Skontaktuj się z administratorem.
                </div>
            )}

            {!isLoading && notWarehouse && !vetMe && (
                <div className="py-16 text-center text-stone-400 text-sm">
                    Nie można załadować danych. Sprawdź połączenie z API.
                </div>
            )}
        </div>
    );
}
