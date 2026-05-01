import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  TrendingUp, 
  Target, 
  RefreshCw, 
  ShieldCheck, 
  ChevronRight, 
  Home, 
  Compass, 
  PieChart, 
  User,
  ArrowUpRight
} from 'lucide-react';
import '../styles/grow-india.css';

// Assets
import coinImg from '../assets/coin.png';
import rocketImg from '../assets/rocket.png';

const GrowIndiaHome = () => {
  return (
    <div className="grow-india-page">
      <div className="iphone-frame">
        {/* Header */}
        <header className="grow-header">
          <div className="logo-container">
            <div className="app-logo">
              <ShieldCheck color="#fff" size={24} strokeWidth={2.5} />
            </div>
            <span className="app-name">Grow India</span>
          </div>
          <div className="header-right">
            <div className="icon-button glass">
              <Bell size={20} color="#1E1B4B" />
            </div>
            <div className="avatar">RK</div>
          </div>
        </header>

        <div className="greeting-section">
          <h2 className="greeting-text">Welcome back, Rajan 👋</h2>
        </div>

        {/* Hero Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-card"
        >
          <div className="balance-label">Total Balance</div>
          <div className="balance-amount">₹0.00</div>
          <div className="earnings-badge">
            <TrendingUp size={14} style={{ marginRight: 6 }} />
            +₹0 Total Earnings
          </div>

          <div className="hero-actions">
            <motion.button whileTap={{ scale: 0.95 }} className="btn-primary">
              Invest Now
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} className="btn-secondary">
              Withdraw
            </motion.button>
          </div>

          <img src={coinImg} alt="Coin" className="floating-coin" />
          
          {/* Subtle graph background (SVG) */}
          <svg className="card-graph" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.2, pointerEvents: 'none' }} viewBox="0 0 400 100">
            <path d="M0 80 Q 100 20, 200 60 T 400 40" fill="none" stroke="#fff" strokeWidth="3" />
          </svg>
        </motion.div>

        {/* Quick Actions Row */}
        <div className="quick-actions">
          {[
            { icon: <TrendingUp size={24} />, label: 'Analytics', color: '#7C3AED' },
            { icon: <Target size={24} />, label: 'Goals', color: '#F472B6' },
            { icon: <RefreshCw size={24} />, label: 'SIP', color: '#C084FC' },
            { icon: <ShieldCheck size={24} />, label: 'Insurance', color: '#22C55E' },
          ].map((action, idx) => (
            <motion.div 
              key={idx}
              whileTap={{ scale: 0.9 }}
              className="action-item"
            >
              <div className="action-icon-box glass" style={{ color: action.color }}>
                {action.icon}
              </div>
              <span className="action-label">{action.label}</span>
            </motion.div>
          ))}
        </div>

        {/* SIP Promo Banner */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="sip-banner"
        >
          <div className="sip-content">
            <h3 className="sip-title">Start a SIP Today!</h3>
            <p className="sip-subtitle">Small steps today, big wealth tomorrow.</p>
            <button className="btn-start">Start Now →</button>
          </div>
          <img src={rocketImg} alt="Rocket" className="rocket-img" />
        </motion.div>

        {/* Portfolio Overview */}
        <div className="section-header">
          <h3 className="section-title">Portfolio Overview</h3>
          <span className="view-all">View All</span>
        </div>

        <div className="portfolio-grid">
          {[
            { label: 'Value', val: '₹0', color: '#7C3AED' },
            { label: 'Invested', val: '₹0', color: '#6B7280' },
            { label: 'Returns', val: '+₹0', color: '#22C55E' },
          ].map((item, idx) => (
            <div key={idx} className="mini-card glass">
              <span className="mini-label">{item.label}</span>
              <span className="mini-value" style={{ color: item.color === '#22C55E' ? item.color : 'inherit' }}>{item.val}</span>
              <svg width="100%" height="20" viewBox="0 0 100 20">
                <path d="M0 15 Q 25 5, 50 15 T 100 10" fill="none" stroke={item.color} strokeWidth="1.5" />
              </svg>
            </div>
          ))}
        </div>

        {/* Investment Plans Section */}
        <div className="section-header">
          <h3 className="section-title">Investment Plans</h3>
        </div>

        <motion.div whileTap={{ scale: 0.98 }} className="plan-card glass">
          <div className="plan-info">
            <span className="plan-name">Growth Pool Alpha</span>
            <span className="plan-tag">High Growth • Active</span>
            <span className="plan-return">12.5% p.a.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <svg width="60" height="30" viewBox="0 0 60 30">
               <path d="M0 25 L 15 15 L 30 20 L 45 5 L 60 10" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem', width: 'auto' }}>Invest Now</button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="section-header">
          <h3 className="section-title">Recent Activity</h3>
        </div>

        <div className="activity-card glass">
          <div className="activity-info">
            <div className="activity-icon">
              <ArrowUpRight size={20} />
            </div>
            <div className="activity-details">
              <h4>Profit Settled</h4>
              <span>27 April, 07:30 PM</span>
            </div>
          </div>
          <span className="activity-amount">+₹42</span>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav-container">
          <nav className="bottom-nav glass">
            {[
              { icon: <Home size={22} />, label: 'Home', active: true },
              { icon: <PieChart size={22} />, label: 'Invest', active: false },
              { icon: <Compass size={22} />, label: 'Discover', active: false },
              { icon: <User size={22} />, label: 'Profile', active: false },
            ].map((nav, idx) => (
              <div key={idx} className={`nav-item ${nav.active ? 'active active-glow' : ''}`}>
                {nav.icon}
                <span className="nav-label">{nav.label}</span>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default GrowIndiaHome;
