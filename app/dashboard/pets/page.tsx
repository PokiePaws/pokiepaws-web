'use client';

import { useState } from 'react';
import { PawPrint, Plus, Search, ChevronRight, Info, Activity, Hash, Loader2, Pencil, Trash2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnimals, useCreateAnimal, useDeleteAnimal, useUpdateAnimal } from '../../../lib/features/api-hooks';
import type { Animal, AnimalRequest } from '../../../lib/features/api-schemas';

const INPUT_CLS = 'w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all';

const EMPTY_FORM: AnimalRequest = {
    name: '',
    species: '',
    breed: '',
    gender: 'MALE',
    color: '',
    microchipNumber: '',
    weight: undefined,
    birthDate: '',
    notes: '',
};

function PetForm({
    initial,
    onSubmit,
    onCancel,
    isPending,
}: {
    initial: AnimalRequest;
    onSubmit: (data: AnimalRequest) => void;
    onCancel: () => void;
    isPending: boolean;
}) {
    const [form, setForm] = useState<AnimalRequest>(initial);
    const set = (field: keyof AnimalRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value || undefined }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...form, weight: form.weight ? Number(form.weight) : undefined });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Imię *</label>
                    <input required placeholder="Imię pupila" value={form.name} onChange={set('name')} className={INPUT_CLS} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Gatunek *</label>
                    <input required placeholder="np. Pies, Kot" value={form.species} onChange={set('species')} className={INPUT_CLS} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rasa</label>
                    <input placeholder="Rasa" value={form.breed ?? ''} onChange={set('breed')} className={INPUT_CLS} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Płeć *</label>
                    <select required value={form.gender} onChange={set('gender')} className={INPUT_CLS}>
                        <option value="MALE">Samiec</option>
                        <option value="FEMALE">Samica</option>
                        <option value="HERMAPHRODITE">Hermafrodyta</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Data urodzenia</label>
                    <input type="date" value={form.birthDate ?? ''} onChange={set('birthDate')} className={INPUT_CLS} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Masa (kg)</label>
                    <input type="number" step="0.1" min="0" placeholder="np. 4.5" value={form.weight ?? ''} onChange={set('weight')} className={INPUT_CLS} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Kolor</label>
                    <input placeholder="Kolor" value={form.color ?? ''} onChange={set('color')} className={INPUT_CLS} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nr mikrochipa</label>
                    <input placeholder="Nr mikrochipa" value={form.microchipNumber ?? ''} onChange={set('microchipNumber')} className={INPUT_CLS} />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Notatki</label>
                <textarea placeholder="Notatki medyczne..." value={form.notes ?? ''} onChange={e => setForm(p => ({ ...p, notes: e.target.value || undefined }))} className={`${INPUT_CLS} resize-none`} rows={3} />
            </div>
            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isPending} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {isPending ? 'Zapisywanie...' : 'Zapisz'}
                </button>
                <button type="button" onClick={onCancel} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all">
                    Anuluj
                </button>
            </div>
        </form>
    );
}

export default function PetsPage() {
    const [selectedPet, setSelectedPet] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPet, setEditingPet] = useState<Animal | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const { data: pets = [], isLoading } = useAnimals();
    const createAnimal = useCreateAnimal();
    const updateAnimal = useUpdateAnimal();
    const deleteAnimal = useDeleteAnimal();

    const filteredPets = pets.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.species.toLowerCase().includes(search.toLowerCase()) ||
        (p.breed ?? '').toLowerCase().includes(search.toLowerCase()),
    );

    const activePet = pets.find(p => String(p.id) === selectedPet) || filteredPets[0];
    const activeWeightData = activePet?.weight
        ? [{ date: 'Current', weight: activePet.weight }]
        : [];

    const handleCreate = async (data: AnimalRequest) => {
        await createAnimal.mutateAsync(data);
        setShowAddForm(false);
    };

    const handleUpdate = async (data: AnimalRequest) => {
        if (!editingPet) return;
        await updateAnimal.mutateAsync({ id: editingPet.id, payload: data });
        setEditingPet(null);
    };

    const handleDelete = async (id: number) => {
        await deleteAnimal.mutateAsync(id);
        setConfirmDelete(null);
        if (String(id) === selectedPet) setSelectedPet(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-stone-900">My Pets</h1>
                    <p className="text-stone-500">Manage your pets&apos; health records and information.</p>
                </div>
                <button
                    onClick={() => { setShowAddForm(true); setEditingPet(null); }}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                    <Plus className="h-5 w-5" /> Add New Pet
                </button>
            </header>

            <AnimatePresence>
                {(showAddForm || editingPet) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-stone-900">
                                {editingPet ? `Edytuj: ${editingPet.name}` : 'Dodaj nowego pupila'}
                            </h2>
                            <button onClick={() => { setShowAddForm(false); setEditingPet(null); }} className="p-2 text-stone-400 hover:text-stone-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <PetForm
                            initial={editingPet ? {
                                name: editingPet.name,
                                species: editingPet.species,
                                breed: editingPet.breed ?? '',
                                gender: editingPet.gender,
                                color: editingPet.color ?? '',
                                microchipNumber: editingPet.microchipNumber ?? '',
                                weight: editingPet.weight ?? undefined,
                                birthDate: editingPet.birthDate ?? '',
                                notes: editingPet.notes ?? '',
                            } : EMPTY_FORM}
                            onSubmit={editingPet ? handleUpdate : handleCreate}
                            onCancel={() => { setShowAddForm(false); setEditingPet(null); }}
                            isPending={createAnimal.isPending || updateAnimal.isPending}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid lg:grid-cols-3 gap-8">
                <aside className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search pets..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="space-y-3">
                        {filteredPets.map((pet) => (
                            <div key={pet.id} className={`bg-white border rounded-2xl transition-all ${activePet?.id === pet.id ? 'border-emerald-200 shadow-sm' : 'border-stone-100 hover:border-stone-200'}`}>
                                <button
                                    onClick={() => setSelectedPet(String(pet.id))}
                                    className="w-full flex items-center gap-4 p-4 text-left"
                                >
                                    <div className="h-12 w-12 rounded-xl overflow-hidden relative flex-shrink-0">
                                        <div className="absolute inset-0 flex items-center justify-center bg-emerald-50">
                                            <PawPrint className="h-6 w-6 text-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className={`font-bold truncate ${activePet?.id === pet.id ? 'text-emerald-900' : 'text-stone-900'}`}>{pet.name}</h3>
                                        <p className="text-xs text-stone-500 truncate">{pet.breed || pet.species}</p>
                                    </div>
                                    <ChevronRight className={`h-5 w-5 flex-shrink-0 ${activePet?.id === pet.id ? 'text-emerald-500' : 'text-stone-300'}`} />
                                </button>
                                <div className="px-4 pb-3 flex gap-2 border-t border-stone-50 pt-2">
                                    <button
                                        onClick={() => { setEditingPet(pet); setShowAddForm(false); }}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-600 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
                                    >
                                        <Pencil className="h-3 w-3" /> Edytuj
                                    </button>
                                    {confirmDelete === pet.id ? (
                                        <>
                                            <button
                                                onClick={() => handleDelete(pet.id)}
                                                disabled={deleteAnimal.isPending}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                            >
                                                {deleteAnimal.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Potwierdź
                                            </button>
                                            <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 text-xs font-semibold text-stone-500 bg-stone-50 rounded-lg hover:bg-stone-100">
                                                Anuluj
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmDelete(pet.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="h-3 w-3" /> Usuń
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredPets.length === 0 && (
                        <div className="bg-white border border-stone-100 rounded-2xl p-6 text-sm text-stone-500">
                            {search ? 'Brak wyników.' : 'No pets registered yet.'}
                        </div>
                    )}
                </aside>

                {activePet && !showAddForm && !editingPet && (
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePet.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                                        <div className="h-32 w-32 rounded-3xl overflow-hidden shadow-lg border-4 border-white flex-shrink-0 relative">
                                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-50">
                                                <PawPrint className="h-14 w-14 text-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="flex-grow space-y-4">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-4xl font-display font-bold text-stone-900">{activePet.name}</h2>
                                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    {activePet.species}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Breed</p>
                                                    <p className="text-sm font-medium text-stone-700">{activePet.breed || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Birthday</p>
                                                    <p className="text-sm font-medium text-stone-700">{activePet.birthDate || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Microchip</p>
                                                    <p className="text-sm font-medium text-stone-700">{activePet.microchipNumber || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                                    <Hash className="h-3 w-3" /> {activePet.gender}
                                                </span>
                                                {activePet.color && (
                                                    <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                                        <Hash className="h-3 w-3" /> {activePet.color}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-emerald-600" />
                                                <h3 className="font-bold text-stone-900">Weight History</h3>
                                            </div>
                                        </div>
                                        {activeWeightData.length > 0 ? (
                                            <div className="h-48 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={activeWeightData}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a8a29e' }} />
                                                        <YAxis hide />
                                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                        <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        ) : (
                                            <div className="h-48 w-full rounded-2xl border border-dashed border-stone-200 bg-stone-50 flex items-center justify-center">
                                                <p className="text-sm text-stone-500">No weight data yet.</p>
                                            </div>
                                        )}
                                        <div className="pt-4 border-t border-stone-50 flex justify-between items-center">
                                            <p className="text-sm text-stone-500">Current Weight</p>
                                            <p className="text-lg font-bold text-stone-900">{activePet.weight ? `${activePet.weight} kg` : '-'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Info className="h-5 w-5 text-amber-600" />
                                                <h3 className="font-bold text-stone-900">Allergies & Risks</h3>
                                            </div>
                                            <p className="text-sm text-stone-400 italic">No allergy data in API.</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-5 w-5 text-blue-600" />
                                                <h3 className="font-bold text-stone-900">Medical Notes</h3>
                                            </div>
                                            <p className="text-sm text-stone-600 leading-relaxed">
                                                {activePet.notes || 'No medical notes yet.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
