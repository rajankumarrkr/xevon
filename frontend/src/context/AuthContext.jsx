import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const { data } = await authService.getMe();
            if (data.success) {
                setUser(data.data);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (mobile, password) => {
        try {
            setError(null);
            const { data } = await authService.login(mobile, password);
            if (data.success) {
                setUser(data.user);
                return { success: true };
            }
        } catch (err) {
            const message = err.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const { data } = await authService.register(userData);
            if (data.success) {
                setUser(data.user);
                return { success: true };
            }
        } catch (err) {
            const message = err.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (err) {
            console.error('Logout failed');
        }
    };

    // Refresh user data (call after deposit/withdraw/invest)
    const refreshUser = async () => {
        try {
            const { data } = await authService.getMe();
            if (data.success) setUser(data.data);
        } catch (err) {
            console.error('Refresh failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, setUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
