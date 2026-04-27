import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Zap, Shield, Crown, Save, X, Layers, Activity } from 'lucide-react';

const AdminPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({ name: '', minAmount: '', maxAmount: '', dailyPercent: '', durationDays: '', isActive: true });

    useEffect(() => { fetchPlans(); }, []);

    const fetchPlans = async () => {
        try { const { data } = await api.get('/plans'); setPlans(data.data); }
        catch (e) { console.error('Error'); }
        finally { setLoading(false); }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan._id);
        setFormData({ name: plan.name, minAmount: plan.minAmount, maxAmount: plan.maxAmount, dailyPercent: plan.dailyPercent, durationDays: plan.durationDays, isActive: plan.isActive });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingPlan && editingPlan !== 'new') await api.put(`/plans/${editingPlan}`, formData);
            else await api.post('/plans', formData);
            setEditingPlan(null); setFormData({ name: '', minAmount: '', maxAmount: '', dailyPercent: '', durationDays: '', isActive: true }); fetchPlans();
        } catch (e) { alert('Operation failed'); }
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
                                    <button style={{ padding: 8, borderRadius: 10, background: 'var(--bg-glass)', border: '1px solid rgba(0,0,0,0.04)', color: 'var(--error)' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor */}
                <AnimatePresence>
                    {editingPlan && (
                        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="glass-card" style={{ padding: 28, border: '1px solid rgba(59,130,246,0.1)' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
                                <div className="flex items-center gap-3">
                                    <Layers style={{ color: 'var(--accent)' }} size={20} />
                                    <h3 className="outfit" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{editingPlan === 'new' ? 'New Plan' : 'Edit Plan'}</h3>
                                </div>
                                <button onClick={() => setEditingPlan(null)} style={{ padding: 6, borderRadius: 8, background: 'var(--bg-glass)', color: 'var(--text-muted)', border: 'none' }}><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSave} className="flex flex-col gap-5">
                                <div>
                                    <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Plan Name</label>
                                    <input className="premium-input" style={{ fontWeight: 700 }} placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>MIN (₹)</label>
                                        <input type="number" className="premium-input" style={{ fontWeight: 700 }} value={formData.minAmount} onChange={(e) => setFormData({...formData, minAmount: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>MAX (₹)</label>
                                        <input type="number" className="premium-input" style={{ fontWeight: 700 }} value={formData.maxAmount} onChange={(e) => setFormData({...formData, maxAmount: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>YIELD (%)</label>
                                        <input type="number" step="0.1" className="premium-input" style={{ fontWeight: 800, color: 'var(--accent)' }} value={formData.dailyPercent} onChange={(e) => setFormData({...formData, dailyPercent: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', display: 'block', marginBottom: 8 }}>DAYS</label>
                                        <input type="number" className="premium-input" style={{ fontWeight: 700 }} value={formData.durationDays} onChange={(e) => setFormData({...formData, durationDays: e.target.value})} required />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center" style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(0,0,0,0.03)' }}>
                                    <div className="flex items-center gap-3">
                                        <Activity size={16} style={{ color: 'var(--accent)' }} />
                                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</span>
                                    </div>
                                    <div onClick={() => setFormData({...formData, isActive: !formData.isActive})} style={{
                                        width: 48, height: 26, borderRadius: 20, padding: 3, cursor: 'pointer', transition: 'all 0.25s',
                                        background: formData.isActive ? 'var(--accent)' : 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.1)'
                                    }}>
                                        <motion.div animate={{ x: formData.isActive ? 22 : 0 }} style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
                                    </div>
                                </div>
                                <button type="submit" className="premium-btn" style={{ padding: '16px', width: '100%' }}><Save size={18} /> Save</button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AdminPlans;
