import express from 'express';
import { getPlans, createPlan, updatePlan, deletePlan } from '../controllers/planController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPlans);
router.post('/', protect, authorize('admin'), createPlan);
router.put('/:id', protect, authorize('admin'), updatePlan);
router.delete('/:id', protect, authorize('admin'), deletePlan);

export default router;
