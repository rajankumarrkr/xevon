import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, X, Sparkles } from 'lucide-react';

const toastConfig = {
    success: {
        icon: CheckCircle2,
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        glow: 'rgba(16, 185, 129, 0.4)',
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'rgba(16, 185, 129, 0.2)',
        color: '#10B981',
        emoji: '🎉'
    },
    error: {
        icon: XCircle,
        gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        glow: 'rgba(239, 68, 68, 0.4)',
        bg: 'rgba(239, 68, 68, 0.08)',
        border: 'rgba(239, 68, 68, 0.2)',
        color: '#EF4444',
        emoji: '⚠️'
    },
    warning: {
        icon: AlertTriangle,
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        glow: 'rgba(245, 158, 11, 0.4)',
        bg: 'rgba(245, 158, 11, 0.08)',
        border: 'rgba(245, 158, 11, 0.2)',
        color: '#F59E0B',
        emoji: '💰'
    }
};

const Toast = ({ toast, onClose }) => {
    const config = toastConfig[toast.type] || toastConfig.success;
    const Icon = config.icon;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, toast.duration || 4000);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: 380,
                borderRadius: 20,
                overflow: 'hidden',
                background: 'rgba(11, 15, 47, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${config.border}`,
                boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${config.glow}`,
            }}
        >
            {/* Top gradient bar */}
            <div style={{
                height: 3,
                background: config.gradient,
                borderRadius: '20px 20px 0 0',
            }} />

            {/* Animated progress bar */}
            <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
                style={{
                    height: 2,
                    background: config.gradient,
                    opacity: 0.5,
                }}
            />

            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                {/* Icon */}
                <motion.div
                    initial={{ rotate: -15, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: config.bg,
                        border: `1px solid ${config.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <Icon size={22} style={{ color: config.color }} />
                </motion.div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 14 }}>{config.emoji}</span>
                        <p className="outfit" style={{
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            color: '#fff',
                            letterSpacing: '-0.3px'
                        }}>
                            {toast.title}
                        </p>
                    </div>
                    <p style={{
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 500,
                        lineHeight: 1.4,
                    }}>
                        {toast.message}
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={() => onClose(toast.id)}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10,
                        padding: 6,
                        color: 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        flexShrink: 0,
                        display: 'flex',
                        transition: 'all 0.2s',
                    }}
                >
                    <X size={14} />
                </button>
            </div>
        </motion.div>
    );
};

const ToastContainer = ({ toasts, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            pointerEvents: 'none',
            width: '90%',
            maxWidth: 400,
        }}>
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} style={{ pointerEvents: 'auto', width: '100%' }}>
                        <Toast toast={toast} onClose={onClose} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// Hook for easy toast usage
export const useToast = () => {
    const [toasts, setToasts] = React.useState([]);

    const addToast = React.useCallback((type, title, message, duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, type, title, message, duration }]);
    }, []);

    const removeToast = React.useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = React.useCallback((title, message) => addToast('success', title, message), [addToast]);
    const error = React.useCallback((title, message) => addToast('error', title, message), [addToast]);
    const warning = React.useCallback((title, message) => addToast('warning', title, message), [addToast]);

    return { toasts, removeToast, success, error, warning, ToastContainer };
};

export default ToastContainer;
