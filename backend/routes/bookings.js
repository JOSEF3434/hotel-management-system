// File: routes/bookings.js
const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByDateRange,
  getBookingStats,
  checkIn,
  checkOut,
  cancelBooking
} = require('../controllers/bookings');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Booking = require('../models/Booking');

// Re-route into other resource routers
const paymentRouter = require('./payments');
router.use('/:bookingId/payments', paymentRouter);

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(
    authorize('admin', 'receptionist'),
    advancedResults(Booking, {
      path: 'guest room',
      select: 'firstName lastName roomNumber roomType'
    }),
    getBookings
  )
  .post(authorize('admin', 'receptionist', 'user'), createBooking);

router
  .route('/range')
  .get(authorize('admin', 'receptionist'), getBookingsByDateRange);

router
  .route('/stats')
  .get(authorize('admin'), getBookingStats);

router
  .route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(authorize('admin'), deleteBooking);

router
  .route('/:id/checkin')
  .put(authorize('admin', 'receptionist'), checkIn);

router
  .route('/:id/checkout')
  .put(authorize('admin', 'receptionist'), checkOut);

router
  .route('/:id/cancel')
  .put(cancelBooking);

module.exports = router;