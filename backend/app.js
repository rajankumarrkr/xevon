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

// Trust proxy - required for secure cookies behind Render/Heroku proxy
app.set('trust proxy', 1);

// Middlewares
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://xevon-zeta.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const sanitizedOrigin = origin.replace(/\/$/, "");
        const sanitizedAllowed = allowedOrigins
            .filter(o => o) // Remove null/undefined
            .map(o => o.replace(/\/$/, ""));

        if (sanitizedAllowed.includes(sanitizedOrigin)) {
            callback(null, true);
        } else {
            console.log(`CORS Blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
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
