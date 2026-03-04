'use client';

import { useNotificationStore } from '../store/use-notification-store';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

export default function NotificationToast() {
    const { notifications, removeNotification } = useNotificationStore();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
            case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'warning': return <AlertCircle className="h-5 w-5 text-amber-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-stone-100 p-4 w-80 flex items-start gap-4"
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon(n.type)}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-medium text-stone-800 leading-tight">{n.message}</p>
                            <p className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-wider">Just now</p>
                        </div>
                        <button
                            onClick={() => removeNotification(n.id)}
                            className="flex-shrink-0 text-stone-300 hover:text-stone-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
