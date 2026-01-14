const Settings = require('../models/Settings');

// @desc    Get Shop Settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update Shop Settings
// @route   PUT /api/settings
// @access  Private (Admin/SuperAdmin)
exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        const { salonName, address, phone, currency } = req.body;

        settings.salonName = salonName || settings.salonName;
        settings.address = address || settings.address;
        settings.phone = phone || settings.phone;
        settings.currency = currency || settings.currency;

        if (req.file) {
            // Store relative path for frontend access
            // Convert backslashes to forward slashes for URL consistency
            const relativePath = 'uploads/' + req.file.filename;
            settings.logoUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/${relativePath}`;
        }

        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
