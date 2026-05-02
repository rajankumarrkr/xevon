import React, { useState, useEffect } from 'react';
import { planService, investmentService } from '../services';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlanCard = ({ plan, onPurchase, loading }) => {
    const getTierConfig = (amount) => {
        if (amount >= 10000) return { label: 'DIAMOND', color: '#F472B6', secondary: '#DB2777', glow: 'rgba(244,114,182,0.4)', icon: '💎', pattern: 'circle' };
        if (amount >= 5000) return { label: 'PLATINUM', color: '#FBBF24', secondary: '#D97706', glow: 'rgba(251,191,36,0.3)', icon: '👑', pattern: 'rect' };
        if (amount >= 2000) return { label: 'GOLD', color: '#A855F7', secondary: '#7C3AED', glow: 'rgba(168, 85, 247, 0.3)', icon: '⚡', pattern: 'triangle' };
        return { label: 'ELITE', color: '#3B82F6', secondary: '#2563EB', glow: 'rgba(59, 130, 246, 0.3)', icon: '🚀', pattern: 'plus' };
    };

    const tier = getTierConfig(plan.minAmount);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative group"
            style={{ marginBottom: 20 }}
        >
            {/* Animated Glow Border */}
            <div style={{
                position: 'absolute', inset: -1, borderRadius: 25,
                background: `linear-gradient(45deg, ${tier.color}, ${tier.secondary}, transparent, ${tier.color})`,
                backgroundSize: '200% 200%', animation: 'shimmer 3s linear infinite',
                opacity: 0.4, filter: 'blur(8px)', zIndex: 0
            }} className="group-hover:opacity-100 transition-opacity" />

            <div className="glass-card relative z-10" style={{ 
                overflow: 'hidden', 
                background: 'rgba(11, 15, 47, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 24,
                boxShadow: `0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px ${tier.glow}`
            }}>
                {/* Background Pattern SVG */}
                <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.05, pointerEvents: 'none' }}>
                    <svg width="200" height="200" viewBox="0 0 100 100">
                        <defs>
                            <pattern id={`pattern-${plan._id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill={tier.color} />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill={`url(#pattern-${plan._id})`} />
                    </svg>
                </div>

                <div style={{ padding: '32px 28px' }}>
                    <div className="flex justify-between items-start" style={{ marginBottom: 24 }}>
                        <div>
                            <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                                <motion.div 
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ width: 6, height: 6, borderRadius: '50%', background: tier.color, boxShadow: `0 0 10px ${tier.color}` }} 
                                />
                                <span style={{ fontSize: 10, color: tier.color, fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>{tier.label} PROTOCOL</span>
                            </div>
                            <h2 className="outfit" style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{plan.name}</h2>
                        </div>
                        <div style={{ 
                            width: 60, height: 60, borderRadius: 20, 
                            background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${tier.glow} 100%)`,
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.8rem',
                            boxShadow: `0 10px 20px rgba(0,0,0,0.3)`
                        }}>
                            {tier.icon}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6" style={{ marginBottom: 32 }}>
                        <div className="relative">
                            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 }}>Daily Profit</p>
                            <div className="flex items-baseline gap-1">
                                <span className="outfit" style={{ fontSize: '2.2rem', fontWeight: 900, background: `linear-gradient(to bottom, #fff, ${tier.color})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{plan.dailyPercent}%</span>
                            </div>
                            <div style={{ position: 'absolute', bottom: -8, left: 0, width: '40%', height: 2, background: tier.color, borderRadius: 10, boxShadow: `0 0 10px ${tier.color}` }} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 1 }}>Duration</p>
                            <div className="flex items-baseline justify-end gap-1">
                                <span className="outfit" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>{plan.durationDays}</span>
                                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)' }}>DAYS</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Mesh Section */}
                    <div style={{ 
                        padding: '20px', borderRadius: 20, 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.04)',
                        marginBottom: 32,
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Min Stake</span>
                                <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>₹{plan.minAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Max Capacity</span>
                                <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>₹{plan.maxAmount.toLocaleString()}</span>
                            </div>
                            <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }} className="flex justify-between items-center">
                                <span style={{ fontSize: 10, fontWeight: 900, color: tier.color, letterSpacing: 1 }}>TOTAL RETURN</span>
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} style={{ color: 'var(--success)' }} />
                                    <span className="outfit" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--success)' }}>{plan.dailyPercent * plan.durationDays}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${tier.glow}` }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onPurchase(plan)}
                        disabled={loading}
                        className="premium-btn"
                        style={{ 
                            width: '100%', 
                            padding: '20px', 
                            borderRadius: 18, 
                            fontSize: '0.9rem',
                            fontWeight: 900,
                            letterSpacing: '2px',
                            background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.secondary} 100%)`,
                            boxShadow: `0 10px 25px rgba(0,0,0,0.3)`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Shimmer Effect on Button */}
                        <motion.div 
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            style={{ position: 'absolute', top: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', skewX: '-20deg' }} 
                        />
                        <span style={{ position: 'relative', zIndex: 1 }}>
                            {loading ? 'INITIALIZING PROTOCOL...' : 'ACTIVATE NODE'}
                        </span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [loadingPlan, setLoadingPlan] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { data } = await planService.getAll();
                setPlans(data.data);
            } catch (err) { console.error('Error fetching plans'); }
            finally { setLoadingPlans(false); }
        };
        fetchPlans();
    }, []);

    const handlePurchase = async (plan) => {
        if (!user) return;
        if (user.walletBalance < plan.minAmount) {
            navigate('/deposit');
            return;
        }
        const amount = prompt(`Enter investment amount (₹${plan.minAmount} - ₹${plan.maxAmount}):`, plan.minAmount);
        if (!amount || isNaN(amount) || amount < plan.minAmount || amount > plan.maxAmount) { alert('Invalid amount.'); return; }
        setLoadingPlan(plan._id);
        try {
            await investmentService.invest(plan._id, Number(amount));
            alert('Investment successful!');
            window.location.reload();
        } catch (err) { alert(err.message || 'Transaction failed'); }
        finally { setLoadingPlan(null); }
    };

    if (loadingPlans) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <div style={{ width: 32, height: 32, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>High-Yield Markets</p>
                <h1 className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Investment Plans</h1>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>Diversify your portfolio with institutional-grade high-yield investment protocols.</p>
            </div>
            <div className="flex flex-col gap-5">
                {plans.length > 0 ? (
                    plans.map((plan) => (
                        <PlanCard key={plan._id} plan={plan} onPurchase={handlePurchase} loading={loadingPlan === plan._id} />
                    ))
                ) : (
                    <div className="glass-card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                        No active programs available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Plans;
