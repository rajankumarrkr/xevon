import React, { useState, useEffect } from 'react';
import { planService, investmentService } from '../services';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Zap, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlanCard = ({ plan, onPurchase, loading }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ overflow: 'hidden' }}
    >
        <div style={{ padding: '24px 22px' }}>
            <div className="flex justify-between items-start" style={{ marginBottom: 18 }}>
                <div>
                    <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4 }}>Growth Program</p>
                    <h2 className="outfit" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{plan.name}</h2>
                </div>
                <div style={{ padding: 12, borderRadius: 14, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.1)' }}>
                    <Zap size={22} style={{ color: 'var(--accent)' }} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 18 }}>
                <div style={{ padding: '14px', borderRadius: 14, background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.06)' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>Daily Yield</p>
                    <p className="outfit" style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--success)' }}>{plan.dailyPercent}%</p>
                </div>
                <div style={{ padding: '14px', borderRadius: 14, background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.06)' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>Duration</p>
                    <p className="outfit" style={{ fontSize: '1.2rem', fontWeight: 900 }}>{plan.durationDays}D</p>
                </div>
            </div>

            <div style={{ marginBottom: 20 }}>
                <div className="flex justify-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Min Capital</span>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>₹{plan.minAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Max Limit</span>
                    <span style={{ fontSize: 11, fontWeight: 700 }}>₹{plan.maxAmount.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(37,99,235,0.06)', paddingTop: 10 }}>
                    <div className="flex justify-between items-center">
                        <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase' }}>Est. Return</span>
                        <span className="outfit" style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--success)' }}>₹{(plan.minAmount * plan.dailyPercent / 100).toLocaleString()}/Day</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onPurchase(plan)}
                disabled={loading}
                className="premium-btn"
                style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: '0.75rem' }}
            >
                {loading ? 'Processing...' : 'Start Program'}
            </button>
        </div>
    </motion.div>
);

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
                <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Asset Markets</p>
                <h1 className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Investment Plans</h1>
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
