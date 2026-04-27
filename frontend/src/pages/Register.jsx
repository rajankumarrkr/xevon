import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, User, Phone, Lock, Ticket, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        name: '', mobile: '', password: '',
        referralCode: searchParams.get('ref') || ''
    });
    const { register, error } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register(formData);
        setLoading(false);
        if (result.success) navigate('/');
    };

    const fields = [
        { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your name', required: true },
        { name: 'mobile', label: 'Mobile Number', icon: Phone, type: 'tel', placeholder: '10-digit number', pattern: '[0-9]{10}', required: true },
        { name: 'password', label: 'Password (Min 6)', icon: Lock, type: 'password', placeholder: '••••••••', minLength: '6', required: true },
        { name: 'referralCode', label: 'Referral Code (Optional)', icon: Ticket, type: 'text', placeholder: 'Optional', required: false },
    ];

    return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="mesh-bg" />

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card relative z-10"
                style={{ padding: '36px 28px', width: '100%', maxWidth: 440 }}
            >
                <div className="flex justify-between items-start" style={{ marginBottom: 32 }}>
                    <div>
                        <h1 className="outfit" style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>Create Account</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, marginTop: 4 }}>Join the XEVON platform</p>
                    </div>
                    <div style={{
                        padding: 12, borderRadius: 16,
                        background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.1)'
                    }}>
                        <UserPlus size={28} style={{ color: 'var(--accent)' }} />
                    </div>
                </div>

                {error && (
                    <div style={{ padding: '12px 16px', marginBottom: 20, borderRadius: 14, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: 'var(--error)', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {fields.map((f) => (
                        <div key={f.name}>
                            <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>{f.label}</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><f.icon size={18} /></span>
                                <input
                                    name={f.name}
                                    type={f.type}
                                    className="premium-input"
                                    style={{ paddingLeft: 48 }}
                                    value={formData[f.name]}
                                    onChange={handleChange}
                                    placeholder={f.placeholder}
                                    pattern={f.pattern}
                                    minLength={f.minLength}
                                    required={f.required}
                                />
                            </div>
                        </div>
                    ))}

                    <button type="submit" className="premium-btn" style={{ marginTop: 8, padding: '16px', width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : (<>Create Account <ArrowRight size={18} /></>)}
                    </button>

                    <div className="flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}>
                        <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
                        Secure Enrollment Protocol
                    </div>
                </form>

                <div style={{ marginTop: 32, textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
                    <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
