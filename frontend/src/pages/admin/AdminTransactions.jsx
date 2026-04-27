import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ExternalLink, Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => { fetchTransactions(); }, []);

    const fetchTransactions = async () => {
        try { const { data } = await axios.get(`${API_URL}/transactions`); setTransactions(data.data); }
        catch (e) { console.error('Error fetching transactions'); }
        finally { setLoading(false); }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm(`Confirm ${status.toUpperCase()}?`)) return;
        try { await axios.put(`${API_URL}/transactions/${id}/status`, { status }); fetchTransactions(); }
        catch (e) { alert(e.response?.data?.message || 'Update failed'); }
    };

    const filtered = transactions.filter(tx => filter === 'all' ? true : tx.status === filter);

    if (loading) return <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}><div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} /></div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col" style={{ gap: 24 }}>
            <div>
                <h1 className="outfit" style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>Transactions</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Review capital movements</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: 4 }}>
                {['pending', 'approved', 'rejected', 'all'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 11, letterSpacing: '1px',
                        textTransform: 'uppercase', transition: 'all 0.2s', whiteSpace: 'nowrap', border: 'none',
                        background: filter === f ? 'var(--accent)' : 'var(--bg-glass)', color: filter === f ? '#0B1D3A' : 'var(--text-muted)'
                    }}>{f}</button>
                ))}
            </div>

            {/* Transaction Cards (mobile-friendly) */}
            <div className="flex flex-col gap-3">
                {filtered.map((tx) => (
                    <div key={tx._id} className="glass-card" style={{ padding: '18px 20px' }}>
                        <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
                            <div className="flex items-center gap-3">
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: tx.type === 'deposit' ? 'rgba(34,197,94,0.1)' : 'rgba(244,63,94,0.1)',
                                    color: tx.type === 'deposit' ? 'var(--success)' : 'var(--error)'
                                }}>
                                    {tx.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{tx.user?.name?.toUpperCase()}</p>
                                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>#{tx.user?.mobile}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p className="outfit" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>₹{tx.amount.toLocaleString()}</p>
                                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: tx.status === 'pending' ? '#FACC15' : tx.status === 'approved' ? 'var(--success)' : 'var(--error)' }}>{tx.status}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 10 }}>
                            <div className="flex items-center gap-2">
                                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: tx.type === 'deposit' ? 'var(--success)' : 'var(--error)' }}>{tx.type}</span>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>• {new Date(tx.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2">
                                {tx.type === 'deposit' && tx.proofImage && (
                                    <a href={tx.proofImage} target="_blank" rel="noreferrer" style={{ padding: 8, borderRadius: 10, background: 'var(--bg-glass)', border: '1px solid rgba(255,255,255,0.04)', color: 'var(--accent)', display: 'flex' }}>
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                                {tx.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleStatusUpdate(tx._id, 'approved')} style={{ padding: 8, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--success)' }}><CheckCircle size={14} /></button>
                                        <button onClick={() => handleStatusUpdate(tx._id, 'rejected')} style={{ padding: 8, borderRadius: 10, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--error)' }}><XCircle size={14} /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="glass-card text-center" style={{ padding: 48, color: 'var(--text-muted)', fontWeight: 600 }}>No records found</div>
                )}
            </div>
        </motion.div>
    );
};

export default AdminTransactions;
