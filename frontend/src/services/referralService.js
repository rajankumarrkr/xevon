import api from './api';

const referralService = {
    // Get my referrals
    getMine: () =>
        api.get('/referrals/my'),
};

export default referralService;
