// File: routes/rooms.js
const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  roomPhotoUpload,
  getAvailableRooms,
  getRoomStats,
  updateRoomStatus
} = require('../controllers/rooms');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Room = require('../models/Room');

// Re-route into other resource routers
const bookingRouter = require('./bookings');
const housekeepingRouter = require('./housekeeping');

// Re-route to other resource routers
router.use('/:roomId/bookings', bookingRouter);
router.use('/:roomId/housekeeping', housekeepingRouter);

router
  .route('/')
  .get(getRooms)
  .post(protect, authorize('admin'), createRoom);

router
  .route('/available')
  .get(getAvailableRooms);

router
  .route('/stats')
  .get(protect, authorize('admin'), getRoomStats);

router
  .route('/:id')
  .get(getRoom)
  .put(protect, authorize('admin'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

router
  .route('/:id/photos')
  .put(protect, authorize('admin'), roomPhotoUpload);

router
  .route('/:id/status')
  .put(protect, authorize('admin', 'receptionist'), updateRoomStatus);

module.exports = router;
