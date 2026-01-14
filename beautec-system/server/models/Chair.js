const mongoose = require('mongoose');

const ChairSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Staff who CAN work here
    supportedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // Services capable of being performed here
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Chair', ChairSchema);
