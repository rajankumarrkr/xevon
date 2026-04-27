import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set credentials for axios
    axios.defaults.withCredentials = true;

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/auth/me`);
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
            const { data } = await axios.post(`${API_URL}/auth/login`, { mobile, password });
            if (data.success) {
                setUser(data.user);
                return { success: true };
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            // userData will now contain mobile instead of email
            const { data } = await axios.post(`${API_URL}/auth/register`, userData);
            if (data.success) {
                setUser(data.user);
                return { success: true };
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await axios.get(`${API_URL}/auth/logout`);
            setUser(null);
        } catch (err) {
            console.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
