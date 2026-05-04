import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Investment from '../models/Investment.js';
import Plan from '../models/Plan.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalDeposits = await Transaction.aggregate([
            { $match: { type: 'deposit', status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalWithdrawals = await Transaction.aggregate([
            { $match: { type: 'withdraw', status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const activeInvestments = await Investment.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Platform Profit (Example: 20% of all deposits vs interest paid out - simplified for MVP)
        // Let's just show total liquidity
        const platformLiquidity = await User.aggregate([
            { $group: { _id: null, total: { $sum: '$walletBalance' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalDeposits: totalDeposits[0]?.total || 0,
                totalWithdrawals: totalWithdrawals[0]?.total || 0,
                activeInvestments: activeInvestments[0]?.total || 0,
                platformLiquidity: platformLiquidity[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).sort('-createdAt');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user status / block
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Manual balance adjustment
// @route   PUT /api/admin/users/:id/balance
// @access  Private/Admin
export const adjustBalance = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.walletBalance += Number(amount);
        await user.save();

        // Log the adjustment as a transaction
        await Transaction.create({
            user: user._id,
            type: amount > 0 ? 'deposit' : 'withdraw',
            amount: Math.abs(amount),
            status: 'approved',
            description: description || `Admin adjustment: ${amount > 0 ? 'Added' : 'Subtracted'}`
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Distribute daily profits to all active investments
// @route   POST /api/admin/distribute-profits
// @access  Private/Admin
export const distributeDailyProfit = async (req, res) => {
    try {
        const activeInvestments = await Investment.find({ status: 'active' }).populate('user');
        
        if (activeInvestments.length === 0) {
            return res.status(404).json({ success: false, message: 'No active investments found' });
        }

        let totalDistributed = 0;
        let usersAffected = 0;

        for (const investment of activeInvestments) {
            const user = investment.user;
            if (!user) continue;

            const profit = investment.dailyProfit;
            
            // 1. Update User Balance
            user.walletBalance += profit;
            user.totalEarnings = (user.totalEarnings || 0) + profit;
            await user.save();

            // 2. Create Transaction Log
            await Transaction.create({
                user: user._id,
                type: 'earning',
                amount: profit,
                status: 'approved',
                description: `Daily profit from ${investment.amount} investment`
            });

            // 3. Update Investment lastEarningDate
            investment.lastEarningDate = Date.now();
            
            // 4. Check if investment should be completed
            if (new Date() >= new Date(investment.endDate)) {
                investment.status = 'completed';
            }
            
            await investment.save();

            totalDistributed += profit;
            usersAffected++;
        }

        res.status(200).json({
            success: true,
            message: `Successfully distributed ₹${totalDistributed} to ${usersAffected} active investments.`,
            data: { totalDistributed, usersAffected }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
