import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Phone, ShieldCheck, Zap } from 'lucide-react';

const Login = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(mobile, password);
        setLoading(false);
        if (result.success) navigate('/');
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="mesh-bg" />

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card relative z-10"
                style={{ padding: '40px 32px', width: '100%', maxWidth: 400 }}
            >
                {/* Logo */}
                <div className="flex justify-center" style={{ marginBottom: 32 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0,229,255,0.25)' }}>
                        <Zap size={30} style={{ color: '#0B1D3A' }} />
                    </div>
                </div>

                <div className="text-center" style={{ marginBottom: 36 }}>
                    <h1 className="outfit" style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px' }}>XEVON</h1>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 6 }}>Institutional Grade Assets</p>
                </div>

                {error && (
                    <div style={{ padding: '12px 16px', marginBottom: 24, borderRadius: 12, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fb7185', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>Mobile Number</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Phone size={18} /></span>
                            <input
                                type="tel"
                                className="premium-input"
                                style={{ paddingLeft: 48 }}
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="Enter mobile number"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>Secure Password</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18} /></span>
                            <input
                                type="password"
                                className="premium-input"
                                style={{ paddingLeft: 48 }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter passcode"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="premium-btn" style={{ marginTop: 8, padding: '16px', width: '100%' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Login to Account'}
                    </button>

                    <div className="flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}>
                        <ShieldCheck size={14} style={{ color: 'rgba(0,229,255,0.5)' }} />
                        SECURE AES-256 CONNECTION
                    </div>
                </form>

                <div style={{ marginTop: 40, textAlign: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-muted)' }}>New user? </span>
                    <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>Create Account</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
