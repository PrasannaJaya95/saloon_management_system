import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container - Centered */}
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none p-4">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto
                            min-w-[320px] max-w-[420px] p-6 rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-col items-center text-center gap-3 
                            animate-in zoom-in-95 fade-in-0 duration-300
                            mb-4 last:mb-0
                            ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-white' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-white' : ''}
                            ${toast.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-white' : ''}
                        `}
                    >
                        <div className={`
                            p-3 rounded-full mb-1
                            ${toast.type === 'success' ? 'bg-green-500/20 text-green-400' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : ''}
                            ${toast.type === 'info' ? 'bg-blue-500/20 text-blue-400' : ''}
                        `}>
                            {toast.type === 'success' && <CheckCircle className="w-8 h-8" />}
                            {toast.type === 'error' && <AlertCircle className="w-8 h-8" />}
                            {toast.type === 'info' && <Info className="w-8 h-8" />}
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-semibold">
                                {toast.type === 'success' && 'Success'}
                                {toast.type === 'error' && 'Error'}
                                {toast.type === 'info' && 'Information'}
                            </h3>
                            <p className="text-sm text-gray-400">{toast.message}</p>
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
