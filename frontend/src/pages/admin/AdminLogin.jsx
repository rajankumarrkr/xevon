import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, User, Terminal } from 'lucide-react';
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
            if (data && data.success && data.user && data.user.role === 'admin') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('adminAuth', 'true');
                navigate('/admin');
            } else {
                setError('Unauthorized access');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px', 
            background: '#0F172A',
            color: '#fff'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '40px 30px',
                    borderRadius: '24px',
                    background: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        width: '60px', height: '60px', borderRadius: '18px', 
                        background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                        margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Shield size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>XEVON Admin</h1>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', letterSpacing: '1px' }}>CONTROL PANEL LOGIN</p>
                </div>

                {error && (
                    <div style={{ 
                        padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.2)', color: '#F87171', 
                        fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' 
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '8px' }}>ADMIN ID</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                            <input
                                type="text"
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
                                placeholder="Enter Admin ID"
                                required
                                style={{
                                    width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px',
                                    background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#fff', outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '8px' }}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px',
                                    background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#fff', outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '12px',
                            background: '#2563EB', color: '#fff', fontWeight: 700,
                            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        {loading ? 'Verifying...' : 'Login to Dashboard'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
