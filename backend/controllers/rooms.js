// File: controllers/rooms.js
const Room = require('../models/Room');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
const fs = require('fs');

// @desc    Get all rooms
// @route   GET /api/v1/rooms
// @access  Public
exports.getRooms = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Room.find(JSON.parse(queryStr)).populate('bookings');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('roomNumber');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Room.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const rooms = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: rooms.length,
    pagination,
    data: rooms
  });
});

// @desc    Get single room
// @route   GET /api/v1/rooms/:id
// @access  Public
exports.getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id).populate({
    path: 'bookings',
    select: 'checkInDate checkOutDate status guest'
  });

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Create new room
// @route   POST /api/v1/rooms
// @access  Private/Admin
exports.createRoom = asyncHandler(async (req, res, next) => {
  // Check if room number already exists
  const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
  if (existingRoom) {
    return next(
      new ErrorResponse(`Room with number ${req.body.roomNumber} already exists`, 400)
    );
  }

  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    data: room
  });
});

// @desc    Update room
// @route   PUT /api/v1/rooms/:id
// @access  Private/Admin
exports.updateRoom = asyncHandler(async (req, res, next) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if updating room number and if it already exists
  if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
    const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
    if (existingRoom) {
      return next(
        new ErrorResponse(`Room with number ${req.body.roomNumber} already exists`, 400)
      );
    }
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: room
  });
});

// @desc    Delete room
// @route   DELETE /api/v1/rooms/:id
// @access  Private/Admin
exports.deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if room has active bookings
  if (room.status === 'occupied' || room.status === 'reserved') {
    return next(
      new ErrorResponse(`Cannot delete room with status: ${room.status}`, 400)
    );
  }

  await room.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload room photos
// @route   PUT /api/v1/rooms/:id/photos
// @access  Private/Admin
exports.roomPhotoUpload = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const files = req.files.files;
  const uploadedFiles = [];

  // If single file, convert to array
  const filesArray = Array.isArray(files) ? files : [files];

  // Process each file
  for (const file of filesArray) {
    // Make sure the file is an image
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    // Create custom filename
    file.name = `room_${room._id}_${Date.now()}${path.parse(file.name).ext}`;
    const uploadPath = `${process.env.FILE_UPLOAD_PATH}/rooms/${file.name}`;

    // Move file to uploads folder
    await file.mv(uploadPath);

    // Add to room's images array
    room.images.push(file.name);
    uploadedFiles.push(file.name);
  }

  await room.save();

  res.status(200).json({
    success: true,
    data: uploadedFiles
  });
});

// @desc    Get available rooms
// @route   GET /api/v1/rooms/available
// @access  Public
exports.getAvailableRooms = asyncHandler(async (req, res, next) => {
  const { checkInDate, checkOutDate, roomType, capacity, amenities } = req.query;

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

  // Find all rooms that are available
  let query = {
    status: 'available'
  };

  // Add filters if provided
  if (roomType) {
    query.roomType = roomType;
  }

  if (capacity) {
    query.capacity = { $gte: capacity };
  }

  if (amenities) {
    const amenitiesArray = amenities.split(',');
    query.amenities = { $all: amenitiesArray };
  }

  // Find rooms that don't have bookings during the requested period
  const bookedRooms = await Booking.find({
    $or: [
      {
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn }
      }
    ],
    status: { $ne: 'cancelled' }
  }).select('room');

  const bookedRoomIds = [...new Set(bookedRooms.map(b => b.room.toString()))];

  if (bookedRoomIds.length > 0) {
    query._id = { $nin: bookedRoomIds };
  }

  const availableRooms = await Room.find(query).select('-bookings');

  res.status(200).json({
    success: true,
    count: availableRooms.length,
    data: availableRooms
  });
});

// @desc    Get room statistics
// @route   GET /api/v1/rooms/stats
// @access  Private/Admin
exports.getRoomStats = asyncHandler(async (req, res, next) => {
  const stats = await Room.aggregate([
    {
      $group: {
        _id: '$roomType',
        count: { $sum: 1 },
        available: {
          $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
        },
        occupied: {
          $sum: { $cond: [{ $eq: ['$status', 'occupied'] }, 1, 0] }
        },
        maintenance: {
          $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
        },
        cleaning: {
          $sum: { $cond: [{ $eq: ['$status', 'cleaning'] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    count: stats.length,
    data: stats
  });
});

// @desc    Update room status
// @route   PUT /api/v1/rooms/:id/status
// @access  Private/Admin
exports.updateRoomStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['available', 'occupied', 'maintenance', 'cleaning', 'out-of-order'];

  if (!status || !validStatuses.includes(status)) {
    return next(
      new ErrorResponse(`Please provide a valid status: ${validStatuses.join(', ')}`, 400)
    );
  };

  const room = await Room.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true
    }
  );

  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: room
  });
});