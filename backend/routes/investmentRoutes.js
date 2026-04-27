import express from 'express';
import { invest, getMyInvestments, getAllInvestments } from '../controllers/investmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, invest);
router.get('/my', protect, getMyInvestments);
router.get('/', protect, authorize('admin'), getAllInvestments);

export default router;
