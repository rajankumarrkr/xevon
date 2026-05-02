import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Layers, Plus, ArrowDownRight, ArrowUpRight, History, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon: Icon, color, trend, chartColor }) => (
    <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ padding: '20px', flex: '1 1 0%', minWidth: 110, position: 'relative', overflow: 'hidden' }}>
        <div className="flex justify-between items-start" style={{ marginBottom: 16 }}>
            <div style={{ padding: 10, borderRadius: 12, background: `${color}15`, color }}>
                <Icon size={18} />
            </div>
            {trend && (
                <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--success)', background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: 6 }}>
                    ↑{trend}%
                </span>
            )}
        </div>
        <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 4 }}>{label}</p>
        <h3 className="outfit" style={{ fontSize: '1.2rem', fontWeight: 900 }}>{value || '0'}</h3>
        
        {/* Mini Graph SVG */}
        <div style={{ marginTop: 12, height: 20, width: '100%' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 25 Q 25 10, 50 20 T 100 5" fill="none" stroke={chartColor || color} strokeWidth="2" strokeLinecap="round" />
            </svg>
        </div>
    </motion.div>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 pb-10">

            {/* Welcome Section */}
            <div style={{ marginTop: 8 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Welcome back,</p>
                <h1 className="outfit" style={{ fontSize: '1.6rem', fontWeight: 900 }}>{user?.name || 'Investor'}</h1>
            </div>

            {/* Main Balance Card */}
            <div className="glass-card" style={{ 
                padding: '32px', 
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(79, 70, 229, 0.05))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="relative z-10">
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Total Balance</p>
                    <h2 className="outfit" style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 6 }}>
                        ₹{walletBalance.toLocaleString()}
                    </h2>
                    <div className="flex items-center gap-2" style={{ marginBottom: 32 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>+₹{totalEarning.toLocaleString()}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Total Earnings</span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3">
                        <Link to="/plans" className="premium-btn" style={{ flex: 1.2, padding: '16px 0', fontSize: '0.75rem', borderRadius: 16 }}>
                            <Plus size={18} /> Invest Now
                        </Link>
                        <div className="flex flex-col gap-2 flex-1">
                            <Link to="/deposit" className="btn-outlined" style={{ 
                                padding: '12px 0', fontSize: '0.75rem', borderRadius: 14, 
                                border: '1px solid var(--accent)', background: 'rgba(124, 58, 237, 0.08)',
                                color: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 800 
                            }}>
                                <ArrowUpRight size={16} /> Deposit
                            </Link>
                            <Link to="/withdraw" className="btn-outlined" style={{ 
                                padding: '12px 0', fontSize: '0.75rem', borderRadius: 14, 
                                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 800 
                            }}>
                                <ArrowDownRight size={16} /> Withdraw
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Rupee Coin Decoration */}
                <div style={{ 
                    position: 'absolute', top: '15%', right: '8%', width: 100, height: 100, 
                    background: 'var(--primary-gradient)', borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)',
                    border: '4px solid rgba(255,255,255,0.1)'
                }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>₹</span>
                    {/* Glowing pedestal effect */}
                    <div style={{ position: 'absolute', bottom: -10, width: '120%', height: 20, background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.4), transparent 70%)', borderRadius: '50%' }} />
                </div>
                
                {/* Background Sparkles */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: 4, height: 4, background: '#fff', borderRadius: '50%', opacity: 0.3 }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '30%', width: 3, height: 3, background: '#fff', borderRadius: '50%', opacity: 0.2 }} />
            </div>

            {/* Stats Row */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide" style={{ paddingBottom: 4 }}>
                <StatCard label="Daily ROI" value={`${(8.5).toFixed(1)}%`} icon={Zap} color="var(--accent-light)" trend={12.5} chartColor="#A855F7" />
                <StatCard label="Total Earned" value={`₹${totalEarning.toLocaleString()}`} icon={TrendingUp} color="var(--success)" chartColor="#22C55E" />
                <StatCard label="Active Plans" value="3" icon={Layers} color="var(--accent-dark)" chartColor="#4F46E5" />
            </div>

            {/* Yield Programs */}
            <div>
                <div className="flex justify-between items-center" style={{ marginBottom: 18, padding: '0 4px' }}>
                    <h3 className="outfit" style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.6)' }}>Investment Plans</h3>
                    <Link to="/plans" style={{ color: 'var(--accent-light)', fontSize: '0.8rem', fontWeight: 700 }}>View All</Link>
                </div>

                <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.03)' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                        <div className="flex items-center gap-4">
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(124, 58, 237, 0.2)' }}>
                                <Zap size={24} style={{ color: '#fff' }} />
                            </div>
                            <div>
                                <h4 className="outfit" style={{ fontSize: '1rem', fontWeight: 800 }}>Growth Pool Alpha</h4>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Daily 8% • <span style={{ color: 'var(--success)' }}>Active</span></p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="outfit" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--success)' }}>+₹120.00</p>
                            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                        <div className="flex justify-between" style={{ marginBottom: 10 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Maturity</span>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>72%</span>
                        </div>
                        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: '72%' }} 
                                transition={{ duration: 1.5, ease: 'easeOut' }} 
                                style={{ height: '100%', background: 'var(--primary-gradient)', borderRadius: 10, boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)' }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 className="outfit" style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.6)', marginBottom: 18, padding: '0 4px' }}>Recent Activity</h3>
                <div className="flex flex-col gap-4">
                    {[
                        { label: 'Profit Settled', time: 'Apr 26, 2026 • 04:30 PM', amount: '+₹42.00', type: 'success' },
                        { label: 'Daily Task Bonus', time: 'Apr 26, 2026 • 02:15 PM', amount: '+₹10.00', type: 'info' }
                    ].map((item, i) => (
                        <div key={i} className="glass-card" style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: item.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(124, 58, 237, 0.08)',
                                        color: item.type === 'success' ? 'var(--success)' : 'var(--accent-light)'
                                    }}>
                                        {item.type === 'success' ? <TrendingUp size={20} /> : <History size={20} />}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.label}</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{item.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="outfit" style={{ fontSize: '0.95rem', fontWeight: 800, color: item.type === 'success' ? 'var(--success)' : 'var(--text-secondary)' }}>
                                        {item.amount}
                                    </p>
                                    <Link to="/history" style={{ color: 'var(--text-muted)' }}><ArrowDownRight size={16} style={{ transform: 'rotate(-135deg)', opacity: 0.5 }} /></Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
