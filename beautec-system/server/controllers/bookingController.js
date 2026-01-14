const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Terminal = require('../models/Terminal');
const User = require('../models/User');
const { sendWhatsAppMessage } = require('../services/whatsappService');

exports.createBooking = async (req, res) => {
    try {
        const { clientName, clientPhone, serviceId, date, time, staffId } = req.body;

        // 1. Get Service Details
        const service = await Service.findById(serviceId);
        if (!service) {
            // Fallback for demo if serviceId is not provided (e.g. from simplistic frontend)
            if (req.body.service) { // Handle legacy/simple request
                // Create a mock booking for now
                const simpleBooking = await Booking.create({
                    clientName, clientPhone, serviceName: req.body.service,
                    date, startTime: time, endTime: time, // simplistic
                    status: 'Confirmed'
                });
                // Send WhatsApp Notification
                if (clientPhone) {
                    const msg = `Hello ${clientName}, your appointment for ${req.body.service} at Beautec is confirmed for ${date} at ${time}.`;
                    await sendWhatsAppMessage(clientPhone, msg);
                }
                return res.status(201).json({ success: true, data: simpleBooking, message: 'Booking created (Simple Mode)!' });
            }
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        // 2. Calculate End Time
        const startTimeParts = time.split(':');
        const startMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
        const endMinutes = startMinutes + service.duration;
        const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

        // 3. Find Available Terminal
        // Get all terminals of required type
        const possibleTerminals = await Terminal.find({ type: service.requiredTerminalType, status: 'Active' });
        if (possibleTerminals.length === 0) {
            return res.status(400).json({ success: false, message: `No active terminals found for ${service.requiredTerminalType}` });
        }

        // Check for collisions
        let selectedTerminal = null;
        for (const term of possibleTerminals) {
            const collisions = await Booking.find({
                terminalId: term._id,
                date: date,
                status: { $ne: 'Cancelled' },
                $or: [
                    { startTime: { $lt: endTime }, endTime: { $gt: time } } // Overlap condition
                ]
            });
            if (collisions.length === 0) {
                selectedTerminal = term;
                break;
            }
        }

        if (!selectedTerminal) {
            return res.status(400).json({ success: false, message: 'No terminals available for this time slot.' });
        }

        // 4. Create Booking
        const newBooking = new Booking({
            clientName,
            clientPhone,
            serviceId: service._id,
            serviceName: service.name,
            date,
            startTime: time,
            endTime,
            terminalId: selectedTerminal._id,
            staffId: staffId || null, // Optional staff assignment
            status: 'Confirmed'
        });

        await newBooking.save();

        // 5. Send Notification
        if (clientPhone) {
            const msg = `Hello ${clientName}, your appointment for ${service.name} is confirmed for ${date} at ${time}. (Terminal: ${selectedTerminal.name})`;
            await sendWhatsAppMessage(clientPhone, msg);
        }

        res.status(201).json({ success: true, data: newBooking, message: 'Booking confirmed with Smart Scheduling!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
