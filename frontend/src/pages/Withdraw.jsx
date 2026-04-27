import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Wallet, ArrowLeft, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Withdraw = () => {
    const [amount, setAmount] = useState('');
    const [upi, setUpi] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (amount > user.walletBalance) { alert('Insufficient balance.'); return; }
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/transactions/withdraw', { amount, upi });
            setSuccess(true);
        } catch (err) { alert(err.response?.data?.message || 'Withdrawal failed'); }
        finally { setLoading(false); }
    };

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card flex flex-col items-center text-center" style={{ padding: 40, marginTop: 40, gap: 20 }}>
                <div style={{ padding: 20, borderRadius: '50%', background: 'rgba(59,130,246,0.1)' }}>
                    <Clock size={48} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                    <h2 className="outfit" style={{ fontSize: '1.5rem', fontWeight: 900 }}>Withdrawal Requested</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>₹{amount} will be transferred to {upi} within 24 hours.</p>
                </div>
                <Link to="/" className="premium-btn" style={{ width: '100%', padding: '16px' }}>Back to Home</Link>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col" style={{ gap: 28, paddingBottom: 100 }}>
            <div className="flex justify-between items-center">
                <div>
                    <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Payout Account</p>
                    <h1 className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900 }}>Withdraw</h1>
                </div>
                <Link to="/" style={{ padding: 12, borderRadius: 14, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', display: 'flex' }}>
                    <ArrowLeft size={20} />
                </Link>
            </div>

            {/* Balance Card */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24, background: 'rgba(0,0,0,0.03)' }}>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 10 }}>Available for Withdrawal</p>
                <div className="flex items-baseline gap-2" style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, opacity: 0.3 }}>₹</span>
                    <h2 className="outfit" style={{ fontSize: '2.2rem', fontWeight: 900 }}>
                        {user?.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)' }}>Encrypted Payout Protocol</span>
                </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 24 }}>
                <div>
                    <div className="flex justify-between items-center" style={{ marginBottom: 8, padding: '0 2px' }}>
                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>Amount (₹)</label>
                        <button type="button" onClick={() => setAmount(user?.walletBalance)} style={{ color: 'var(--accent)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>Withdraw All</button>
                    </div>
                    <input type="number" className="premium-input outfit" style={{ fontSize: '1.4rem', fontWeight: 800, padding: '18px' }} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" required />
                    <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, marginTop: 6, marginLeft: 2 }}>Minimum withdrawal: ₹100.00</p>
                </div>

                <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>Destination UPI ID</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Wallet size={18} /></span>
                        <input type="text" className="premium-input outfit" style={{ paddingLeft: 48, fontWeight: 700 }} value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="username@upi" required />
                    </div>
                </div>

                <div className="flex items-start gap-3" style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)' }}>
                    <AlertCircle size={16} style={{ color: '#f59e0b', marginTop: 2, flexShrink: 0 }} />
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 4 }}>Withdrawal Policy</p>
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Processing window: 10 AM - 6 PM. High-value withdrawals may require extra verification.</p>
                    </div>
                </div>

                <button type="submit" className="premium-btn" style={{ padding: '18px', width: '100%' }} disabled={loading}>
                    {loading ? 'Processing...' : 'Confirm Withdrawal'}
                </button>
            </form>
        </div>
    );
};

export default Withdraw;
