import React from 'react';
import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Layers, Share2, User, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const location = useLocation();
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
                <div style={{ width: 36, height: 36, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Home' },
        { path: '/plans', icon: Layers, label: 'Invest' },
        { path: '/refer', icon: Share2, label: 'Refer' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <div className="mesh-bg" />

            {/* Header */}
            <header className="flex items-center justify-between relative z-10" style={{ padding: '20px 20px 8px' }}>
                <div className="flex items-center gap-3">
                    <div style={{
                        width: 38, height: 38, borderRadius: 13,
                        background: 'var(--primary-gradient)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(37,99,235,0.25)'
                    }}>
                        <span className="outfit" style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>X</span>
                    </div>
                    <h1 className="outfit" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>XEVON</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div style={{
                        width: 42, height: 42, borderRadius: 14,
                        background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(37,99,235,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <Bell size={18} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{
                        width: 42, height: 42, borderRadius: 14, overflow: 'hidden',
                        border: '2px solid rgba(37,99,235,0.15)',
                        boxShadow: '0 2px 8px rgba(37,99,235,0.1)'
                    }}>
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=DBEAFE&color=2563EB&bold=true&size=80`}
                            alt="avatar"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </header>

            {/* Greeting */}
            <div className="relative z-10" style={{ padding: '12px 20px 4px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Welcome back,</p>
                <p className="outfit" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name || 'Guest'}</p>
            </div>

            {/* Main Content */}
            <main className="relative z-10" style={{ padding: '12px 20px 120px', maxWidth: 560, margin: '0 auto' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Navigation */}
            <nav className="ultra-bottom-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        {({ isActive }) => (
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-col items-center gap-1"
                            >
                                <div style={{
                                    padding: 8, borderRadius: 12,
                                    background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
                                    transition: 'background 0.25s'
                                }}>
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                                </div>
                                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px rgba(37,99,235,0.4)' }}
                                    />
                                )}
                            </motion.div>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Layout;
