import api from './api';

const investmentService = {
    // Purchase a plan
    invest: (planId, amount) =>
        api.post('/investments', { planId, amount }),

    // Get my investments
    getMine: () =>
        api.get('/investments/my'),

    // Get all investments (admin)
    getAll: () =>
        api.get('/investments'),
};

export default investmentService;
