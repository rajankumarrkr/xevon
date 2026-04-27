import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Clock, CheckCircle, XCircle, Filter, RefreshCw, Inbox } from 'lucide-react';
import { transactionService } from '../services';

const statusConfig = {
    pending: { label: 'Pending', color: 'var(--warning)', bg: 'rgba(217,119,6,0.1)', icon: Clock },
    approved: { label: 'Approved', color: 'var(--success)', bg: 'rgba(22,163,74,0.1)', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'var(--error)', bg: 'rgba(225,29,72,0.1)', icon: XCircle },
};

const typeConfig = {
    deposit: { label: 'Deposit', color: 'var(--success)', icon: ArrowDownRight },
    withdraw: { label: 'Withdraw', color: 'var(--error)', icon: ArrowUpRight },
};

const tabs = [
    { key: 'all', label: 'All' },
    { key: 'deposit', label: 'Deposits' },
    { key: 'withdraw', label: 'Withdrawals' },
];

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [refreshing, setRefreshing] = useState(false);

    const fetchTransactions = async (showRefresh = false) => {
        try {
            if (showRefresh) setRefreshing(true);
            else setLoading(true);
            const { data } = await transactionService.getMine();
            setTransactions(data.data || []);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const filtered = activeTab === 'all'
        ? transactions
        : transactions.filter(t => t.type === activeTab);

    // Summary stats
    const totalDeposits = transactions
        .filter(t => t.type === 'deposit' && t.status === 'approved')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = transactions
        .filter(t => t.type === 'withdraw' && t.status === 'approved')
        .reduce((sum, t) => sum + t.amount, 0);
    const pendingCount = transactions.filter(t => t.status === 'pending').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <div style={{ width: 32, height: 32, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">

            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="outfit" style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.5px' }}>History</h2>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>Your transaction records</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fetchTransactions(true)}
                    disabled={refreshing}
                    style={{
                        width: 40, height: 40, borderRadius: 14,
                        background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <RefreshCw size={16} style={{ color: 'var(--text-muted)' }} className={refreshing ? 'animate-spin' : ''} />
                </motion.button>
            </div>

            {/* Summary Cards */}
            <div className="flex gap-3">
                <div className="glass-card flex-1" style={{ padding: '16px' }}>
                    <div style={{ padding: 6, borderRadius: 8, background: 'rgba(22,163,74,0.1)', width: 'fit-content', marginBottom: 8 }}>
                        <ArrowDownRight size={14} style={{ color: 'var(--success)' }} />
                    </div>
                    <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>Deposited</p>
                    <p className="outfit" style={{ fontSize: '1rem', fontWeight: 800 }}>₹{totalDeposits.toLocaleString()}</p>
                </div>
                <div className="glass-card flex-1" style={{ padding: '16px' }}>
                    <div style={{ padding: 6, borderRadius: 8, background: 'rgba(225,29,72,0.1)', width: 'fit-content', marginBottom: 8 }}>
                        <ArrowUpRight size={14} style={{ color: 'var(--error)' }} />
                    </div>
                    <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>Withdrawn</p>
                    <p className="outfit" style={{ fontSize: '1rem', fontWeight: 800 }}>₹{totalWithdrawals.toLocaleString()}</p>
                </div>
                <div className="glass-card flex-1" style={{ padding: '16px' }}>
                    <div style={{ padding: 6, borderRadius: 8, background: 'rgba(217,119,6,0.1)', width: 'fit-content', marginBottom: 8 }}>
                        <Clock size={14} style={{ color: 'var(--warning)' }} />
                    </div>
                    <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>Pending</p>
                    <p className="outfit" style={{ fontSize: '1rem', fontWeight: 800 }}>{pendingCount}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2" style={{ padding: '4px', background: 'var(--bg-glass)', borderRadius: 14 }}>
                {tabs.map(tab => (
                    <motion.button
                        key={tab.key}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            flex: 1, padding: '10px 0', borderRadius: 11,
                            fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
                            background: activeTab === tab.key ? 'var(--accent)' : 'transparent',
                            color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                            border: 'none', cursor: 'pointer',
                            transition: 'all 0.25s ease',
                        }}
                    >
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            {/* Transactions List */}
            <div className="flex flex-col gap-3">
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="glass-card flex flex-col items-center justify-center"
                            style={{ padding: '48px 20px', textAlign: 'center' }}
                        >
                            <div style={{
                                width: 64, height: 64, borderRadius: 20,
                                background: 'var(--bg-glass)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                            }}>
                                <Inbox size={28} style={{ color: 'var(--text-muted)' }} />
                            </div>
                            <p className="outfit" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>No Transactions</p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                {activeTab === 'deposit' ? 'No deposit records found' :
                                 activeTab === 'withdraw' ? 'No withdrawal records found' :
                                 'Your transaction history will appear here'}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="flex flex-col gap-3"
                        >
                            {filtered.map((txn, i) => {
                                const type = typeConfig[txn.type] || typeConfig.deposit;
                                const status = statusConfig[txn.status] || statusConfig.pending;
                                const StatusIcon = status.icon;

                                return (
                                    <motion.div
                                        key={txn._id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="glass-card"
                                        style={{ padding: '16px 18px' }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {/* Type Icon */}
                                                <div style={{
                                                    width: 42, height: 42, borderRadius: 14,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: txn.type === 'deposit' ? 'rgba(22,163,74,0.1)' : 'rgba(225,29,72,0.1)',
                                                }}>
                                                    <type.icon size={20} style={{ color: type.color }} />
                                                </div>
                                                {/* Info */}
                                                <div>
                                                    <p style={{ fontSize: '0.82rem', fontWeight: 700 }}>{type.label}</p>
                                                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
                                                        {formatDate(txn.createdAt)} • {formatTime(txn.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Amount + Status */}
                                            <div style={{ textAlign: 'right' }}>
                                                <p className="outfit" style={{
                                                    fontSize: '0.88rem', fontWeight: 800,
                                                    color: txn.type === 'deposit' ? 'var(--success)' : 'var(--error)',
                                                }}>
                                                    {txn.type === 'deposit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                                </p>
                                                <div className="flex items-center justify-end gap-1" style={{ marginTop: 4 }}>
                                                    <StatusIcon size={10} style={{ color: status.color }} />
                                                    <span style={{
                                                        fontSize: 9, fontWeight: 700, color: status.color,
                                                        textTransform: 'uppercase', letterSpacing: '0.5px',
                                                    }}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default History;
