import React, { useState } from 'react';
import { transactionService } from '../services';
import { motion } from 'framer-motion';
import { QrCode, UploadCloud, Info, ArrowLeft, CheckCircle2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Deposit = () => {
    const [amount, setAmount] = useState('');
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('xevon.prem@upi');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!proof) { alert('Please upload a payment screenshot.'); return; }
        setLoading(true);
        try {
            await transactionService.deposit(amount, proof);
            setSuccess(true);
        } catch (err) { alert(err.response?.data?.message || 'Deposit failed'); }
        finally { setLoading(false); }
    };

    if (success) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card flex flex-col items-center text-center" style={{ padding: 40, marginTop: 40, gap: 20 }}>
                <div style={{ padding: 20, borderRadius: '50%', background: 'rgba(37,99,235,0.08)' }}>
                    <CheckCircle2 size={48} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                    <h2 className="outfit" style={{ fontSize: '1.5rem', fontWeight: 900 }}>Deposit Submitted</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 8 }}>Your deposit of ₹{amount} is being processed. Funds will reflect within 30 minutes.</p>
                </div>
                <Link to="/" className="premium-btn" style={{ width: '100%', padding: '16px' }}>Return to Home</Link>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col" style={{ gap: 28, paddingBottom: 100 }}>
            <div className="flex justify-between items-center">
                <div>
                    <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Capital Account</p>
                    <h1 className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900 }}>Add Funds</h1>
                </div>
                <Link to="/" style={{ padding: 12, borderRadius: 14, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(37,99,235,0.08)', color: 'var(--text-secondary)', display: 'flex' }}>
                    <ArrowLeft size={20} />
                </Link>
            </div>

            {/* UPI Details */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 22 }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 18 }}>
                    <div className="flex items-center gap-3">
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <QrCode size={20} style={{ color: 'var(--accent)' }} />
                        </div>
                        <span className="outfit" style={{ fontWeight: 700, fontSize: '0.95rem' }}>UPI Transfer</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)' }} />
                        <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase' }}>Active</span>
                    </div>
                </div>

                <div className="flex justify-between items-center" style={{ padding: '16px 18px', borderRadius: 16, background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.06)' }}>
                    <div>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 2 }}>UPI ID</p>
                        <p className="outfit" style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.5px' }}>xevon.prem@upi</p>
                    </div>
                    <button onClick={handleCopy} style={{ padding: 10, borderRadius: 12, background: copied ? 'var(--accent)' : 'rgba(37,99,235,0.06)', color: copied ? '#ffffff' : 'var(--accent)', transition: 'all 0.25s', border: 'none' }}>
                        <Copy size={18} />
                    </button>
                </div>

                <div className="flex items-start gap-3" style={{ marginTop: 16, padding: '12px 14px', borderRadius: 12, background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.06)' }}>
                    <Info size={16} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Send the amount to the UPI ID above and upload the confirmation screenshot.
                    </p>
                </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 24 }}>
                <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>Deposit Amount (₹)</label>
                    <input type="number" className="premium-input outfit" style={{ fontSize: '1.4rem', fontWeight: 800, padding: '18px' }} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5,000" required />
                </div>

                <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 8, marginLeft: 2 }}>Payment Screenshot</label>
                    <input type="file" id="file-upload" style={{ display: 'none' }} accept="image/*" onChange={(e) => setProof(e.target.files[0])} />
                    <label htmlFor="file-upload" className="glass-card flex flex-col items-center justify-center" style={{ padding: '36px 20px', cursor: 'pointer', borderStyle: 'dashed', borderWidth: 2, borderColor: proof ? 'rgba(37,99,235,0.25)' : 'rgba(37,99,235,0.08)', background: proof ? 'rgba(37,99,235,0.03)' : 'var(--bg-card)' }}>
                        <UploadCloud size={28} style={{ color: proof ? 'var(--accent)' : 'var(--text-muted)' }} />
                        <p className="outfit" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 10 }}>{proof ? proof.name : 'Choose File'}</p>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>JPEG, PNG (MAX 5MB)</span>
                    </label>
                </div>

                <button type="submit" className="premium-btn" style={{ padding: '18px', width: '100%' }} disabled={loading}>
                    {loading ? 'Processing...' : 'Confirm Deposit'}
                </button>
            </form>
        </div>
    );
};

export default Deposit;
