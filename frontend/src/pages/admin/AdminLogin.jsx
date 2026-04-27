import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, User, Terminal } from 'lucide-react';
import api from '../../services/api';

const AdminLogin = () => {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/admin-login', { adminId, password });
            if (data.success && data.user.role === 'admin') {
                localStorage.setItem('adminAuth', 'true');
                navigate('/admin');
            }
        } catch (err) {
            setError(err.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' }}>
            {/* Background Effects */}
            <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    padding: '48px 36px', width: '100%', maxWidth: 420, borderRadius: 28,
                    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 10,
                    boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
                }}
            >
                {/* Logo */}
                <div className="flex justify-center" style={{ marginBottom: 28 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 20,
                        background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(37,99,235,0.3)'
                    }}>
                        <ShieldCheck size={32} style={{ color: '#fff' }} />
                    </div>
                </div>

                <div className="text-center" style={{ marginBottom: 36 }}>
                    <div className="flex items-center justify-center gap-2" style={{ marginBottom: 8 }}>
                        <Terminal size={18} style={{ color: '#3B82F6' }} />
                        <h1 className="outfit" style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#F8FAFC' }}>XEVON</h1>
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Admin Control Panel</p>
                </div>

                {error && (
                    <div style={{ padding: '12px 16px', marginBottom: 24, borderRadius: 12, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#fb7185', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 20 }}>
                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>Admin ID</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}><User size={18} /></span>
                            <input
                                type="text"
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
                                placeholder="Enter Admin ID"
                                required
                                style={{
                                    width: '100%', padding: '16px 16px 16px 48px', borderRadius: 14,
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#F8FAFC', fontWeight: 700, fontSize: '0.9rem',
                                    outline: 'none', transition: 'all 0.25s', fontFamily: 'inherit'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'rgba(37,99,235,0.5)'; e.target.style.boxShadow = '0 0 20px rgba(37,99,235,0.1)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}><Lock size={18} /></span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%', padding: '16px 16px 16px 48px', borderRadius: 14,
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#F8FAFC', fontWeight: 700, fontSize: '0.9rem',
                                    outline: 'none', transition: 'all 0.25s', fontFamily: 'inherit'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'rgba(37,99,235,0.5)'; e.target.style.boxShadow = '0 0 20px rgba(37,99,235,0.1)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                            background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                            color: '#fff', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '1px',
                            textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
                            boxShadow: '0 8px 30px rgba(37,99,235,0.3)', fontFamily: 'inherit'
                        }}
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </button>
                </form>

                <p className="text-center" style={{ marginTop: 28, fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '1px' }}>
                    ENCRYPTED • SECURE • MONITORED
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
