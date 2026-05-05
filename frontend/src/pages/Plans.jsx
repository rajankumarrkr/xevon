import React, { useState, useEffect } from 'react';
import { planService, investmentService } from '../services';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

const PlanCard = ({ plan, onPurchase, loading }) => {
    const getTierConfig = (amount) => {
        if (amount >= 10000) return { label: 'DIAMOND', color: '#F472B6', secondary: '#DB2777', glow: 'rgba(244,114,182,0.4)', icon: '💎', pattern: 'circle' };
        if (amount >= 5000) return { label: 'PLATINUM', color: '#FBBF24', secondary: '#D97706', glow: 'rgba(251,191,36,0.3)', icon: '👑', pattern: 'rect' };
        if (amount >= 2000) return { label: 'GOLD', color: '#A855F7', secondary: '#7C3AED', glow: 'rgba(168, 85, 247, 0.3)', icon: '⚡', pattern: 'triangle' };
        return { label: 'ELITE', color: '#3B82F6', secondary: '#2563EB', glow: 'rgba(59, 130, 246, 0.3)', icon: '🚀', pattern: 'plus' };
    };

    const tier = getTierConfig(plan.minAmount);
    
    // Transformation Layer: Mapping Admin Data to User Display Format
    const dailyEarning = plan.dailyEarning || (plan.minAmount * plan.dailyPercent / 100);
    const totalReturn = dailyEarning * plan.durationDays;
    const totalProfit = totalReturn - plan.minAmount;
    const tierNumber = plan.minAmount >= 10000 ? '4' : plan.minAmount >= 5000 ? '3' : plan.minAmount >= 2000 ? '2' : '1';

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
                        <div className="flex items-center gap-4">
                            <div style={{ 
                                width: 50, height: 50, borderRadius: 16, 
                                background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${tier.glow} 100%)`,
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.4rem',
                                boxShadow: `0 10px 20px rgba(0,0,0,0.3)`
                            }}>
                                {tier.icon}
                            </div>
                            <div>
                                <h2 className="outfit" style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 2 }}>{plan.name}</h2>
                                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>TIER {tierNumber} - {tier.label}</p>
                            </div>
                        </div>
                        <div style={{ 
                            padding: '8px 12px', borderRadius: 12, 
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 800, letterSpacing: 0.5, marginBottom: 2 }}>DAILY ROI</p>
                            <p className="outfit" style={{ fontSize: '1.1rem', fontWeight: 900, color: tier.color }}>{plan.dailyPercent}%</p>
                        </div>
                    </div>

                    <div style={{ 
                        padding: '18px 20px', borderRadius: 20, 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        marginBottom: 20,
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>INVEST</p>
                                <p className="outfit" style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>₹{plan.minAmount.toLocaleString()}</p>
                            </div>
                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: 16 }}>
                                <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>DAILY</p>
                                <p className="outfit" style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>₹{Math.floor(dailyEarning).toLocaleString()}</p>
                            </div>
                            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: 16 }}>
                                <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>TOTAL</p>
                                <p className="outfit" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--success)' }}>₹{Math.floor(totalReturn).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center" style={{ marginBottom: 24, padding: '0 4px' }}>
                        <div className="flex items-center gap-2">
                            <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{plan.durationDays} DAYS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={12} style={{ color: 'var(--success)' }} />
                            <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>₹{Math.floor(totalProfit).toLocaleString()} PROFIT</span>
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
                            {loading ? 'ACTIVATING...' : 'ACTIVATE PLAN'}
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
    const toast = useToast();

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
        
        const minAmt = Number(plan.minAmount);
        const maxAmt = Number(plan.maxAmount) || minAmt;

        if (user.walletBalance < minAmt) {
            toast.warning('Insufficient Balance', `You need at least ₹${minAmt.toLocaleString()} to activate this plan. Current balance: ₹${user.walletBalance.toLocaleString()}`);
            setTimeout(() => navigate('/deposit'), 2000);
            return;
        }

        // Use minAmount directly (no prompt needed for fixed-amount plans)
        const amount = minAmt;

        setLoadingPlan(plan._id);
        try {
            await investmentService.invest(plan._id, amount);
            toast.success('Plan Activated!', `₹${amount.toLocaleString()} invested in ${plan.name}. Daily earnings start now!`);
            setTimeout(() => window.location.reload(), 2500);
        } catch (err) { 
            const msg = err.response?.data?.message || err.message || 'Transaction failed';
            toast.error('Activation Failed', msg);
        }
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
            <toast.ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
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
