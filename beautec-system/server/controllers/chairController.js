const Chair = require('../models/Chair');

// @desc    Get all chairs
// @route   GET /api/chairs
// @access  Public
exports.getChairs = async (req, res) => {
    try {
        const chairs = await Chair.find()
            .populate('assignedStaff', 'name email')
            .populate('supportedServices', 'name');
        res.status(200).json({ success: true, count: chairs.length, data: chairs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single chair
// @route   GET /api/chairs/:id
// @access  Public
exports.getChair = async (req, res) => {
    try {
        const chair = await Chair.findById(req.params.id)
            .populate('assignedStaff', 'name email')
            .populate('supportedServices', 'name');

        if (!chair) {
            return res.status(404).json({ success: false, error: 'Chair not found' });
        }

        res.status(200).json({ success: true, data: chair });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new chair
// @route   POST /api/chairs
// @access  Private (Admin)
exports.createChair = async (req, res) => {
    try {
        const chair = await Chair.create(req.body);
        res.status(201).json({ success: true, data: chair });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update chair
// @route   PUT /api/chairs/:id
// @access  Private (Admin)
exports.updateChair = async (req, res) => {
    try {
        const chair = await Chair.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!chair) {
            return res.status(404).json({ success: false, error: 'Chair not found' });
        }

        res.status(200).json({ success: true, data: chair });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete chair
// @route   DELETE /api/chairs/:id
// @access  Private (Admin)
exports.deleteChair = async (req, res) => {
    try {
        const chair = await Chair.findByIdAndDelete(req.params.id);

        if (!chair) {
            return res.status(404).json({ success: false, error: 'Chair not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
