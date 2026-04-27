import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, CreditCard, Layers, ArrowLeft, BarChart3, Terminal, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isAdminAuth = localStorage.getItem('adminAuth') === 'true';

    if (loading) return null;
    if (!isAdminAuth && (!user || user.role !== 'admin')) return <Navigate to="/admin/login" replace />;

    const menuItems = [
        { path: '/admin', icon: BarChart3, label: 'Statistics' },
        { path: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/plans', icon: Layers, label: 'Plans' },
    ];

    const Sidebar = ({ mobile }) => (
        <div style={{ padding: mobile ? '24px' : '32px', display: 'flex', flexDirection: 'column', gap: 32, height: '100%' }}>
            <div>
                <div className="flex items-center gap-3" style={{ marginBottom: 6 }}>
                    <Terminal style={{ color: 'var(--accent)' }} size={22} />
                    <h1 className="outfit" style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px' }}>XEVON</h1>
                </div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '2px' }}>ADMIN PANEL v3.2</p>
            </div>

            <nav className="flex flex-col gap-3">
                {menuItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} style={{ textDecoration: 'none', color: location.pathname === item.path ? 'var(--accent)' : 'var(--text-muted)' }}>
                        <div className="flex items-center gap-3" style={{
                            padding: '14px 16px', borderRadius: 14, transition: 'all 0.2s',
                            background: location.pathname === item.path ? 'rgba(59,130,246,0.08)' : 'transparent',
                            border: location.pathname === item.path ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent'
                        }}>
                            <item.icon size={18} />
                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.label}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            <div style={{ marginTop: 'auto' }}>
                <Link to="/" className="flex items-center gap-3" style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--bg-glass)', border: '1px solid rgba(0,0,0,0.04)', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.8rem' }}>
                    <ArrowLeft size={16} style={{ color: 'var(--text-muted)' }} /> User Dashboard
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex" style={{ minHeight: '100vh', background: 'var(--bg-darkest)' }}>
            {/* Desktop Sidebar */}
            <aside style={{
                width: 260, margin: 20, height: 'calc(100vh - 40px)', position: 'fixed',
                display: 'none', flexDirection: 'column', zIndex: 100, borderRadius: 24,
                background: 'rgba(255,255,255,0.8)', overflow: 'hidden'
            }} className="glass-card desktop-sidebar">
                <Sidebar />
            </aside>

            {/* Mobile Header */}
            <div className="mobile-admin-header" style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                padding: '16px 20px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div className="flex items-center gap-3">
                    <Terminal size={20} style={{ color: 'var(--accent)' }} />
                    <span className="outfit" style={{ fontWeight: 800, fontSize: '1.1rem' }}>XEVON Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 250 }}
                        />
                        <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }}
                            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 260, zIndex: 300, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(25px)', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                            <Sidebar mobile />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="admin-main" style={{ width: '100%', padding: '80px 20px 40px', position: 'relative' }}>
                <Outlet />
            </main>

            <style>{`
                .desktop-sidebar { display: none !important; }
                .mobile-admin-header { display: flex !important; }
                .admin-main { margin-left: 0 !important; }
                @media (min-width: 1024px) {
                    .desktop-sidebar { display: flex !important; }
                    .mobile-admin-header { display: none !important; }
                    .admin-main { margin-left: 300px !important; padding: 40px 40px 40px 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
