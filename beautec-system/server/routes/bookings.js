const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, updateBookingStatus, deleteBooking, getMyBookings } = require('../controllers/bookingController');
const { protect, checkRole } = require('../middleware/auth');

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/my-bookings', protect, getMyBookings); // Added this line
// Multi-Service Support:
router.get('/available-slots', require('../controllers/bookingController').getAvailableSlots);
router.put('/:id', updateBookingStatus);

module.exports = router;
