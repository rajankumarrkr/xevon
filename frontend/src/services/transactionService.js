import api from './api';

const transactionService = {
    // Submit deposit with screenshot proof
    deposit: (amount, proofFile) => {
        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('proof', proofFile);
        return api.post('/transactions/deposit', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // Request withdrawal
    withdraw: (amount, upi) =>
        api.post('/transactions/withdraw', { amount, upi }),

    // Get my transactions
    getMine: () =>
        api.get('/transactions/my'),

    // Get all transactions (admin)
    getAll: () =>
        api.get('/transactions'),

    // Update transaction status (admin)
    updateStatus: (id, status) =>
        api.put(`/transactions/${id}/status`, { status }),
};

export default transactionService;
