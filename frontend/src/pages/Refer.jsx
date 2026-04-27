import React from 'react';
import { motion } from 'framer-motion';
import { Users, Gift, Copy, Share2, CheckCircle2, Users2, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const StatsBox = ({ label, value, icon: Icon }) => (
    <div className="glass-card" style={{ flex: '1 1 0%', padding: '18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ padding: 10, borderRadius: 14, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.08)', width: 'fit-content', color: 'var(--accent)' }}>
            <Icon size={18} />
        </div>
        <div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</p>
            <h3 className="outfit" style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: 2 }}>{value}</h3>
        </div>
    </div>
);

const Refer = () => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(user?.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
        if (navigator.share) {
            navigator.share({ title: 'Join XEVON', text: `Join XEVON and start earning! Use my referral code: ${user?.referralCode}`, url: link });
        } else {
            navigator.clipboard.writeText(link);
            alert('Referral link copied!');
        }
    };

    return (
        <div className="flex flex-col" style={{ gap: 28, paddingBottom: 120 }}>
            <div>
                <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Referral Network</p>
                <h1 className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900 }}>Refer & Earn</h1>
            </div>

            {/* Hero Card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card text-center"
                style={{ padding: '36px 24px', background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(37,99,235,0.02))', position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="flex justify-center" style={{ marginBottom: 24 }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ padding: 24, borderRadius: '50%', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)' }}>
                                <Users2 size={48} style={{ color: 'var(--accent)' }} />
                            </div>
                            {/* Pulse ring */}
                            <motion.div
                                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(37,99,235,0.15)' }}
                            />
                        </div>
                    </div>

                    <h2 className="outfit" style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 8 }}>Earn 10% Commission</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6, maxWidth: '90%', margin: '0 auto 28px' }}>
                        Invite friends to XEVON and receive instant returns on all their investments.
                    </p>

                    <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, letterSpacing: '1.5px', marginBottom: 10 }}>YOUR REFERRAL CODE</p>
                    <div className="flex justify-between items-center" style={{ padding: '14px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(37,99,235,0.1)' }}>
                        <span className="outfit" style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: 2, color: 'var(--text-primary)' }}>{user?.referralCode}</span>
                        <button onClick={handleCopy} style={{ padding: 10, borderRadius: 12, background: copied ? 'var(--success)' : 'var(--accent)', color: '#ffffff', border: 'none', transition: 'all 0.25s' }}>
                            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                        </button>
                    </div>

                    <button onClick={handleShare} className="btn-outlined" style={{ width: '100%', marginTop: 16, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: 14 }}>
                        <Share2 size={18} /> Invite Friends
                    </button>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="flex gap-3">
                <StatsBox label="Referrals" value="0" icon={Users} />
                <StatsBox label="Active" value="0" icon={CheckCircle2} />
                <StatsBox label="Earned" value="₹0" icon={TrendingUp} />
            </div>

            {/* How it Works */}
            <div className="glass-card" style={{ padding: 24 }}>
                <h3 className="outfit" style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 24 }}>How It Works</h3>
                <div className="flex flex-col" style={{ gap: 24 }}>
                    {[
                        { icon: Copy, title: 'Share Code', desc: 'Copy and send your referral code to friends.' },
                        { icon: Gift, title: 'They Register', desc: 'Friends join XEVON using your unique code.' },
                        { icon: TrendingUp, title: 'Earn Rewards', desc: 'Receive 10% of their investment value instantly.' }
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div style={{ padding: 12, borderRadius: 14, background: 'rgba(37,99,235,0.06)', color: 'var(--accent)', flexShrink: 0 }}>
                                <step.icon size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{step.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Refer;
