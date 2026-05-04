import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Zap, Shield, Crown, Save, X, Layers, Activity } from 'lucide-react';

const AdminPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({ name: '', minAmount: '', maxAmount: 1000000, dailyPercent: 0, dailyEarning: '', durationDays: 120, tier: 'Standard', isActive: true });

    useEffect(() => { fetchPlans(); }, []);

    const fetchPlans = async () => {
        try { const { data } = await api.get('/plans'); setPlans(data.data); }
        catch (e) { console.error('Error'); }
        finally { setLoading(false); }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan._id);
        setFormData({ 
            name: plan.name, 
            minAmount: plan.minAmount, 
            maxAmount: plan.maxAmount || 1000000, 
            dailyPercent: plan.dailyPercent, 
            dailyEarning: plan.dailyEarning || (plan.minAmount * plan.dailyPercent / 100),
            durationDays: plan.durationDays || 120, 
            tier: plan.tier || 'Standard',
            isActive: plan.isActive 
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const invest = Number(formData.minAmount);
            const daily = Number(formData.dailyEarning);
            
            if (invest <= 0) return alert('Investment must be greater than 0');

            // Calculate dailyPercent
            const calculatedPercent = (daily / invest) * 100;
            
            const dataToSave = { 
                ...formData, 
                minAmount: invest,
                dailyEarning: daily,
                dailyPercent: Number(calculatedPercent.toFixed(2)) 
            };

            if (editingPlan && editingPlan !== 'new') {
                await api.put(`/plans/${editingPlan}`, dataToSave);
            } else {
                await api.post('/plans', dataToSave);
            }
            
            setEditingPlan(null); 
            setFormData({ name: '', minAmount: '', maxAmount: 1000000, dailyPercent: 0, dailyEarning: '', durationDays: 120, tier: 'Standard', isActive: true }); 
            fetchPlans();
            alert('Plan saved successfully!');
        } catch (e) { 
            console.error('Operation Error:', e);
            alert(e.response?.data?.message || e.message || 'Operation failed'); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                await api.delete(`/plans/${id}`);
                fetchPlans();
            } catch (e) { alert('Delete failed'); }
        }
    };

    if (loading) return <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}><div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} /></div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col" style={{ gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 className="outfit" style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>Plans</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Configure investment plans</p>
                </div>
                <button onClick={() => { setEditingPlan('new'); setFormData({ name: '', minAmount: '', maxAmount: '', dailyPercent: '', durationDays: '', isActive: true }); }} className="premium-btn" style={{ padding: '12px 24px', gap: 8 }}>
                    <Plus size={18} /> New Plan
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="lg:grid-cols-2">
                {/* Plan List */}
                <div className="flex flex-col gap-3">
                    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0 2px' }}>Active Plans</p>
                    {plans.map((plan) => (
                        <div key={plan._id} className="glass-card" style={{ padding: '18px 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="flex items-center gap-3">
                                    <div style={{ padding: 12, borderRadius: 14, background: 'var(--bg-glass)', color: 'var(--accent)' }}>
                                        {plan.name.includes('VIP') ? <Crown size={20} /> : plan.name.includes('GOLD') ? <Shield size={20} /> : <Zap size={20} />}
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>{plan.name.toUpperCase()}</h4>
                                        <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)' }}>{plan.dailyPercent}% Daily</span>
                                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>• {plan.durationDays} Days</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(plan)} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-glass)', border: '1px solid rgba(0,0,0,0.04)', color: 'var(--accent)' }}><Edit3 size={16} /></button>
                                    <button onClick={() => handleDelete(plan._id)} style={{ padding: 8, borderRadius: 10, background: 'var(--bg-glass)', border: '1px solid rgba(0,0,0,0.04)', color: 'var(--error)' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor */}
                <AnimatePresence>
                    {editingPlan && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} 
                            style={{ 
                                padding: '32px', 
                                background: '#F8FAFC', 
                                borderRadius: 24, 
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <div className="flex justify-between items-center" style={{ marginBottom: 28 }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: '#2563EB', fontSize: '1.4rem' }}>+</span> Create New Plan
                                </h3>
                                <button onClick={() => setEditingPlan(null)} style={{ padding: 6, borderRadius: 8, color: '#64748B' }}><X size={18} /></button>
                            </div>
                            
                            <form onSubmit={handleSave} className="flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 10 }}>Plan Name</label>
                                        <input 
                                            className="w-full" 
                                            style={{ 
                                                padding: '16px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, 
                                                fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', outline: 'none'
                                            }} 
                                            placeholder="Plan 5000" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 10 }}>Investment (₹)</label>
                                        <input 
                                            type="number"
                                            className="w-full" 
                                            style={{ 
                                                padding: '16px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, 
                                                fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', outline: 'none'
                                            }} 
                                            placeholder="5000" 
                                            value={formData.minAmount} 
                                            onChange={(e) => setFormData({...formData, minAmount: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 10 }}>Daily Return (₹)</label>
                                        <input 
                                            type="number"
                                            className="w-full" 
                                            style={{ 
                                                padding: '16px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, 
                                                fontSize: '0.95rem', fontWeight: 600, color: '#1E293B', outline: 'none'
                                            }} 
                                            placeholder="800" 
                                            value={formData.dailyEarning} 
                                            onChange={(e) => setFormData({...formData, dailyEarning: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 10 }}>Tier</label>
                                        <div style={{ position: 'relative' }}>
                                            <select 
                                                className="w-full appearance-none" 
                                                style={{ 
                                                    padding: '16px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, 
                                                    fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', outline: 'none', cursor: 'pointer'
                                                }} 
                                                value={formData.tier} 
                                                onChange={(e) => setFormData({...formData, tier: e.target.value})}
                                            >
                                                <option value="Standard">⭐ Standard</option>
                                                <option value="Premium">🔥 Premium</option>
                                                <option value="VIP">👑 VIP</option>
                                            </select>
                                            <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#1E293B' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 8 }}>
                                    <button 
                                        type="submit" 
                                        style={{ 
                                            padding: '16px 40px', background: '#2563EB', color: '#fff', borderRadius: 16, 
                                            fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10,
                                            boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>+</span> Add
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AdminPlans;
