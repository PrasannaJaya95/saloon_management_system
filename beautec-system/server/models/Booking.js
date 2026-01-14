const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    serviceName: { type: String, required: true }, // Keep name for snapshot
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }, // Calculated based on duration
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    terminalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Terminal' },
    status: { type: String, default: 'Pending' }, // Pending, Confirmed, Completed, Cancelled
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
