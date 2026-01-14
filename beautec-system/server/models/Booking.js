const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // Array of services
    // serviceName removed as it will be dynamic or redundant for multi-service
    totalPrice: { type: Number },
    totalDuration: { type: Number },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    terminalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Terminal' },
    chairId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chair' }, // Added Chair
    status: { type: String, default: 'Confirmed' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
