// File: routes/payments.js
const express = require('express');
const router = express.Router();
const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentStats,
  processPayment,
  verifyPayment,
  chapaWebhook,
  getPaymentMethods
} = require('../controllers/payments');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Payment = require('../models/Payment');

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(
    authorize('admin', 'receptionist'),
    advancedResults(Payment, {
      path: 'booking guest',
      select: 'bookingNumber firstName lastName'
    }),
    getPayments
  )
  .post(authorize('admin', 'receptionist'), createPayment);

router
  .route('/stats')
  .get(authorize('admin'), getPaymentStats);

router
  .route('/:id')
  .get(getPayment)
  .put(authorize('admin', 'receptionist'), updatePayment)
  .delete(authorize('admin'), deletePayment);

  router.route('/methods')
  .get(getPaymentMethods);

router.route('/process')
  .post(protect, processPayment);

router.route('/verify/:paymentId')
  .get(protect, verifyPayment);

// Webhook endpoints (no auth required)
router.route('/verify/chapa')
  .post(chapaWebhook);

// Add similar webhook routes for other payment methods
// ...

module.exports = router;