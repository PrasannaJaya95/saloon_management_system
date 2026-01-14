const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getAllBookings);
// Multi-Service Support:
router.get('/available-slots', require('../controllers/bookingController').getAvailableSlots);
router.put('/:id', updateBookingStatus);

module.exports = router;
