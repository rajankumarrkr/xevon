import React, { useState } from 'react';
import { transactionService } from '../services';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Building2, ArrowLeft, ShieldCheck, Clock, AlertCircle, Edit3, User as UserIcon, CreditCard, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Withdraw = () => {
    const { user, login } = useAuth(); // Assuming login or a similar func can update user context. Let's just reload page or use window.location.reload() for simplicity if context doesn't have an update method.
    const { toasts, removeToast, success: toastSuccess, error: toastError, ToastContainer } = useToast();
    
    // Withdrawal State
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Bank Account Form State
    const [bankForm, setBankForm] = useState({
        bankName: '',
        accountHolder: '',
        accountNumber: '',
        ifscCode: ''
    });
    const [bankLoading, setBankLoading] = useState(false);
    const [showBankForm, setShowBankForm] = useState(!user?.bankDetails?.accountNumber);

    const handleBankSubmit = async (e) => {
        e.preventDefault();
        setBankLoading(true);
        try {
            const { data } = await api.put('/auth/bank', bankForm);
            toastSuccess('Success', 'Bank details saved successfully!');
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            toastError('Failed', err.response?.data?.message || 'Failed to save bank details');
        } finally {
            setBankLoading(false);
        }
    };

    const handleWithdrawSubmit = async (e) => {
        e.preventDefault();
        if (amount > user.walletBalance) { toastError('Error', 'Insufficient balance.'); return; }
        setLoading(true);
        try {
            await transactionService.withdraw(amount);
            setSuccess(true);
        } catch (err) { toastError('Failed', err.response?.data?.message || 'Withdrawal failed'); }
        finally { setLoading(false); }
    };

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card flex flex-col items-center text-center" style={{ padding: 40, marginTop: 40, gap: 20 }}>
                <div style={{ padding: 20, borderRadius: '50%', background: 'rgba(37,99,235,0.08)' }}>
                    <Clock size={48} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                    <h2 className="outfit" style={{ fontSize: '1.5rem', fontWeight: 900 }}>Withdrawal Requested</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>₹{amount} will be transferred to your bank account within 24 hours.</p>
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
                <Link to="/" style={{ padding: 12, borderRadius: 14, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(37,99,235,0.08)', color: 'var(--text-secondary)', display: 'flex' }}>
                    <ArrowLeft size={20} />
                </Link>
            </div>

            {/* Balance Card */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 24 }}>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 10 }}>Available for Withdrawal</p>
                <div className="flex items-baseline gap-2" style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, opacity: 0.3 }}>₹</span>
                    <h2 className="outfit" style={{ fontSize: '2.2rem', fontWeight: 900 }}>
                        {user?.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)' }}>Encrypted Bank Payouts</span>
                </div>
            </motion.div>

            {showBankForm ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                        <div style={{ padding: 8, borderRadius: 10, background: 'rgba(37,99,235,0.1)', color: 'var(--accent)' }}><Building2 size={18} /></div>
                        <h3 className="outfit" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add Bank Account</h3>
                    </div>
                    <form onSubmit={handleBankSubmit} className="flex flex-col gap-4">
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginLeft: 2, marginBottom: 6, display: 'block' }}>Bank Name</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Building2 size={16} /></span>
                                <input type="text" className="premium-input" style={{ paddingLeft: 42 }} value={bankForm.bankName} onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })} placeholder="e.g. State Bank of India" required />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginLeft: 2, marginBottom: 6, display: 'block' }}>Account Holder Name</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><UserIcon size={16} /></span>
                                <input type="text" className="premium-input" style={{ paddingLeft: 42 }} value={bankForm.accountHolder} onChange={e => setBankForm({ ...bankForm, accountHolder: e.target.value })} placeholder="Name as per bank" required />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginLeft: 2, marginBottom: 6, display: 'block' }}>Account Number</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><CreditCard size={16} /></span>
                                <input type="number" className="premium-input" style={{ paddingLeft: 42 }} value={bankForm.accountNumber} onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })} placeholder="Account Number" required />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginLeft: 2, marginBottom: 6, display: 'block' }}>IFSC Code</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Hash size={16} /></span>
                                <input type="text" className="premium-input" style={{ paddingLeft: 42, textTransform: 'uppercase' }} value={bankForm.ifscCode} onChange={e => setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() })} placeholder="e.g. SBIN0001234" required />
                            </div>
                        </div>
                        
                        <div className="flex gap-3" style={{ marginTop: 8 }}>
                            {user?.bankDetails?.accountNumber && (
                                <button type="button" onClick={() => setShowBankForm(false)} className="premium-btn" style={{ flex: 1, padding: '16px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>Cancel</button>
                            )}
                            <button type="submit" className="premium-btn" style={{ flex: 2, padding: '16px' }} disabled={bankLoading}>
                                {bankLoading ? 'Saving...' : 'Save Bank Details'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col" style={{ gap: 24 }}>
                    {/* Saved Bank Details */}
                    <div className="glass-card flex justify-between items-center" style={{ padding: '16px 20px', border: '1px solid rgba(37,99,235,0.15)' }}>
                        <div className="flex items-center gap-3">
                            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(37,99,235,0.08)', color: 'var(--accent)' }}>
                                <Building2 size={20} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>{user.bankDetails.bankName}</p>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
                                    **** {user.bankDetails.accountNumber.slice(-4)}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowBankForm(true)} style={{ padding: 8, background: 'var(--bg-glass)', borderRadius: 8, border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <Edit3 size={16} />
                        </button>
                    </div>

                    <form onSubmit={handleWithdrawSubmit} className="flex flex-col" style={{ gap: 24 }}>
                        <div>
                            <div className="flex justify-between items-center" style={{ marginBottom: 8, padding: '0 2px' }}>
                                <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>Withdrawal Amount (₹)</label>
                                <button type="button" onClick={() => setAmount(user?.walletBalance)} style={{ color: 'var(--accent)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>Withdraw All</button>
                            </div>
                            <input type="number" className="premium-input outfit" style={{ fontSize: '1.4rem', fontWeight: 800, padding: '18px' }} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" required />
                            <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, marginTop: 6, marginLeft: 2 }}>Minimum withdrawal: ₹100.00</p>
                        </div>

                        <div className="flex items-start gap-3" style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.1)' }}>
                            <AlertCircle size={16} style={{ color: 'var(--warning)', marginTop: 2, flexShrink: 0 }} />
                            <div>
                                <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--warning)', textTransform: 'uppercase', marginBottom: 4 }}>Withdrawal Policy</p>
                                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Processing window: 10 AM - 6 PM. Amount will be credited to the saved bank account.</p>
                            </div>
                        </div>

                        <button type="submit" className="premium-btn" style={{ padding: '18px', width: '100%' }} disabled={loading}>
                            {loading ? 'Processing...' : 'Confirm Withdrawal'}
                        </button>
                    </form>
                </motion.div>
            )}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
};

export default Withdraw;
