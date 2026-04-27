import api from './api';

const adminService = {
    // Dashboard stats
    getStats: () =>
        api.get('/admin/stats'),

    // Get all users
    getUsers: () =>
        api.get('/admin/users'),

    // Update user status (active/blocked)
    updateUserStatus: (id, status) =>
        api.put(`/admin/users/${id}/status`, { status }),

    // Adjust user balance
    adjustBalance: (id, amount, description) =>
        api.put(`/admin/users/${id}/balance`, { amount, description }),
};

export default adminService;
