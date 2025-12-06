// File: controllers/housekeeping.js
const Housekeeping = require('../models/Housekeeping');
const Room = require('../models/Room');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all housekeeping tasks
// @route   GET /api/v1/housekeeping
// @access  Private
exports.getHousekeepingTasks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single housekeeping task
// @route   GET /api/v1/housekeeping/:id
// @access  Private
exports.getHousekeepingTask = asyncHandler(async (req, res, next) => {
  const task = await Housekeeping.findById(req.params.id)
    .populate('room', 'roomNumber roomType status')
    .populate('assignedTo', 'name email');

  if (!task) {
    return next(
      new ErrorResponse(`No housekeeping task with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Create housekeeping task
// @route   POST /api/v1/housekeeping
// @route   POST /api/v1/rooms/:roomId/housekeeping
// @access  Private
exports.createHousekeepingTask = asyncHandler(async (req, res, next) => {
  // Add room to request body if it's not already there
  if (req.params.roomId) {
    req.body.room = req.params.roomId;
  }

  // Add user to request body
  req.body.createdBy = req.user.id;

  // If task is for a room, verify the room exists
  if (req.body.room) {
    const room = await Room.findById(req.body.room);
    if (!room) {
      return next(
        new ErrorResponse(`No room with the id of ${req.body.room}`, 404)
      );
    }
  }

  const task = await Housekeeping.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update housekeeping task
// @route   PUT /api/v1/housekeeping/:id
// @access  Private
exports.updateHousekeepingTask = asyncHandler(async (req, res, next) => {
  let task = await Housekeeping.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`No housekeeping task with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is housekeeping staff or admin
  if (
    req.user.role !== 'admin' &&
    req.user.role !== 'housekeeping' &&
    task.assignedTo?.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this task`,
        401
      )
    );
  }

  // If task is being marked as completed, set completedAt
  if (req.body.status === 'completed' && task.status !== 'completed') {
    req.body.completedAt = Date.now();
    req.body.completedBy = req.user.id;

    // If this was a room cleaning task, update the room status
    if (task.room && task.type === 'cleaning') {
      await Room.findByIdAndUpdate(
        task.room,
        { status: 'available' },
        { new: true, runValidators: true }
      );
    }
  }

  task = await Housekeeping.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete housekeeping task
// @route   DELETE /api/v1/housekeeping/:id
// @access  Private/Admin
exports.deleteHousekeepingTask = asyncHandler(async (req, res, next) => {
  const task = await Housekeeping.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`No housekeeping task with the id of ${req.params.id}`, 404)
    );
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get housekeeping tasks by status
// @route   GET /api/v1/housekeeping/status/:status
// @access  Private
exports.getTasksByStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.params;
  const query = { status };

  // If user is housekeeping staff, only show their assigned tasks
  if (req.user.role === 'housekeeping') {
    query.assignedTo = req.user.id;
  }

  const tasks = await Housekeeping.find(query)
    .populate('room', 'roomNumber roomType status')
    .populate('assignedTo', 'name email')
    .sort({ priority: -1, createdAt: 1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get housekeeping stats
// @route   GET /api/v1/housekeeping/stats
// @access  Private/Admin
exports.getHousekeepingStats = asyncHandler(async (req, res, next) => {
  const stats = await Housekeeping.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        highPriority: {
          $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
        },
        mediumPriority: {
          $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
        },
        lowPriority: {
          $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get tasks by type
  const tasksByType = await Housekeeping.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get staff performance
  const staffPerformance = await Housekeeping.aggregate([
    {
      $match: { status: 'completed' }
    },
    {
      $group: {
        _id: '$assignedTo',
        totalTasks: { $sum: 1 },
        avgCompletionTime: { $avg: { $subtract: ['$completedAt', '$createdAt'] } }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'staff'
      }
    },
    {
      $unwind: '$staff'
    },
    {
      $project: {
        _id: 0,
        staff: {
          id: '$staff._id',
          name: '$staff.name',
          email: '$staff.email'
        },
        totalTasks: 1,
        avgCompletionTime: 1
      }
    },
    { $sort: { totalTasks: -1 } }
  ]);

  res.status(200).json({
    success: true,
    stats,
    tasksByType,
    staffPerformance
  });
});

// @desc    Get housekeeping schedule
// @route   GET /api/v1/housekeeping/schedule
// @access  Private
exports.getHousekeepingSchedule = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const query = {};

  if (startDate && endDate) {
    query.scheduledDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // If user is housekeeping staff, only show their assigned tasks
  if (req.user.role === 'housekeeping') {
    query.assignedTo = req.user.id;
  }

  const schedule = await Housekeeping.find(query)
    .populate('room', 'roomNumber roomType')
    .populate('assignedTo', 'name email')
    .sort({ scheduledDate: 1, priority: -1 });

  res.status(200).json({
    success: true,
    count: schedule.length,
    data: schedule
  });
});

// @desc    Assign task to staff
// @route   PUT /api/v1/housekeeping/:id/assign
// @access  Private/Admin
exports.assignTask = asyncHandler(async (req, res, next) => {
  const { assignedTo } = req.body;

  if (!assignedTo) {
    return next(new ErrorResponse('Please provide a staff member to assign', 400));
  }

  const task = await Housekeeping.findByIdAndUpdate(
    req.params.id,
    {
      assignedTo,
      status: 'assigned',
      assignedAt: Date.now()
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!task) {
    return next(
      new ErrorResponse(`No housekeeping task with the id of ${req.params.id}`, 404)
    );
  }

  // In a real app, you might want to send a notification to the staff member
  // e.g., via email, SMS, or push notification

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Complete task
// @route   PUT /api/v1/housekeeping/:id/complete
// @access  Private
exports.completeTask = asyncHandler(async (req, res, next) => {
  const { notes } = req.body;

  const task = await Housekeeping.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`No housekeeping task with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is assigned to the task or is admin
  if (
    task.assignedTo?.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'housekeeping'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to complete this task`,
        401
      )
    );
  }

  task.status = 'completed';
  task.completedAt = Date.now();
  task.completedBy = req.user.id;
  task.notes = notes || task.notes;

  await task.save();

  // If this was a room cleaning task, update the room status
  if (task.room && task.type === 'cleaning') {
    await Room.findByIdAndUpdate(
      task.room,
      { status: 'available' },
      { new: true, runValidators: true }
    );
  }

  res.status(200).json({
    success: true,
    data: task
  });
});