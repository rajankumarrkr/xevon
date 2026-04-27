import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Layers, Plus, ArrowDownRight, ArrowUpRight, History, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
    <div className="glass-card" style={{ padding: '18px', flex: '1 1 0%', minWidth: 120 }}>
        <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
            <div style={{ padding: 8, borderRadius: 10, background: `${color}15`, color }}>
                <Icon size={16} />
            </div>
            {trend && (
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)' }}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </span>
            )}
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>{label}</p>
        <h3 className="outfit" style={{ fontSize: '1.15rem', fontWeight: 800 }}>{value || '0'}</h3>
    </div>
);

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <div style={{ width: 32, height: 32, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
            </div>
        );
    }

    const walletBalance = user?.walletBalance ?? 0;
    const totalEarning = user?.totalEarning ?? 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">

            {/* Hero Balance Card */}
            <div className="balance-shield" style={{ position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Total Balance</p>
                    <h2 className="outfit" style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: 4 }}>
                        ₹{walletBalance.toLocaleString()}
                    </h2>
                    <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
                        <TrendingUp size={14} style={{ color: 'var(--success)' }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>+₹{totalEarning.toLocaleString()}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Total Earnings</span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3">
                        <Link to="/deposit" className="premium-btn" style={{ flex: 1, padding: '14px 0', fontSize: '0.75rem', borderRadius: 14 }}>
                            <Plus size={18} /> Invest Now
                        </Link>
                        <Link to="/withdraw" className="btn-outlined" style={{ flex: 1, padding: '14px 0', fontSize: '0.75rem', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <ArrowDownRight size={18} /> Withdraw
                        </Link>
                    </div>
                </div>
                {/* Glow effect */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(circle, rgba(0,229,255,0.12), transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
            </div>

            {/* Stats Row */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide" style={{ paddingBottom: 4 }}>
                <StatCard label="Daily ROI" value={`${(8.5).toFixed(1)}%`} icon={Zap} color="var(--accent)" trend={12.5} />
                <StatCard label="Total Earned" value={`₹${totalEarning.toLocaleString()}`} icon={TrendingUp} color="var(--success)" />
                <StatCard label="Active Plans" value="3" icon={Layers} color="var(--primary-blue)" />
            </div>

            {/* Yield Programs */}
            <div>
                <div className="flex justify-between items-center" style={{ marginBottom: 14, padding: '0 2px' }}>
                    <h3 className="outfit" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)' }}>Investment Plans</h3>
                    <Link to="/plans" style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700 }}>View All</Link>
                </div>

                <div className="glass-card" style={{ padding: 20 }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                        <div className="flex items-center gap-3">
                            <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Zap size={20} style={{ color: 'var(--accent)' }} />
                            </div>
                            <div>
                                <h4 className="outfit" style={{ fontSize: '0.95rem', fontWeight: 700 }}>Growth Pool Alpha</h4>
                                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Daily 8% • Active</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="outfit" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>+₹120.00</p>
                            <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Today</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                        <div className="flex justify-between" style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Maturity</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>72%</span>
                        </div>
                        <div className="progress-bar">
                            <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1, ease: 'easeOut' }} className="progress-fill" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 className="outfit" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: 14, padding: '0 2px' }}>Recent Activity</h3>
                <div className="flex flex-col gap-3">
                    {[
                        { label: 'Profit Settled', time: 'Apr 26, 2026 • 04:30 PM', amount: '+₹42.00', type: 'success' },
                        { label: 'Daily Task Bonus', time: 'Apr 26, 2026 • 02:15 PM', amount: '+₹10.00', type: 'info' }
                    ].map((item, i) => (
                        <div key={i} className="glass-card" style={{ padding: '14px 18px' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div style={{
                                        width: 38, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: item.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
                                        color: item.type === 'success' ? 'var(--success)' : 'var(--text-muted)'
                                    }}>
                                        {item.type === 'success' ? <ArrowUpRight size={18} /> : <History size={18} />}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{item.label}</p>
                                        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{item.time}</p>
                                    </div>
                                </div>
                                <p className="outfit" style={{ fontSize: '0.8rem', fontWeight: 700, color: item.type === 'success' ? 'var(--success)' : 'var(--text-secondary)' }}>
                                    {item.amount}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
