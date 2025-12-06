// File: controllers/bookings.js
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Guest = require('../models/Guest');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { sendEmail } = require('../utils/email');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @route   GET /api/v1/rooms/:roomId/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  if (req.params.roomId) {
    const bookings = await Booking.find({ room: req.params.roomId })
      .populate('guest', 'firstName lastName email phone')
      .populate('room', 'roomNumber roomType price');

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('guest')
    .populate('room');

  if (!booking) {
    return next(
      new ErrorResponse(`No booking found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (
    booking.user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'receptionist'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this booking`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create new booking
// @route   POST /api/v1/rooms/:roomId/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Add room and user to request body
  req.body.room = req.params.roomId;
  req.body.user = req.user.id;

  const room = await Room.findById(req.params.roomId);

  if (!room) {
    return next(
      new ErrorResponse(`No room with the id of ${req.params.roomId}`, 404)
    );
  }

  // Check if room is available for the requested dates
  const { checkInDate, checkOutDate, guests } = req.body;

  // Basic validation
  if (!checkInDate || !checkOutDate) {
    return next(
      new ErrorResponse('Please provide both check-in and check-out dates', 400)
    );
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkIn >= checkOut) {
    return next(
      new ErrorResponse('Check-out date must be after check-in date', 400)
    );
  }

  // Check if room is available for the requested dates
  const existingBooking = await Booking.findOne({
    room: req.params.roomId,
    $or: [
      {
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn }
      }
    ],
    status: { $nin: ['cancelled', 'checked-out'] }
  });

  if (existingBooking) {
    return next(
      new ErrorResponse(
        'Room is not available for the selected dates',
        400
      )
    );
  }

  // Check room capacity
  if (guests > room.capacity) {
    return next(
      new ErrorResponse(
        `This room can only accommodate up to ${room.capacity} guests`,
        400
      )
    );
  }

  // Create booking
  const booking = await Booking.create(req.body);

  // Update room status if check-in is today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkIn.toDateString() === today.toDateString()) {
    room.status = 'occupied';
    await room.save();
  }

  // Send confirmation email
  try {
    await sendEmail({
      to: req.user.email,
      subject: 'Booking Confirmation',
      text: `Your booking for ${room.roomNumber} from ${checkInDate} to ${checkOutDate} has been confirmed.`
    });
  } catch (err) {
    console.error('Error sending email:', err);
  }

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`No booking with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (
    booking.user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'receptionist'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this booking`,
        401
      )
    );
  }

  // Prevent updating certain fields directly
  if (req.body.room || req.body.user || req.body.guest) {
    return next(
      new ErrorResponse(
        'Cannot update room, user, or guest information directly',
        400
      )
    );
  }

  // Handle status changes
  if (req.body.status) {
    // Additional validation for status changes
    if (
      req.body.status === 'checked-in' &&
      booking.status !== 'confirmed'
    ) {
      return next(
        new ErrorResponse(
          'Only confirmed bookings can be checked in',
          400
        )
      );
    }

    if (req.body.status === 'checked-out') {
      req.body.checkOutDate = Date.now();
      
      // Update room status
      const room = await Room.findById(booking.room);
      if (room) {
        room.status = 'available';
        await room.save();
      }
    }

    if (req.body.status === 'cancelled') {
      // If cancelling, make room available again
      const room = await Room.findById(booking.room);
      if (room && room.status === 'reserved') {
        room.status = 'available';
        await room.save();
      }
    }
  }

  // Update booking
  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private/Admin
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`No booking with the id of ${req.params.id}`, 404)
    );
  }

  // Update room status if needed
  if (booking.status === 'confirmed' || booking.status === 'checked-in') {
    const room = await Room.findById(booking.room);
    if (room) {
      room.status = 'available';
      await room.save();
    }
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get bookings by date range
// @route   GET /api/v1/bookings/range
// @access  Private/Admin
exports.getBookingsByDateRange = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(
      new ErrorResponse('Please provide both start and end dates', 400)
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const bookings = await Booking.find({
    $or: [
      // Bookings that start within the range
      { checkInDate: { $gte: start, $lte: end } },
      // Bookings that end within the range
      { checkOutDate: { $gte: start, $lte: end } },
      // Bookings that span the entire range
      {
        checkInDate: { $lte: start },
        checkOutDate: { $gte: end }
      }
    ]
  })
    .populate('guest', 'firstName lastName email phone')
    .populate('room', 'roomNumber roomType')
    .sort('checkInDate');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get booking statistics
// @route   GET /api/v1/bookings/stats
// @access  Private/Admin
exports.getBookingStats = asyncHandler(async (req, res, next) => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get monthly bookings
  const monthlyBookings = await Booking.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    stats,
    monthlyBookings
  });
});

// @desc    Check in guest
// @route   PUT /api/v1/bookings/:id/checkin
// @access  Private/Admin/Receptionist
exports.checkIn = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`No booking with the id of ${req.params.id}`, 404)
    );
  }

  if (booking.status !== 'confirmed') {
    return next(
      new ErrorResponse(
        `Cannot check in a booking with status: ${booking.status}`,
        400
      )
    );
  }

  // Update booking status
  booking.status = 'checked-in';
  booking.checkedInAt = Date.now();
  await booking.save();

  // Update room status
  const room = await Room.findById(booking.room);
  if (room) {
    room.status = 'occupied';
    await room.save();
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Check out guest
// @route   PUT /api/v1/bookings/:id/checkout
// @access  Private/Admin/Receptionist
exports.checkOut = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`No booking with the id of ${req.params.id}`, 404)
    );
  }

  if (booking.status !== 'checked-in') {
    return next(
      new ErrorResponse(
        `Cannot check out a booking with status: ${booking.status}`,
        400
      )
    );
  }

  // Update booking status
  booking.status = 'checked-out';
  booking.checkedOutAt = Date.now();
  await booking.save();

  // Update room status
  const room = await Room.findById(booking.room);
  if (room) {
    room.status = 'cleaning';
    await room.save();
  }

  // Create housekeeping task
  await Housekeeping.create({
    room: booking.room,
    type: 'cleaning',
    status: 'pending',
    assignedTo: null,
    notes: 'Post-checkout cleaning required',
    priority: 'high'
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`No booking with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (
    booking.user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'receptionist'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to cancel this booking`,
        401
      )
    );
  }

  // Check if booking can be cancelled
  const today = new Date();
  const checkInDate = new Date(booking.checkInDate);
  const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));

  if (daysUntilCheckIn < 1) {
    return next(
      new ErrorResponse(
        'Cannot cancel booking on or after check-in date',
        400
      )
    );
  }

  // Update booking status
  booking.status = 'cancelled';
  booking.cancelledAt = Date.now();
  await booking.save();

  // Update room status if needed
  if (booking.room) {
    const room = await Room.findById(booking.room);
    if (room && room.status === 'reserved') {
      room.status = 'available';
      await room.save();
    }
  }

  // Send cancellation email
  try {
    const user = await User.findById(booking.user);
    if (user) {
      await sendEmail({
        email: user.email,
        subject: 'Booking Cancellation',
        message: `Your booking #${booking._id} has been cancelled.`
      });
    }
  } catch (err) {
    console.error('Error sending cancellation email:', err);
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});
