import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, ShieldOff, Search, AlertTriangle, Phone, Calendar, Coins, X, Save } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [adjustment, setAdjustment] = useState({ amount: '', description: '' });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try { const { data } = await axios.get(`${API_URL}/admin/users`); setUsers(data.data); }
        catch (e) { console.error('Error'); }
        finally { setLoading(false); }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        if (!window.confirm(`${newStatus.toUpperCase()} this user?`)) return;
        try { await axios.put(`${API_URL}/admin/users/${id}/status`, { status: newStatus }); fetchUsers(); }
        catch (e) { alert('Failed'); }
    };

    const handleBalanceAdjust = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/admin/users/${selectedUser._id}/balance`, adjustment);
            alert('Balance updated!');
            setSelectedUser(null); setAdjustment({ amount: '', description: '' }); fetchUsers();
        } catch (e) { alert('Failed'); }
    };

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.mobile.includes(search));

    if (loading) return <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}><div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} /></div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col" style={{ gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 className="outfit" style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>Users</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage user accounts</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Search users..." className="premium-input" style={{ paddingLeft: 40, width: 240, fontSize: '0.8rem' }} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {filtered.map((u) => (
                    <div key={u._id} className="glass-card" style={{ padding: '18px 20px', borderLeft: `3px solid ${u.status === 'active' ? 'var(--accent)' : 'var(--error)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                            <div className="flex items-center gap-3">
                                <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-glass)', color: 'var(--accent)' }}>
                                    <User size={22} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>{u.name.toUpperCase()}</h3>
                                    <div className="flex items-center gap-3" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                                        <span className="flex items-center gap-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}><Phone size={12} /> {u.mobile}</span>
                                        <span className="flex items-center gap-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}><Calendar size={12} /> {new Date(u.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 2 }}>BALANCE</p>
                                    <p className="outfit" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent)' }}>₹{u.walletBalance.toLocaleString()}</p>
                                </div>
                                <button onClick={() => setSelectedUser(u)} style={{ padding: 10, borderRadius: 12, background: 'var(--bg-glass)', border: '1px solid rgba(255,255,255,0.04)', color: 'var(--accent)' }}><Coins size={18} /></button>
                                <button onClick={() => handleToggleStatus(u._id, u.status)} style={{ padding: 10, borderRadius: 12, background: 'var(--bg-glass)', border: `1px solid ${u.status === 'active' ? 'rgba(255,255,255,0.04)' : 'rgba(244,63,94,0.2)'}`, color: u.status === 'active' ? 'var(--text-muted)' : 'var(--error)' }}>
                                    {u.status === 'active' ? <Shield size={18} /> : <ShieldOff size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Balance Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(6,11,24,0.92)', backdropFilter: 'blur(12px)' }}>
                        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} className="glass-card" style={{ padding: 32, width: '100%', maxWidth: 420, position: 'relative' }}>
                            <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: 20, right: 20, color: 'var(--text-muted)', background: 'none', border: 'none' }}><X size={22} /></button>
                            <div className="text-center" style={{ marginBottom: 28 }}>
                                <h3 className="outfit" style={{ fontSize: '1.4rem', fontWeight: 900 }}>Adjust Balance</h3>
                                <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8, fontWeight: 600 }}>{selectedUser.name.toUpperCase()}</p>
                            </div>
                            <form onSubmit={handleBalanceAdjust} className="flex flex-col gap-5">
                                <div>
                                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Amount (₹)</label>
                                    <input type="number" className="premium-input outfit" style={{ fontSize: '1.4rem', fontWeight: 800 }} placeholder="+/- amount" value={adjustment.amount} onChange={(e) => setAdjustment({...adjustment, amount: e.target.value})} required />
                                </div>
                                <div>
                                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Reason</label>
                                    <input type="text" className="premium-input" placeholder="Description" value={adjustment.description} onChange={(e) => setAdjustment({...adjustment, description: e.target.value})} required />
                                </div>
                                <div className="flex items-start gap-3" style={{ padding: 14, borderRadius: 12, background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)' }}>
                                    <AlertTriangle size={16} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
                                    <p style={{ fontSize: 11, color: 'var(--error)', lineHeight: 1.4, fontWeight: 600 }}>This modification is permanent and logged.</p>
                                </div>
                                <button type="submit" className="premium-btn" style={{ padding: '16px', width: '100%' }}><Save size={18} /> Confirm</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminUsers;
