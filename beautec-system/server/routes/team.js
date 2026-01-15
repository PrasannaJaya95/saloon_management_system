const express = require('express');
const router = express.Router();
const { getTeamMembers, createTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { protect, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .get(getTeamMembers)
    .post(upload.single('image'), createTeamMember);

router.route('/:id')
    .delete(deleteTeamMember);

module.exports = router;
