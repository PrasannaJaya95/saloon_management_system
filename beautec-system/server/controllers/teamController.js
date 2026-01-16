const TeamMember = require('../models/TeamMember');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
exports.getTeamMembers = async (req, res, next) => {
    try {
        const members = await TeamMember.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: members.length, data: members });
    } catch (err) {
        console.error("Team API Error:", err);
        res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
};

// @desc    Add a new team member
// @route   POST /api/team
// @access  Private (Admin/SuperAdmin)
exports.createTeamMember = async (req, res, next) => {
    try {
        const { name, position } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

        const member = await TeamMember.create({
            name,
            position,
            imageUrl
        });

        res.status(201).json({ success: true, data: member });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private (Admin/SuperAdmin)
exports.deleteTeamMember = async (req, res, next) => {
    try {
        const member = await TeamMember.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }

        await member.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
