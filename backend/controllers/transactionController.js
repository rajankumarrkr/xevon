import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

// @desc    Deposit request (upload proof)
// @route   POST /api/transactions/deposit
// @access  Private
export const deposit = async (req, res) => {
    try {
        const { amount, proofImage } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const transaction = await Transaction.create({
            user: req.user.id,
            type: 'deposit',
            amount,
            proofImage,
            status: 'pending',
            description: 'Deposit request pending verification'
        });

        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Withdraw request
// @route   POST /api/transactions/withdraw
// @access  Private
export const withdraw = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount < 100) { // Example min limit ₹100
            return res.status(400).json({ success: false, message: 'Minimum withdrawal is ₹100' });
        }

        const user = await User.findById(req.user.id);
        if (user.walletBalance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        const transaction = await Transaction.create({
            user: req.user.id,
            type: 'withdraw',
            amount,
            status: 'pending',
            description: 'Withdrawal request pending approval'
        });

        // Deduct balance immediately to prevent double withdrawal
        user.walletBalance -= amount;
        await user.save();

        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my transactions
// @route   GET /api/transactions/my
// @access  Private
export const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions
// @access  Private/Admin
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('user', 'name mobile').sort('-createdAt');
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Approve/Reject transaction (Admin)
// @route   PUT /api/transactions/:id/status
// @access  Private/Admin
export const updateTransactionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        if (transaction.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Transaction already processed' });
        }

        transaction.status = status;
        await transaction.save();

        if (status === 'approved' && transaction.type === 'deposit') {
            const user = await User.findById(transaction.user);
            user.walletBalance += transaction.amount;
            await user.save();
        } else if (status === 'rejected' && transaction.type === 'withdraw') {
            // Refund user if withdrawal is rejected
            const user = await User.findById(transaction.user);
            user.walletBalance += transaction.amount;
            await user.save();
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
