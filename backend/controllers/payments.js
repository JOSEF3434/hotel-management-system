// File: controllers/payments.js
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Guest = require('../models/Guest');
const Payment = require('../models/Payment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { sendEmail } = require('../utils/email');
const PaymentService = require('../services/paymentService');

// @desc    Get all payments
// @route   GET /api/v1/payments
// @route   GET /api/v1/bookings/:bookingId/payments
// @access  Private/Admin
exports.getPayments = asyncHandler(async (req, res, next) => {
  if (req.params.bookingId) {
    const payments = await Payment.find({ booking: req.params.bookingId })
      .populate('guest', 'firstName lastName email')
      .populate('booking', 'bookingNumber checkInDate checkOutDate');

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single payment
// @route   GET /api/v1/payments/:id
// @access  Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate('guest')
    .populate('booking')
    .populate('processedBy', 'name email');

  if (!payment) {
    return next(
      new ErrorResponse(`No payment found with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is payment owner or admin
  if (
    payment.guest._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'receptionist'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this payment`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Create payment
// @route   POST /api/v1/bookings/:bookingId/payments
// @access  Private
exports.createPayment = asyncHandler(async (req, res, next) => {
  req.body.booking = req.params.bookingId;
  req.body.guest = req.user.id;
  req.body.processedBy = req.user.id;

  const booking = await Booking.findById(req.params.bookingId);

  if (!booking) {
    return next(
      new ErrorResponse(`No booking with the id of ${req.params.bookingId}`, 404)
    );
  }

  // Check if booking belongs to user or user is admin/receptionist
  if (
    booking.user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'receptionist'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add payment to this booking`,
        401
      )
    );
  }

  // Check if booking is already paid
  if (booking.paymentStatus === 'paid') {
    return next(
      new ErrorResponse('This booking has already been paid for', 400)
    );
  }

  // Calculate amount due if not provided
  if (!req.body.amount) {
    const nights = Math.ceil(
      (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) /
        (1000 * 60 * 60 * 24)
    );
    req.body.amount = nights * booking.room.price;
  }

  // Generate payment reference
  req.body.paymentReference = `PAY-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  // Set payment status
  req.body.status = req.body.paymentMethod === 'cash' ? 'completed' : 'pending';

  const payment = await Payment.create(req.body);

  // Update booking payment status
  const totalPaid = await Payment.aggregate([
    { $match: { booking: booking._id, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const paidAmount = totalPaid.length > 0 ? totalPaid[0].total : 0;
  const amountDue = booking.totalAmount - paidAmount;

  if (amountDue <= 0) {
    booking.paymentStatus = 'paid';
    booking.paidAt = Date.now();
    await booking.save();
  } else if (paidAmount > 0) {
    booking.paymentStatus = 'partially_paid';
    await booking.save();
  }

  // Send payment confirmation email
  try {
    const guest = await Guest.findById(booking.guest);
    if (guest) {
      await sendEmail({
        to: guest.email,
        subject: 'Payment Confirmation',
        html: `
          <h2>Payment Confirmation</h2>
          <p>Thank you for your payment of $${payment.amount.toFixed(2)}.</p>
          <p><strong>Booking Reference:</strong> ${booking.bookingNumber}</p>
          <p><strong>Payment Reference:</strong> ${payment.paymentReference}</p>
          <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
          <p><strong>Status:</strong> ${payment.status}</p>
          <p>Thank you for choosing our hotel!</p>
        `
      });
    }
  } catch (err) {
    console.error('Error sending payment confirmation email:', err);
  }

  res.status(201).json({
    success: true,
    data: payment
  });
});

// @desc    Update payment
// @route   PUT /api/v1/payments/:id
// @access  Private/Admin
exports.updatePayment = asyncHandler(async (req, res, next) => {
  let payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(
      new ErrorResponse(`No payment with the id of ${req.params.id}`, 404)
    );
  }

  // Prevent updating certain fields
  if (req.body.booking || req.body.guest) {
    return next(
      new ErrorResponse('Cannot update booking or guest information', 400)
    );
  }

  // If updating status to completed, verify payment
  if (req.body.status === 'completed' && payment.status !== 'completed') {
    req.body.processedAt = Date.now();
    req.body.processedBy = req.user.id;

    // Update booking payment status
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      const totalPaid = await Payment.aggregate([
        { $match: { booking: booking._id, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const paidAmount = totalPaid.length > 0 ? totalPaid[0].total : 0;
      const amountDue = booking.totalAmount - paidAmount;

      if (amountDue <= 0) {
        booking.paymentStatus = 'paid';
        booking.paidAt = Date.now();
        await booking.save();
      } else if (paidAmount > 0) {
        booking.paymentStatus = 'partially_paid';
        await booking.save();
      }
    }
  }

  payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Delete payment
// @route   DELETE /api/v1/payments/:id
// @access  Private/Admin
exports.deletePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(
      new ErrorResponse(`No payment with the id of ${req.params.id}`, 404)
    );
  }

  // Prevent deletion of completed payments
  if (payment.status === 'completed') {
    return next(
      new ErrorResponse('Cannot delete a completed payment', 400)
    );
  }

  await payment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get payment statistics
// @route   GET /api/v1/payments/stats
// @access  Private/Admin
exports.getPaymentStats = asyncHandler(async (req, res, next) => {
  const stats = await Payment.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get monthly payments
  const monthlyPayments = await Payment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Get payment methods
  const paymentMethods = await Payment.aggregate([
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    stats,
    monthlyPayments,
    paymentMethods
  });
});

// @desc    Process payment webhook
// @route   POST /api/v1/payments/webhook
// @access  Public
exports.processWebhook = asyncHandler(async (req, res, next) => {
  // Get the signature from the header
  const signature = req.headers['x-payment-signature'];
  
  if (!signature) {
    return next(new ErrorResponse('No signature provided', 400));
  }

  // Verify the signature (implementation depends on your payment processor)
  const isValid = verifySignature(
    JSON.stringify(req.body),
    signature,
    process.env.PAYMENT_WEBHOOK_SECRET
  );

  if (!isValid) {
    return next(new ErrorResponse('Invalid signature', 400));
  }

  const { event, data } = req.body;

  // Handle different payment events
  switch (event) {
    case 'payment.completed':
      await handlePaymentCompleted(data);
      break;
    case 'payment.failed':
      await handlePaymentFailed(data);
      break;
    case 'payment.refunded':
      await handlePaymentRefunded(data);
      break;
    default:
      console.log(`Unhandled event: ${event}`);
  }

  res.status(200).json({ success: true });
});

// Helper functions for webhook handling
const handlePaymentCompleted = async (data) => {
  const { paymentId, amount, currency, reference } = data;

  const payment = await Payment.findOne({ paymentReference: reference });
  if (!payment) return;

  // Update payment status
  payment.status = 'completed';
  payment.processedAt = Date.now();
  payment.transactionId = paymentId;
  payment.currency = currency;
  await payment.save();

  // Update booking payment status
  const booking = await Booking.findById(payment.booking);
  if (booking) {
    const totalPaid = await Payment.aggregate([
      { $match: { booking: booking._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paidAmount = totalPaid.length > 0 ? totalPaid[0].total : 0;
    const amountDue = booking.totalAmount - paidAmount;

    if (amountDue <= 0) {
      booking.paymentStatus = 'paid';
      booking.paidAt = Date.now();
      await booking.save();
    } else if (paidAmount > 0) {
      booking.paymentStatus = 'partially_paid';
      await booking.save();
    }
  }

  // Send payment confirmation email
  try {
    const guest = await Guest.findById(booking.guest);
    if (guest) {
      await sendEmail({
        to: guest.email,
        subject: 'Payment Confirmation',
        html: `
          <h2>Payment Confirmation</h2>
          <p>Thank you for your payment of ${amount} ${currency}.</p>
          <p><strong>Booking Reference:</strong> ${booking.bookingNumber}</p>
          <p><strong>Payment Reference:</strong> ${reference}</p>
          <p><strong>Status:</strong> Completed</p>
          <p>Thank you for choosing our hotel!</p>
        `
      });
    }
  } catch (err) {
    console.error('Error sending payment confirmation email:', err);
  }
};

const handlePaymentFailed = async (data) => {
  const { reference, reason } = data;

  const payment = await Payment.findOne({ paymentReference: reference });
  if (!payment) return;

  payment.status = 'failed';
  payment.failureReason = reason;
  await payment.save();

  // Notify admin of failed payment
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Payment Failed',
      html: `
        <h2>Payment Failed</h2>
        <p>A payment has failed with the following details:</p>
        <p><strong>Payment Reference:</strong> ${reference}</p>
        <p><strong>Amount:</strong> ${payment.amount} ${payment.currency}</p>
        <p><strong>Reason:</strong> ${reason}</p>
      `
    });
  } catch (err) {
    console.error('Error sending payment failure notification:', err);
  }
};

const handlePaymentRefunded = async (data) => {
  const { paymentId, amount, currency, reference, reason } = data;

  const payment = await Payment.findOne({ paymentReference: reference });
  if (!payment) return;

  // Create refund record
  const refund = await Payment.create({
    booking: payment.booking,
    guest: payment.guest,
    amount: -Math.abs(amount),
    currency,
    paymentMethod: payment.paymentMethod,
    paymentReference: `REF-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
    status: 'refunded',
    notes: reason || 'Payment refunded',
    processedBy: 'system'
  });

  // Update original payment status if full refund
  if (Math.abs(amount) >= payment.amount) {
    payment.status = 'refunded';
    await payment.save();
  }

  // Update booking payment status
  const booking = await Booking.findById(payment.booking);
  if (booking) {
    const totalPaid = await Payment.aggregate([
      { $match: { booking: booking._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const paidAmount = totalPaid.length > 0 ? totalPaid[0].total : 0;
    const amountDue = booking.totalAmount - paidAmount;

    if (amountDue > 0) {
      booking.paymentStatus = 'partially_paid';
      await booking.save();
    }
  }

  // Send refund confirmation email
  try {
    const guest = await Guest.findById(booking.guest);
    if (guest) {
      await sendEmail({
        to: guest.email,
        subject: 'Payment Refund',
        html: `
          <h2>Payment Refund</h2>
          <p>A refund of ${amount} ${currency} has been processed for your booking.</p>
          <p><strong>Booking Reference:</strong> ${booking.bookingNumber}</p>
          <p><strong>Refund Reference:</strong> ${refund.paymentReference}</p>
          <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
          <p>If you have any questions, please contact our support team.</p>
        `
      });
    }
  } catch (err) {
    console.error('Error sending refund confirmation email:', err);
  }
};

// Helper function to verify payment webhook signature
function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(digest, 'hex')
  );
}

// @desc    Process payment
// @route   POST /api/v1/bookings/:bookingId/payments/process
// @access  Private
exports.processPayment = asyncHandler(async (req, res, next) => {
  const { paymentMethod, amount, currency, ...paymentDetails } = req.body;
  
  if (!paymentMethod) {
    return next(new ErrorResponse('Please provide a payment method', 400));
  }

  const paymentService = new PaymentService(paymentMethod);
  const result = await paymentService.processPayment(
    amount,
    currency,
    req.params.bookingId,
    req.user,
    paymentDetails
  );

  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Verify payment
// @route   GET /api/v1/payments/verify/:paymentId
// @access  Public (for webhooks) and Private
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.paymentId);
  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }

  const paymentService = new PaymentService(payment.paymentMethod);
  const result = await paymentService.verifyPayment(payment._id, req.body);

  res.status(200).json(result);
});

// Add webhook handlers for each payment method
exports.chapaWebhook = asyncHandler(async (req, res, next) => {
  const signature = req.headers['x-chapa-signature'];
  if (!signature) {
    return next(new ErrorResponse('No signature provided', 400));
  }

  // Verify signature
  const hmac = crypto.createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
  
  if (signature !== digest) {
    return next(new ErrorResponse('Invalid signature', 400));
  }

  const { event, data } = req.body;
  const paymentService = new PaymentService('chapa');

  if (event === 'charge.complete') {
    const payment = await Payment.findOne({ 
      paymentReference: data.tx_ref,
      status: 'pending'
    });

    if (payment) {
      await paymentService.verifyPayment(payment._id, data);
    }
  }

  res.status(200).json({ success: true });
});

// Add similar webhook handlers for other payment methods
// ...

// @desc    Get supported payment methods
// @route   GET /api/v1/payments/methods
// @access  Public
exports.getPaymentMethods = asyncHandler(async (req, res, next) => {
  const methods = PaymentService.getSupportedPaymentMethods();
  res.status(200).json({
    success: true,
    count: methods.length,
    data: methods
  });
});
