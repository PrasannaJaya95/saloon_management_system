const mongoose = require('mongoose');

const TerminalSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Hair Station 1", "Massage Room A"
    type: { type: String, required: true }, // e.g., "Hair", "Spa", "Nail"
    status: { type: String, enum: ['Active', 'InActive', 'Maintenance'], default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Terminal', TerminalSchema);
