import express from 'express';
import { getDashboardStats, getAllUsers, updateUserStatus, adjustBalance, distributeDailyProfit } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes here are admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/balance', adjustBalance);
router.post('/distribute-profits', distributeDailyProfit);

export default router;
