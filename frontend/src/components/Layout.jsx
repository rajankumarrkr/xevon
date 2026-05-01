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
            <header className="flex items-center justify-between relative z-10" style={{ padding: '24px 20px 12px' }}>
                <div className="flex items-center gap-3">
                    <div style={{
                        width: 42, height: 42, borderRadius: 14,
                        background: 'var(--primary-gradient)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)'
                    }}>
                        <span className="outfit" style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>X</span>
                    </div>
                    <h1 className="outfit" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>XEVON</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div style={{
                        width: 44, height: 44, borderRadius: 15,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <Bell size={20} style={{ color: '#fff' }} />
                        <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, background: '#A855F7', borderRadius: '50%', border: '2px solid #0B0F2F' }} />
                    </div>
                    <div style={{
                        width: 44, height: 44, borderRadius: 15, overflow: 'hidden',
                        background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.1)', fontWeight: 900, color: '#fff', fontSize: '0.9rem'
                    }}>
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                </div>
            </header>

            {/* Greeting is now inside Dashboard for better layout control */}

            {/* Main Content */}
            <main className="relative z-10" style={{ padding: '0 20px 120px', maxWidth: 500, margin: '0 auto' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
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
                                    padding: 10, borderRadius: 16,
                                    background: isActive ? 'var(--primary-gradient)' : 'transparent',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: isActive ? '0 4px 12px rgba(124, 58, 237, 0.4)' : 'none'
                                }}>
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }} />
                                </div>
                                <span style={{ fontSize: 10, fontWeight: isActive ? 800 : 600, color: isActive ? '#fff' : 'rgba(255,255,255,0.4)', letterSpacing: '0.3px' }}>{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-line"
                                        style={{ width: 12, height: 2, borderRadius: 10, background: 'var(--accent-light)', marginTop: 2, boxShadow: '0 0 8px var(--accent-light)' }}
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
