import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';
import investmentRoutes from './routes/investmentRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import configRoutes from './routes/configRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/config', configRoutes);

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is running...' });
});

export default app;
