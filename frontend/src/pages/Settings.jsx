import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Settings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/change-password', { currentPassword, newPassword });
            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card flex flex-col items-center text-center" style={{ padding: 40, marginTop: 40, gap: 20 }}>
                <div style={{ padding: 20, borderRadius: '50%', background: 'rgba(22,163,74,0.08)' }}>
                    <CheckCircle2 size={48} style={{ color: 'var(--success)' }} />
                </div>
                <div>
                    <h2 className="outfit" style={{ fontSize: '1.5rem', fontWeight: 900 }}>Password Updated</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>Your password has been changed successfully.</p>
                </div>
                <Link to="/profile" className="premium-btn" style={{ width: '100%', padding: '16px' }}>Back to Profile</Link>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col" style={{ gap: 28, paddingBottom: 120 }}>
            <div className="flex justify-between items-center">
                <div>
                    <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Security</p>
                    <h1 className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900 }}>Settings</h1>
                </div>
                <Link to="/profile" style={{ padding: 12, borderRadius: 14, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(37,99,235,0.08)', color: 'var(--text-secondary)', display: 'flex' }}>
                    <ArrowLeft size={20} />
                </Link>
            </div>

            {/* Change Password Card */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24 }}>
                <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
                    <div style={{ padding: 10, borderRadius: 14, background: 'rgba(37,99,235,0.06)', color: 'var(--accent)' }}>
                        <Lock size={20} />
                    </div>
                    <div>
                        <h3 className="outfit" style={{ fontSize: '1rem', fontWeight: 800 }}>Change Password</h3>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Update your account password</p>
                    </div>
                </div>

                {error && (
                    <div style={{ padding: '12px 16px', marginBottom: 20, borderRadius: 14, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: 'var(--error)', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Current Password */}
                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>Current Password</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18} /></span>
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                className="premium-input"
                                style={{ paddingLeft: 48, paddingRight: 48 }}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                required
                            />
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18} /></span>
                            <input
                                type={showNew ? 'text' : 'password'}
                                className="premium-input"
                                style={{ paddingLeft: 48, paddingRight: 48 }}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Min 6 characters"
                                minLength="6"
                                required
                            />
                            <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>Confirm New Password</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Lock size={18} /></span>
                            <input
                                type="password"
                                className="premium-input"
                                style={{ paddingLeft: 48 }}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                minLength="6"
                                required
                            />
                        </div>
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p style={{ fontSize: 10, color: 'var(--error)', fontWeight: 600, marginTop: 6, marginLeft: 2 }}>Passwords do not match</p>
                        )}
                    </div>

                    {/* Security Note */}
                    <div className="flex items-start gap-3" style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.06)' }}>
                        <ShieldCheck size={16} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Your password is encrypted using industry-standard bcrypt hashing. We never store plain-text passwords.
                        </p>
                    </div>

                    <button type="submit" className="premium-btn" style={{ padding: '18px', width: '100%' }} disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Settings;
