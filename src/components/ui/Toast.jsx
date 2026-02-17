import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

const ToastItem = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 3000);
        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    const bgColors = {
        success: 'bg-green-500/10 border-green-500/20 text-green-400',
        error: 'bg-red-500/10 border-red-500/20 text-red-400',
        warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    };

    return (
        <div
            className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg
        animate-slide-in-right overflow-hidden w-80 mb-2 transition-all
        ${bgColors[toast.type] || bgColors.info}
      `}
        >
            <span className="text-xl">{toast.icon}</span>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
                <X size={14} />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full animate-typewriter" style={{ animationDuration: '3000ms', animationTimingFunction: 'linear' }} />
        </div>
    );
};

export default function Toast() {
    const { state, dispatch } = useApp();

    const removeToast = (id) => {
        dispatch({ type: 'REMOVE_TOAST', payload: id });
    };

    if (state.toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                {state.toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </div>
    );
}
