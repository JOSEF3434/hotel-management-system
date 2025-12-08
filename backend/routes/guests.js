const express = require('express');
const router = express.Router();
const {
  getGuests,
  getGuest,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestByEmail
} = require('../controllers/guests');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Guest = require('../models/Guest');

// All routes are protected and require admin access
router.use(protect);
router.use(authorize('admin', 'receptionist'));

// Advanced results for filtering, sorting, and pagination
router.get(
  '/',
  advancedResults(Guest, [
    { path: 'bookings', select: 'checkInDate checkOutDate status' }
  ]),
  getGuests
);

// Get guest by email
router.get('/email/:email', getGuestByEmail);

// Standard CRUD routes
router
  .route('/')
  .post(createGuest);

router
  .route('/:id')
  .get(getGuest)
  .put(updateGuest)
  .delete(authorize('admin'), deleteGuest);

module.exports = router;
