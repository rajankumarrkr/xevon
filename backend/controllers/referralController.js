import User from '../models/User.js';

// @desc    Get user referrals (team)
// @route   GET /api/referrals/my
// @access  Private
export const getMyReferrals = async (req, res) => {
    try {
        const referrals = await User.find({ referredBy: req.user.id }).select('name email createdAt walletBalance status');
        
        // Calculate total team stats
        const totalReferrals = referrals.length;
        const activeReferrals = referrals.filter(ref => ref.walletBalance > 0).length;

        res.status(200).json({ 
            success: true, 
            data: {
                referrals,
                stats: {
                    totalReferrals,
                    activeReferrals
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
