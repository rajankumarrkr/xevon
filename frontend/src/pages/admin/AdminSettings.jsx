import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Smartphone, QrCode, Globe } from 'lucide-react';

const AdminSettings = () => {
    const [upiId, setUpiId] = useState('');
    const [qrFile, setQrFile] = useState(null);
    const [existingQr, setExistingQr] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/config');
            if (data.success) {
                setUpiId(data.data.upiId || '');
                setExistingQr(data.data.qrImage || '');
            }
        } catch (error) {
            console.error('Error fetching settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        
        const formData = new FormData();
        formData.append('upiId', upiId);
        if (qrFile) {
            formData.append('qr', qrFile);
        }

        try {
            const { data } = await api.put('/config', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (data.success) {
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
                fetchSettings();
                setQrFile(null);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh', gap: 16 }}>
            <RefreshCw className="animate-spin" size={40} style={{ color: 'var(--accent)' }} />
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '2px' }}>LOADING SYSTEM CONFIG...</p>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col" style={{ gap: 32 }}>
            <div className="flex justify-between items-end" style={{ flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 className="outfit" style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>App Settings</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Global system configuration</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 24 }}>
                {/* UPI & Payment Settings */}
                <div className="glass-card" style={{ padding: 28 }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
                        <div style={{ padding: 10, borderRadius: 12, background: 'rgba(37,99,235,0.06)', color: 'var(--accent)' }}>
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <h3 className="outfit" style={{ fontSize: '1.1rem', fontWeight: 800 }}>Payment Gateway</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Manage deposit methods</p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="flex flex-col gap-6">
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Primary UPI ID</label>
                            <input 
                                type="text" 
                                className="premium-input outfit" 
                                style={{ fontWeight: 700 }}
                                value={upiId} 
                                onChange={(e) => setUpiId(e.target.value)} 
                                placeholder="example@upi" 
                                required 
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Custom QR Scanner (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setQrFile(e.target.files[0])}
                                className="premium-input"
                                style={{ fontSize: '0.8rem' }}
                            />
                            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>Upload a custom QR image. If left empty, a QR will be auto-generated from the UPI ID.</p>
                        </div>

                        {message.text && (
                            <div style={{ 
                                padding: '12px 16px', 
                                borderRadius: 12, 
                                background: message.type === 'success' ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)',
                                border: `1px solid ${message.type === 'success' ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)'}`,
                                color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>
                                {message.text}
                            </div>
                        )}

                        <button type="submit" className="premium-btn" style={{ padding: '16px', width: '100%' }} disabled={saving}>
                            {saving ? 'Saving...' : (<><Save size={18} /> Update Configuration</>)}
                        </button>
                    </form>
                </div>

                {/* Preview Card */}
                <div className="flex flex-col gap-6">
                    <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(37,99,235,0.01))' }}>
                        <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
                            <QrCode size={18} style={{ color: 'var(--accent)' }} />
                            <h4 className="outfit" style={{ fontSize: '0.9rem', fontWeight: 800 }}>Scanner Preview</h4>
                        </div>
                        <div className="flex flex-col items-center justify-center" style={{ padding: 20, background: '#fff', borderRadius: 20, border: '1px solid rgba(37,99,235,0.08)' }}>
                            <img 
                                src={qrFile ? URL.createObjectURL(qrFile) : (existingQr && (existingQr.startsWith('http') || existingQr.startsWith('https'))) ? existingQr : existingQr ? `${api.defaults.baseURL.replace('/api', '')}/${existingQr}` : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=XEVON&cu=INR`)}`} 
                                alt="QR Preview" 
                                style={{ width: 140, height: 140, borderRadius: 8, filter: (upiId || qrFile || existingQr) ? 'none' : 'blur(4px)', objectFit: 'contain' }}
                            />
                            <p style={{ fontSize: 11, fontWeight: 700, marginTop: 12, color: upiId ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {qrFile ? 'New Image Selected' : existingQr ? 'Using Custom QR' : (upiId || 'No UPI ID Set')}
                            </p>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 24, border: '1px solid rgba(244,63,94,0.1)', background: 'rgba(244,63,94,0.02)' }}>
                        <div className="flex items-center gap-3">
                            <Globe size={18} style={{ color: 'var(--error)' }} />
                            <div>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Deployment Note</h4>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Custom QR images take precedence over auto-generated codes. Ensure the uploaded image is clear and scannable.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminSettings;
