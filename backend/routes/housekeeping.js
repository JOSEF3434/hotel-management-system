// File: routes/housekeeping.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getHousekeepingTasks,
  getHousekeepingTask,
  createHousekeepingTask,
  updateHousekeepingTask,
  deleteHousekeepingTask,
  getTasksByStatus,
  getHousekeepingStats,
  getHousekeepingSchedule,
  assignTask,
  completeTask
} = require('../controllers/housekeeping');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Housekeeping = require('../models/Housekeeping');

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(
    authorize('admin', 'housekeeping'),
    advancedResults(Housekeeping, [
      { path: 'room', select: 'roomNumber roomType' },
      { path: 'assignedTo', select: 'name email' }
    ]),
    getHousekeepingTasks
  )
  .post(authorize('admin', 'receptionist'), createHousekeepingTask);

router
  .route('/status/:status')
  .get(authorize('admin', 'housekeeping'), getTasksByStatus);

router
  .route('/stats')
  .get(authorize('admin', 'housekeeping'), getHousekeepingStats);

router
  .route('/schedule')
  .get(authorize('admin', 'housekeeping'), getHousekeepingSchedule);

router
  .route('/:id')
  .get(authorize('admin', 'housekeeping'), getHousekeepingTask)
  .put(authorize('admin', 'housekeeping'), updateHousekeepingTask)
  .delete(authorize('admin'), deleteHousekeepingTask);

router
  .route('/:id/assign')
  .put(authorize('admin'), assignTask);

router
  .route('/:id/complete')
  .put(authorize('admin', 'housekeeping'), completeTask);

module.exports = router;