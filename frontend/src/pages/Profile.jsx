import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Phone, Shield, LogOut, ChevronRight, Settings, Bell, Lock, ExternalLink, Terminal, History as HistoryIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileItem = ({ icon: Icon, label, value, to, color }) => {
    const content = (
        <div className="flex items-center justify-between" style={{ padding: '16px 18px', borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: to ? 'pointer' : 'default', transition: 'background 0.2s' }}>
            <div className="flex items-center gap-4">
                <div style={{ padding: 10, borderRadius: 12, background: 'var(--bg-glass)', color: color || 'var(--text-muted)' }}>
                    <Icon size={18} />
                </div>
                <div>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: 2 }}>{value}</p>
                </div>
            </div>
            {to && <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
        </div>
    );
    return to ? <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link> : content;
};

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col" style={{ gap: 28, paddingBottom: 120 }}>
            <div>
                <p style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Account</p>
                <h1 className="outfit" style={{ fontSize: '1.8rem', fontWeight: 900 }}>Profile</h1>
            </div>

            {/* Profile Header Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card flex flex-col items-center text-center"
                style={{ padding: '36px 24px', position: 'relative', overflow: 'hidden' }}
            >
                <div style={{ position: 'relative', zIndex: 2, marginBottom: 16 }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(59,130,246,0.2)', padding: 3 }}>
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=EFF6FF&color=3B82F6&bold=true&size=128`}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            alt="avatar"
                        />
                    </div>
                    {user?.role === 'admin' && (
                        <div style={{ position: 'absolute', bottom: -2, right: -2, padding: 6, borderRadius: 10, background: 'var(--accent)', border: '3px solid var(--bg-main)' }}>
                            <Shield size={12} style={{ color: '#ffffff' }} />
                        </div>
                    )}
                </div>

                <h2 className="outfit" style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 6 }}>{user?.name?.toUpperCase()}</h2>
                <div className="glass-pill" style={{ border: '1px solid rgba(59,130,246,0.1)' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px rgba(59,130,246,0.5)' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)' }}>ACTIVE</span>
                </div>

                <div className="grid grid-cols-2 gap-3" style={{ width: '100%', marginTop: 20 }}>
                    <div style={{ padding: '14px', borderRadius: 16, background: 'rgba(0,0,0,0.03)' }}>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 2 }}>BALANCE</p>
                        <p className="outfit" style={{ fontSize: '1.05rem', fontWeight: 900 }}>₹{user?.walletBalance?.toLocaleString() || 0}</p>
                    </div>
                    <div style={{ padding: '14px', borderRadius: 16, background: 'rgba(0,0,0,0.03)' }}>
                        <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 2 }}>ID</p>
                        <p className="outfit" style={{ fontSize: '1.05rem', fontWeight: 900 }}>#{user?.mobile?.slice(-4)}</p>
                    </div>
                </div>

                {user?.role === 'admin' && (
                    <Link to="/admin" className="premium-btn" style={{ width: '100%', marginTop: 16, gap: 8, padding: '14px' }}>
                        <Terminal size={18} /> Admin Panel
                    </Link>
                )}

                <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent)', pointerEvents: 'none' }} />
            </motion.div>

            {/* Settings Sections */}
            <div className="glass-card" style={{ borderRadius: 22, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Credentials</h3>
                </div>
                <ProfileItem icon={Phone} label="Mobile" value={`+91 ${user?.mobile}`} color="var(--accent)" />
                <ProfileItem icon={Lock} label="Password" value="••••••••" color="var(--primary-blue)" to="/settings" />
                <ProfileItem icon={Shield} label="Role" value={user?.role?.toUpperCase()} color="#FACC15" />
            </div>

            <div className="glass-card" style={{ borderRadius: 22, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Preferences</h3>
                </div>
                <ProfileItem icon={HistoryIcon} label="Transactions" value="View Records" to="/history" color="var(--accent)" />
                <ProfileItem icon={Bell} label="Notifications" value="Active" color="var(--primary-blue)" />
                <ProfileItem icon={ExternalLink} label="Support" value="Telegram" color="var(--success)" to="/support" />
                <ProfileItem icon={Settings} label="Version" value="v2.4.0" />
            </div>

            {/* Logout */}
            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={logout}
                className="glass-card flex items-center justify-center gap-3"
                style={{ padding: '18px', borderRadius: 20, color: '#ef4444', fontWeight: 800, fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.1)' }}
            >
                <LogOut size={20} /> Logout
            </motion.button>
        </div>
    );
};

export default Profile;
