import Config from '../models/Config.js';

// @desc    Get all config
// @route   GET /api/config
// @access  Public
export const getConfig = async (req, res) => {
    try {
        const configs = await Config.find();
        const configMap = {};
        configs.forEach(c => {
            configMap[c.key] = c.value;
        });
        
        // Ensure UPI exists
        if (!configMap.upiId) {
            configMap.upiId = 'xevon.prem@upi';
        }

        res.status(200).json({ success: true, data: configMap });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update config
// @route   PUT /api/config
// @access  Private (Admin)
export const updateConfig = async (req, res) => {
    try {
        const { upiId } = req.body;

        if (upiId) {
            await Config.findOneAndUpdate(
                { key: 'upiId' },
                { value: upiId },
                { upsert: true, new: true }
            );
        }

        if (req.file) {
            await Config.findOneAndUpdate(
                { key: 'qrImage' },
                { value: req.file.path },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({ success: true, message: 'Configuration updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
