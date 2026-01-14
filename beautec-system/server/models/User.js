const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['SuperAdmin', 'SalonAdmin', 'HRAdmin', 'User'],
        default: 'User'
    },
    permissions: {
        type: [String],
        default: [] // e.g. ['manage_bookings', 'manage_inventory']
    },
    position: { type: String }, // e.g. Senior Stylist
    phone: { type: String },
    avatar: { type: String },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'On Leave'],
        default: 'Active'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
