import express from 'express';
import { deposit, withdraw, getMyTransactions, updateTransactionStatus, getAllTransactions } from '../controllers/transactionController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/deposit', protect, upload.single('proof'), deposit);
router.post('/withdraw', protect, withdraw);
router.get('/my', protect, getMyTransactions);
router.get('/', protect, authorize('admin'), getAllTransactions);
router.put('/:id/status', protect, authorize('admin'), updateTransactionStatus);

export default router;
