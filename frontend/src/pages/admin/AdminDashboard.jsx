import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Wallet, ArrowDownCircle, ArrowUpCircle, RefreshCw, Plus } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminStat = ({ label, value, icon: Icon, color }) => (
    <motion.div whileHover={{ y: -4 }} className="glass-card" style={{ padding: 24 }}>
        <div className="flex justify-between items-start" style={{ marginBottom: 18 }}>
            <div style={{ padding: 12, borderRadius: 14, background: `${color}12`, color }}><Icon size={24} /></div>
            <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 20, background: 'rgba(0,0,0,0.04)' }}>LIVE</span>
        </div>
        <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.5px', marginBottom: 6 }}>{label}</p>
        <h2 className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{value}</h2>
    </motion.div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        setLoading(true);
        try { const { data } = await axios.get(`${API_URL}/admin/stats`); setStats(data.data); }
        catch (e) { console.error('Error fetching stats'); }
        finally { setLoading(false); }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh', gap: 16 }}>
            <RefreshCw className="animate-spin" size={40} style={{ color: 'var(--accent)' }} />
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '2px' }}>SYNCING DATA...</p>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col" style={{ gap: 32 }}>
            <div className="flex justify-between items-end" style={{ flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 className="outfit" style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>Analytics</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Platform overview</p>
                </div>
                <button onClick={fetchStats} className="glass-card flex items-center gap-2" style={{ padding: '10px 18px', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-primary)' }}>
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
                <AdminStat label="TOTAL USERS" value={stats.totalUsers} icon={Users} color="var(--accent)" />
                <AdminStat label="DEPOSITS" value={`₹${stats.totalDeposits.toLocaleString()}`} icon={ArrowDownCircle} color="var(--success)" />
                <AdminStat label="WITHDRAWALS" value={`₹${stats.totalWithdrawals.toLocaleString()}`} icon={ArrowUpCircle} color="var(--error)" />
                <AdminStat label="INVESTMENTS" value={`₹${stats.activeInvestments.toLocaleString()}`} icon={TrendingUp} color="#FACC15" />
                <AdminStat label="LIQUIDITY" value={`₹${stats.platformLiquidity.toLocaleString()}`} icon={Wallet} color="var(--primary-blue)" />
            </div>

            {/* Chart Area */}
            <div className="glass-card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
                    <div>
                        <h3 className="outfit" style={{ fontSize: '1.1rem', fontWeight: 800 }}>Capital Flow</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Monthly movement</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2" style={{ fontSize: 11, fontWeight: 700 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px #00E5FF' }} /> Inflow
                        </div>
                        <div className="flex items-center gap-2" style={{ fontSize: 11, fontWeight: 700 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} /> Profit
                        </div>
                    </div>
                </div>
                <div style={{ height: 200, width: '100%' }}>
                    <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0 170 Q 150 130, 300 150 T 500 70 T 750 100 T 1000 20 V 200 H 0 Z" fill="url(#cg)" />
                        <path d="M0 170 Q 150 130, 300 150 T 500 70 T 750 100 T 1000 20" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
