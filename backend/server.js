import app from './app.js';
import connectDB from './config/db.js';
import { initCronJobs } from './services/cronService.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Initialize Cron Jobs
initCronJobs();

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
