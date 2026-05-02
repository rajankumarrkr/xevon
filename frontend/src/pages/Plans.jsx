import React, { useState, useEffect } from 'react';
import { planService, investmentService } from '../services';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlanCard = ({ plan, onPurchase, loading }) => {
    // Determine tier color based on amount
    const getTierConfig = (amount) => {
        if (amount >= 10000) return { label: 'DIAMOND TIER', color: '#F472B6', bg: 'rgba(244,114,182,0.1)', icon: '💎' };
        if (amount >= 5000) return { label: 'GOLD TIER', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)', icon: '👑' };
        if (amount >= 2000) return { label: 'SILVER TIER', color: '#94A3B8', bg: 'rgba(148,163,184,0.1)', icon: '⚡' };
        return { label: 'BRONZE TIER', color: '#B45309', bg: 'rgba(180,83,9,0.1)', icon: '🚀' };
    };

    const tier = getTierConfig(plan.minAmount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="glass-card group"
            style={{ 
                overflow: 'hidden', 
                borderLeft: `4px solid ${tier.color}`,
                background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${tier.bg} 100%)`
            }}
        >
            <div style={{ padding: '28px 24px' }}>
                <div className="flex justify-between items-start" style={{ marginBottom: 20 }}>
                    <div>
                        <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 9, color: tier.color, fontWeight: 900, letterSpacing: '1.5px', background: tier.bg, padding: '2px 8px', borderRadius: 6 }}>{tier.label}</span>
                            <span style={{ fontSize: 9, color: 'var(--success)', fontWeight: 900, letterSpacing: '1.5px', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: 6 }}>HOT</span>
                        </div>
                        <h2 className="outfit" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{plan.name}</h2>
                    </div>
                    <div style={{ 
                        width: 54, height: 54, borderRadius: 18, 
                        background: 'rgba(255,255,255,0.03)', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                    }}>
                        {tier.icon}
                    </div>
                </div>

                <div className="flex gap-4" style={{ marginBottom: 24 }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Daily Interest</p>
                        <div className="flex items-baseline gap-1">
                            <span className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--success)' }}>{plan.dailyPercent}%</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)', opacity: 0.8 }}>/DAY</span>
                        </div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                        <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Contract Term</p>
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{plan.durationDays}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>DAYS</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3" style={{ marginBottom: 28, padding: '16px', borderRadius: 16, background: 'rgba(0,0,0,0.15)' }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: tier.color }} />
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Minimum Entry</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>₹{plan.minAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: tier.color }} />
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Maximum Capacity</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>₹{plan.maxAmount.toLocaleString()}</span>
                    </div>
                    <div style={{ marginTop: 4, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }} className="flex justify-between items-center">
                        <span style={{ fontSize: 10, fontWeight: 800, color: tier.color }}>TOTAL PROJECTED ROI</span>
                        <span className="outfit" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--success)' }}>{plan.dailyPercent * plan.durationDays}%</span>
                    </div>
                </div>

                <button
                    onClick={() => onPurchase(plan)}
                    disabled={loading}
                    className="premium-btn"
                    style={{ 
                        width: '100%', 
                        padding: '18px', 
                        borderRadius: 16, 
                        fontSize: '0.85rem',
                        background: tier.color !== '#94A3B8' ? `linear-gradient(135deg, ${tier.color} 0%, var(--accent) 100%)` : 'var(--primary-gradient)',
                        boxShadow: `0 8px 32px ${tier.bg}`
                    }}
                >
                    {loading ? 'Processing Protocol...' : 'Activate Investment Plan'}
                </button>
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
