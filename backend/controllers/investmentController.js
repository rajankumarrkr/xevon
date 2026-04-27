import Investment from '../models/Investment.js';
import Plan from '../models/Plan.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

// @desc    Invest in a plan
// @route   POST /api/investments
// @access  Private
export const invest = async (req, res) => {
    try {
        const { planId, amount } = req.body;

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        if (amount < plan.minAmount || amount > plan.maxAmount) {
            return res.status(400).json({ 
                success: false, 
                message: `Amount must be between ${plan.minAmount} and ${plan.maxAmount}` 
            });
        }

        const user = await User.findById(req.user.id);
        if (user.walletBalance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        // Calculate daily profit and end date
        const dailyProfit = (amount * plan.dailyPercent) / 100;
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);

        // Deduct balance
        user.walletBalance -= amount;
        await user.save();

        // Create Investment
        const investment = await Investment.create({
            user: user._id,
            plan: plan._id,
            amount,
            dailyProfit,
            endDate
        });

        // Record Transaction
        await Transaction.create({
            user: user._id,
            type: 'withdraw',
            amount,
            status: 'completed',
            description: `Invested in ${plan.name} plan`
        });

        // Referral Commission (One-time 10% on investment amount)
        if (user.referredBy) {
            const referrer = await User.findById(user.referredBy);
            if (referrer) {
                const commission = (amount * 10) / 100;
                referrer.walletBalance += commission;
                referrer.totalEarning += commission;
                await referrer.save();

                await Transaction.create({
                    user: referrer._id,
                    type: 'referral_commission',
                    amount: commission,
                    status: 'completed',
                    description: `Referral commission from ${user.name}`
                });
            }
        }

        res.status(201).json({ success: true, data: investment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user investments
// @route   GET /api/investments/my
// @access  Private
export const getMyInvestments = async (req, res) => {
    try {
        const investments = await Investment.find({ user: req.user.id }).populate('plan');
        res.status(200).json({ success: true, data: investments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all investments (Admin)
// @route   GET /api/investments
// @access  Private/Admin
export const getAllInvestments = async (req, res) => {
    try {
        const investments = await Investment.find().populate('user', 'name email').populate('plan');
        res.status(200).json({ success: true, data: investments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
