import api from './api';

const planService = {
    // Get all plans (public)
    getAll: () =>
        api.get('/plans'),

    // Create new plan (admin)
    create: (planData) =>
        api.post('/plans', planData),

    // Update plan (admin)
    update: (id, planData) =>
        api.put(`/plans/${id}`, planData),
};

export default planService;
