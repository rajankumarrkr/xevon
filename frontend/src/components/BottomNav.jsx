import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Zap, Users, User, PlusCircle } from 'lucide-react';

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                <Home size={24} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/plans" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Zap size={24} />
                <span>Plans</span>
            </NavLink>
            <NavLink to="/deposit" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <PlusCircle size={24} />
                <span>Deposit</span>
            </NavLink>
            <NavLink to="/refer" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Users size={24} />
                <span>Refer</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <User size={24} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
