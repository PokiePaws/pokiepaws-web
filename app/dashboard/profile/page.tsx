'use client';

import { useEffect, useState } from 'react';
import { User, Phone, Lock, MapPin, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    useDeleteOwnerAccount,
    useOwnerProfile,
    useUpdateOwnerAddress,
    useUpdateOwnerPassword,
    useUpdateOwnerPhone,
} from '../../../lib/features/api-hooks';
import { useNotificationStore } from '../../../store/use-notification-store';

const INPUT_CLS = 'w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all';
const SECTION_CLS = 'bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-5';
const LABEL_CLS = 'block text-sm font-medium text-slate-700 mb-1';

export default function ProfilePage() {
    const router = useRouter();
    const addNotification = useNotificationStore(s => s.addNotification);
    const { data: profile, isLoading } = useOwnerProfile();

    const updatePhone = useUpdateOwnerPhone();
    const updatePassword = useUpdateOwnerPassword();
    const updateAddress = useUpdateOwnerAddress();
    const deleteAccount = useDeleteOwnerAccount();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [address, setAddress] = useState({
        street: '',
        houseNumber: '',
        apartmentNumber: '',
        postalCode: '',
        city: '',
        country: '',
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (profile) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPhoneNumber(profile.phoneNumber ?? '');
            setAddress({
                street: profile.street ?? '',
                houseNumber: profile.houseNumber ?? '',
                apartmentNumber: profile.apartmentNumber ?? '',
                postalCode: profile.postalCode ?? '',
                city: profile.city ?? '',
                country: profile.country ?? '',
            });
        }
    }, [profile]);

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updatePhone.mutateAsync({ phoneNumber });
            addNotification({ message: 'Numer telefonu zaktualizowany.', type: 'success' });
        } catch {
            addNotification({ message: 'Nie udało się zaktualizować telefonu.', type: 'error' });
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            addNotification({ message: 'Hasła nie są zgodne.', type: 'error' });
            return;
        }
        try {
            await updatePassword.mutateAsync({
                currentPassword: password.currentPassword,
                newPassword: password.newPassword,
            });
            setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
            addNotification({ message: 'Hasło zostało zmienione.', type: 'success' });
        } catch (err) {
            addNotification({
                message: err instanceof Error ? err.message : 'Nie udało się zmienić hasła.',
                type: 'error',
            });
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateAddress.mutateAsync({
                street: address.street,
                houseNumber: address.houseNumber,
                apartmentNumber: address.apartmentNumber || undefined,
                postalCode: address.postalCode,
                city: address.city,
                country: address.country,
            });
            addNotification({ message: 'Adres zaktualizowany.', type: 'success' });
        } catch {
            addNotification({ message: 'Nie udało się zaktualizować adresu.', type: 'error' });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount.mutateAsync();
            router.push('/');
        } catch {
            addNotification({ message: 'Nie udało się usunąć konta.', type: 'error' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <header>
                <h1 className="text-3xl font-display font-bold text-stone-900">Mój profil</h1>
                <p className="text-stone-500 mt-1">Zarządzaj swoimi danymi kontaktowymi.</p>
            </header>

            {profile && (
                <div className={SECTION_CLS}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <User className="h-7 w-7 text-blue-500" />
                        </div>
                        <div>
                            <p className="font-bold text-stone-900 text-lg">{profile.firstName} {profile.lastName}</p>
                            <p className="text-stone-500 text-sm">{profile.email}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handlePhoneSubmit} className={SECTION_CLS}>
                <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <h2 className="font-bold text-stone-900">Numer telefonu</h2>
                </div>
                <div>
                    <label className={LABEL_CLS}>Telefon</label>
                    <input
                        required
                        placeholder="+48 123 456 789"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className={INPUT_CLS}
                    />
                </div>
                <button
                    type="submit"
                    disabled={updatePhone.isPending}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {updatePhone.isPending ? 'Zapisywanie...' : 'Zapisz telefon'}
                </button>
            </form>

            <form onSubmit={handlePasswordSubmit} className={SECTION_CLS}>
                <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <h2 className="font-bold text-stone-900">Zmiana hasła</h2>
                </div>
                <div>
                    <label className={LABEL_CLS}>Aktualne hasło</label>
                    <input
                        required
                        type="password"
                        placeholder="Aktualne hasło"
                        value={password.currentPassword}
                        onChange={e => setPassword(p => ({ ...p, currentPassword: e.target.value }))}
                        className={INPUT_CLS}
                    />
                </div>
                <div>
                    <label className={LABEL_CLS}>Nowe hasło</label>
                    <input
                        required
                        type="password"
                        placeholder="Min. 8 znaków"
                        value={password.newPassword}
                        onChange={e => setPassword(p => ({ ...p, newPassword: e.target.value }))}
                        className={INPUT_CLS}
                        minLength={8}
                    />
                </div>
                <div>
                    <label className={LABEL_CLS}>Powtórz nowe hasło</label>
                    <input
                        required
                        type="password"
                        placeholder="Powtórz hasło"
                        value={password.confirmPassword}
                        onChange={e => setPassword(p => ({ ...p, confirmPassword: e.target.value }))}
                        className={INPUT_CLS}
                        minLength={8}
                    />
                </div>
                <button
                    type="submit"
                    disabled={updatePassword.isPending}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {updatePassword.isPending ? 'Zapisywanie...' : 'Zmień hasło'}
                </button>
            </form>

            <form onSubmit={handleAddressSubmit} className={SECTION_CLS}>
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <h2 className="font-bold text-stone-900">Adres</h2>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                        <label className={LABEL_CLS}>Ulica</label>
                        <input required placeholder="Ulica" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} className={INPUT_CLS} />
                    </div>
                    <div>
                        <label className={LABEL_CLS}>Nr domu</label>
                        <input required placeholder="Nr" value={address.houseNumber} onChange={e => setAddress(a => ({ ...a, houseNumber: e.target.value }))} className={INPUT_CLS} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={LABEL_CLS}>Nr lokalu</label>
                        <input placeholder="Nr lokalu" value={address.apartmentNumber} onChange={e => setAddress(a => ({ ...a, apartmentNumber: e.target.value }))} className={INPUT_CLS} />
                    </div>
                    <div>
                        <label className={LABEL_CLS}>Kod pocztowy</label>
                        <input required placeholder="00-000" value={address.postalCode} onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))} className={INPUT_CLS} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={LABEL_CLS}>Miasto</label>
                        <input required placeholder="Miasto" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} className={INPUT_CLS} />
                    </div>
                    <div>
                        <label className={LABEL_CLS}>Kraj</label>
                        <input required placeholder="Kraj" value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value }))} className={INPUT_CLS} />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={updateAddress.isPending}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {updateAddress.isPending ? 'Zapisywanie...' : 'Zapisz adres'}
                </button>
            </form>

            <div className={`${SECTION_CLS} border-red-100`}>
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <h2 className="font-bold text-red-700">Strefa niebezpieczna</h2>
                </div>
                <p className="text-sm text-slate-500">Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną trwale usunięte.</p>
                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold text-sm hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" /> Usuń konto
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deleteAccount.isPending}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-all disabled:opacity-50"
                        >
                            {deleteAccount.isPending ? 'Usuwanie...' : 'Potwierdź usunięcie'}
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
                        >
                            Anuluj
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
