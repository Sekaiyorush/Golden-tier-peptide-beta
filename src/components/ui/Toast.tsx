import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
                {toasts.map(t => (
                    <ToastItem key={t.id} toast={t} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), 3500);
        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;
    const colors = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };
    const iconColors = {
        success: 'text-emerald-500',
        error: 'text-red-500',
        info: 'text-blue-500',
    };

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-right ${colors[toast.type]}`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
        >
            <Icon className={`h-5 w-5 flex-shrink-0 ${iconColors[toast.type]}`} />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="p-0.5 rounded hover:bg-black/5 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
