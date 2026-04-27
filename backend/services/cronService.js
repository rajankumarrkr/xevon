import cron from 'node-cron';
import Investment from '../models/Investment.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const initCronJobs = () => {
    // Run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily profit distribution...');
        await distributeDailyProfits();
    });
};

export const distributeDailyProfits = async () => {
    try {
        const activeInvestments = await Investment.find({ status: 'active' });

        for (const investment of activeInvestments) {
            const now = new Date();
            
            // Check if investment has ended
            if (now > investment.endDate) {
                investment.status = 'completed';
                await investment.save();
                continue;
            }

            // Distribute profit
            const user = await User.findById(investment.user);
            if (user) {
                user.walletBalance += investment.dailyProfit;
                user.totalEarning += investment.dailyProfit;
                await user.save();

                // Record Transaction
                await Transaction.create({
                    user: user._id,
                    type: 'earning',
                    amount: investment.dailyProfit,
                    status: 'completed',
                    description: `Daily profit from investment`
                });

                investment.lastEarningDate = now;
                await investment.save();
            }
        }
        console.log('Daily profit distribution completed.');
    } catch (error) {
        console.error('Error in daily profit distribution:', error.message);
    }
};
