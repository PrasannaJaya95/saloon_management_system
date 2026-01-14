const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Audit who created it (HR/Admin)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shift', ShiftSchema);
