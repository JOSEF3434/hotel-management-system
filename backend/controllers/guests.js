const Guest = require('../models/Guest');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all guests
// @route   GET /api/v1/guests
// @access  Private/Admin
exports.getGuests = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single guest
// @route   GET /api/v1/guests/:id
// @access  Private/Admin
exports.getGuest = asyncHandler(async (req, res, next) => {
  const guest = await Guest.findById(req.params.id);

  if (!guest) {
    return next(
      new ErrorResponse(`Guest not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: guest
  });
});

// @desc    Create new guest
// @route   POST /api/v1/guests
// @access  Private/Admin
exports.createGuest = asyncHandler(async (req, res, next) => {
  const guest = await Guest.create(req.body);

  res.status(201).json({
    success: true,
    data: guest
  });
});

// @desc    Update guest
// @route   PUT /api/v1/guests/:id
// @access  Private/Admin
exports.updateGuest = asyncHandler(async (req, res, next) => {
  let guest = await Guest.findById(req.params.id);

  if (!guest) {
    return next(
      new ErrorResponse(`Guest not found with id of ${req.params.id}`, 404)
    );
  }

  guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: guest
  });
});

// @desc    Delete guest
// @route   DELETE /api/v1/guests/:id
// @access  Private/Admin
exports.deleteGuest = asyncHandler(async (req, res, next) => {
  const guest = await Guest.findById(req.params.id);

  if (!guest) {
    return next(
      new ErrorResponse(`Guest not found with id of ${req.params.id}`, 404)
    );
  }

  await guest.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get guest by email
// @route   GET /api/v1/guests/email/:email
// @access  Private/Admin
exports.getGuestByEmail = asyncHandler(async (req, res, next) => {
  const guest = await Guest.findOne({ email: req.params.email });

  if (!guest) {
    return next(
      new ErrorResponse(`Guest not found with email of ${req.params.email}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: guest
  });
});
