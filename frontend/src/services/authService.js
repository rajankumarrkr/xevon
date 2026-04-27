import api from './api';

const authService = {
    // Login user
    login: (mobile, password) =>
        api.post('/auth/login', { mobile, password }),

    // Register new user
    register: (userData) =>
        api.post('/auth/register', userData),

    // Get current logged-in user
    getMe: () =>
        api.get('/auth/me'),

    // Logout
    logout: () =>
        api.get('/auth/logout'),
};

export default authService;
