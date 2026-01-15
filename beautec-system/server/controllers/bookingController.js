const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Terminal = require('../models/Terminal');
const User = require('../models/User');
const { sendWhatsAppMessage } = require('../services/whatsappService');

// Get logged-in user's bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ clientId: req.user._id })
            .populate('services')
            .populate('staffId', 'name')
            .sort({ date: -1, startTime: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { clientName, clientPhone, services, date, time, chairId, staffId } = req.body;

        // 1. Validate & Calculate Totals
        // 'services' should be an array of IDs
        const selectedServices = await Service.find({ _id: { $in: services } });

        if (selectedServices.length === 0) {
            return res.status(400).json({ success: false, message: 'No valid services selected' });
        }

        const totalDuration = selectedServices.reduce((acc, curr) => acc + curr.duration, 0);
        const totalPrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

        // 2. Calculate End Time
        const startTimeParts = time.split(':');
        const startMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);
        const endMinutes = startMinutes + totalDuration;
        const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;

        // 3. Collision Check (If Chair is selected)
        if (chairId) {
            const hasCollision = await checkCollision(date, time, endTime, chairId);
            if (hasCollision) {
                return res.status(400).json({ success: false, message: 'Selected slot is no longer available on this station.' });
            }
        }
        // Note: Terminal logic from before is replaced by explicit Chair selection from frontend. 
        // If we want auto-assignment, we'd add it here, but user requirements imply Chair Selection.

        // 4. Create Booking
        const newBooking = new Booking({
            clientName,
            clientPhone,
            clientId: req.user ? req.user._id : undefined, // Link if logged in
            services: selectedServices.map(s => s._id),
            totalPrice,
            totalDuration,
            date,
            startTime: time,
            endTime,
            chairId,
            staffId: staffId || null,
            status: 'Confirmed'
        });

        await newBooking.save();

        // 5. WhatsApp
        if (clientPhone) {
            const serviceNames = selectedServices.map(s => s.name).join(', ');
            const msg = `Hello ${clientName}, appointment confirmed for: ${serviceNames} on ${date} at ${time}. Total: Rs. ${totalPrice}`;
            await sendWhatsAppMessage(clientPhone, msg);
        }

        res.status(201).json({ success: true, data: newBooking });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Helper
async function checkCollision(date, startTime, endTime, chairId) {
    const parse = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const newStart = parse(startTime);
    const newEnd = parse(endTime);

    const todayBookings = await Booking.find({ date, chairId, status: { $ne: 'Cancelled' } });

    return todayBookings.some(b => {
        const bStart = parse(b.startTime);
        const bEnd = parse(b.endTime);
        return (newStart < bEnd && newEnd > bStart);
    });
}

exports.getAvailableSlots = async (req, res) => {
    try {
        const { date, chairId, duration } = req.query;
        console.log(`[getAvailableSlots] Request: date=${date}, chair=${chairId}, duration=${duration}`);

        if (!date || !chairId) return res.status(400).json({ success: false, error: 'Missing date or chairId' });

        let durationMin = parseInt(duration);
        if (isNaN(durationMin) || durationMin <= 0) {
            console.warn(`[getAvailableSlots] Invalid duration ${duration}, defaulting to 30`);
            durationMin = 30;
        }
        if (durationMin > 600) { // Safety cap
            console.warn(`[getAvailableSlots] Duration ${durationMin} too long, capping at 600`);
            durationMin = 600;
        }

        const openTime = 9 * 60; // 09:00
        const closeTime = 20 * 60; // 20:00
        const interval = 30;

        // Existing Bookings
        const bookings = await Booking.find({ date, chairId, status: { $ne: 'Cancelled' } });

        // Safely parse existing bookings to prevent crashes from malformed data
        const bookedRanges = bookings.reduce((acc, b) => {
            if (!b.startTime || !b.endTime) return acc;
            try {
                const [sh, sm] = b.startTime.split(':').map(Number);
                const [eh, em] = b.endTime.split(':').map(Number);
                if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return acc;
                acc.push({ start: sh * 60 + sm, end: eh * 60 + em });
            } catch (err) {
                // Ignore malformed bookings
            }
            return acc;
        }, []);

        const slots = [];
        const now = new Date();
        // Use local date components to match frontend's local date string
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const currentDateString = `${year}-${month}-${day}`;

        const isToday = date === currentDateString;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        for (let time = openTime; time <= closeTime - durationMin; time += interval) {
            // Check if slot is in the past (only for today)
            if (isToday && time <= currentMinutes) {
                continue;
            }

            const slotStart = time;
            const slotEnd = time + durationMin;

            const isTaken = bookedRanges.some(r => (slotStart < r.end && slotEnd > r.start));

            if (!isTaken) {
                const h = Math.floor(slotStart / 60);
                const m = slotStart % 60;
                const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                slots.push(timeStr);
            }
        }

        res.status(200).json({
            success: true,
            data: slots,
            debug: {
                request: { date, chairId, duration },
                parsed: { durationMin, isToday, currentMinutes, serverDate: currentDateString },
                bookingsFound: bookings.length,
                slotsGenerated: slots.length
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('services', 'name price duration') // Correct field name
            .populate('staffId', 'name')
            .populate('chairId', 'name description')   // Correct field name
            .sort({ date: 1, startTime: 1 });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
