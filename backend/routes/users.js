// File: routes/users.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  userPhotoUpload,
  getUserStats,
  deactivateUser,
  reactivateUser,
  getUserActivity
} = require('../controllers/users');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');

// Include other resource routers
const bookingRouter = require('./bookings');

// Re-route into other resource routers
router.use('/:userId/bookings', bookingRouter);

router
  .route('/')
  .get(protect, authorize('admin'), advancedResults(User), getUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router
  .route('/:id/photo')
  .put(protect, userPhotoUpload);

router
  .route('/:id/deactivate')
  .put(protect, authorize('admin'), deactivateUser);

router
  .route('/:id/reactivate')
  .put(protect, authorize('admin'), reactivateUser);

router
  .route('/:id/activity')
  .get(protect, authorize('admin'), getUserActivity);

router
  .route('/stats')
  .get(protect, authorize('admin'), getUserStats);

module.exports = router;