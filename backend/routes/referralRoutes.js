import express from 'express';
import { getMyReferrals } from '../controllers/referralController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', protect, getMyReferrals);

export default router;
