import express from 'express';
import { register, login, getMe, logout, adminLogin, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.get('/logout', protect, logout);

export default router;
