'use client';

import { useState } from 'react';
import { Package, Plus, Search, X, Check, ShoppingCart, AlertTriangle, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from '../../../store/use-notification-store';

export default function SuppliesPage() {
    const [showForm, setShowForm] = useState(false);
    const addNotification = useNotificationStore(state => state.addNotification);

    const inventory = [
        { id: 'i1', name: 'Latex Gloves (M)', stock: 45, unit: 'boxes', status: 'Low' },
        { id: 'i2', name: 'Syringes 5ml', stock: 120, unit: 'pcs', status: 'In Stock' },
        { id: 'i3', name: 'Amoxicillin 250mg', stock: 12, unit: 'bottles', status: 'Critical' },
    ];

    const orders = [
        { id: 's1', item: 'Latex Gloves (M)', quantity: 10, date: '2024-05-14', status: 'Approved' },
        { id: 's2', item: 'Amoxicillin 250mg', quantity: 5, date: '2024-05-14', status: 'Pending' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addNotification({ message: 'Supply order submitted and self-approved', type: 'success' });
        setShowForm(false);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Clinic Supplies</h1>
                    <p className="text-slate-500">Manage inventory and order materials for your clinic.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <ShoppingCart className="h-5 w-5" />
                    Order Supplies
                </button>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Inventory Status */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            Current Inventory
                        </h2>
                        <div className="space-y-4">
                            {inventory.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-900">{item.name}</p>
                                        <p className="text-sm text-slate-500">{item.stock} {item.unit} remaining</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        item.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                            item.status === 'Low' ? 'bg-amber-100 text-amber-700' :
                                                'bg-emerald-100 text-emerald-700'
                                    }`}>
                    {item.status}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Truck className="h-5 w-5 text-blue-600" />
                            Recent Orders
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item</th>
                                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty</th>
                                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                {orders.map((o) => (
                                    <tr key={o.id}>
                                        <td className="py-4 text-sm font-medium text-slate-900">{o.item}</td>
                                        <td className="py-4 text-sm text-slate-600">{o.quantity}</td>
                                        <td className="py-4 text-sm text-slate-500">{o.date}</td>
                                        <td className="py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            o.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {o.status}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions / Alerts */}
                <div className="space-y-6">
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                        <div className="flex items-center gap-3 text-amber-800 mb-4">
                            <AlertTriangle className="h-6 w-6" />
                            <h3 className="font-bold">Stock Alerts</h3>
                        </div>
                        <p className="text-sm text-amber-700 mb-4">3 items are below safety stock levels. Consider ordering soon.</p>
                        <ul className="space-y-2">
                            <li className="text-xs text-amber-800 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                Amoxicillin 250mg (12 left)
                            </li>
                            <li className="text-xs text-amber-800 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                Latex Gloves (M) (45 left)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                        >
                            <div className="p-8 sm:p-12">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-display font-bold text-slate-900">Order Supplies</h2>
                                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                        <X className="h-6 w-6 text-slate-400" />
                                    </button>
                                </div>

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Item Name</label>
                                        <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Surgical Masks" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
                                            <input type="number" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="10" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
                                            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                                <option>boxes</option>
                                                <option>pcs</option>
                                                <option>bottles</option>
                                                <option>packs</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Notes</label>
                                        <textarea rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Special instructions..."></textarea>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-700 text-xs">
                                        <p className="font-bold mb-1">Self-Approval Enabled</p>
                                        <p>As a staff member, your supply orders are automatically approved for your clinic.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                    >
                                        Place Order
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
