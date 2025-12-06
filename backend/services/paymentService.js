// File: services/paymentService.js
const axios = require('axios');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const ErrorResponse = require('../utils/errorResponse');

class PaymentService {
  constructor(paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  async processPayment(amount, currency, bookingId, user, paymentDetails) {
    switch (this.paymentMethod) {
      case 'chapa':
        return this.processChapaPayment(amount, currency, bookingId, paymentDetails);
      case 'telebirr':
        return this.processTeleBirrPayment(amount, currency, bookingId, paymentDetails);
      case 'cbe':
        return this.processCBEPayment(amount, currency, bookingId, paymentDetails);
      case 'awash':
        return this.processAwashPayment(amount, currency, bookingId, paymentDetails);
      case 'cash':
        return this.processCashPayment(amount, currency, bookingId, user, paymentDetails);
      default:
        throw new ErrorResponse(`Unsupported payment method: ${this.paymentMethod}`, 400);
    }
  }

  async processChapaPayment(amount, currency, bookingId, paymentDetails) {
    try {
      const booking = await Booking.findById(bookingId).populate('guest');
      if (!booking) {
        throw new ErrorResponse('Booking not found', 404);
      }

      const txRef = `chapa-${Date.now()}-${bookingId}`;
      const callbackUrl = `${process.env.APP_URL}/api/v1/payments/verify/chapa`;

      const response = await axios.post(
        'https://api.chapa.co/v1/transaction/initialize',
        {
          amount: amount.toString(),
          currency: currency || 'ETB',
          tx_ref: txRef,
          return_url: callbackUrl,
          'customization[title]': 'Hotel Booking Payment',
          'customization[description]': `Payment for booking #${booking.bookingNumber}`,
          customer: {
            first_name: booking.guest.firstName,
            last_name: booking.guest.lastName,
            email: booking.guest.email,
            phone_number: booking.guest.phone
          },
          meta: {
            bookingId: bookingId.toString()
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Create pending payment record
      const payment = await Payment.create({
        booking: bookingId,
        guest: booking.guest._id,
        amount,
        currency: currency || 'ETB',
        paymentMethod: 'chapa',
        paymentReference: txRef,
        status: 'pending',
        paymentDetails: {
          chapaResponse: response.data
        }
      });

      return {
        success: true,
        checkoutUrl: response.data.data.checkout_url,
        paymentId: payment._id
      };
    } catch (error) {
      console.error('Chapa payment error:', error.response?.data || error.message);
      throw new ErrorResponse(
        error.response?.data?.message || 'Payment processing failed',
        error.response?.status || 500
      );
    }
  }

  async processTeleBirrPayment(amount, currency, bookingId, paymentDetails) {
    // TeleBirr integration would go here
    // This is a placeholder implementation
    const payment = await Payment.create({
      booking: bookingId,
      amount,
      currency: currency || 'ETB',
      paymentMethod: 'telebirr',
      paymentReference: `telebirr-${Date.now()}-${bookingId}`,
      status: 'pending',
      paymentDetails
    });

    // In a real implementation, this would return the TeleBirr payment URL
    return {
      success: true,
      message: 'Redirect to TeleBirr payment',
      paymentId: payment._id
    };
  }

  async processCBEPayment(amount, currency, bookingId, paymentDetails) {
    // CBE (Commercial Bank of Ethiopia) integration
    // This is a simplified example
    const payment = await Payment.create({
      booking: bookingId,
      amount,
      currency: currency || 'ETB',
      paymentMethod: 'cbe',
      paymentReference: `cbe-${Date.now()}-${bookingId}`,
      status: 'pending',
      paymentDetails
    });

    // In a real implementation, this would integrate with CBE's API
    return {
      success: true,
      message: 'CBE payment initiated',
      paymentId: payment._id
    };
  }

  async processAwashPayment(amount, currency, bookingId, paymentDetails) {
    // Awash Bank integration
    const payment = await Payment.create({
      booking: bookingId,
      amount,
      currency: currency || 'ETB',
      paymentMethod: 'awash',
      paymentReference: `awash-${Date.now()}-${bookingId}`,
      status: 'pending',
      paymentDetails
    });

    // In a real implementation, this would integrate with Awash Bank's API
    return {
      success: true,
      message: 'Awash Bank payment initiated',
      paymentId: payment._id
    };
  }

  async processCashPayment(amount, currency, bookingId, user, paymentDetails) {
    const payment = await Payment.create({
      booking: bookingId,
      amount,
      currency: currency || 'ETB',
      paymentMethod: 'cash',
      paymentReference: `cash-${Date.now()}-${bookingId}`,
      status: 'completed',
      processedBy: user.id,
      paymentDetails
    });

    // Update booking payment status
    await this.updateBookingPaymentStatus(bookingId);

    return {
      success: true,
      paymentId: payment._id,
      payment
    };
  }

  async verifyPayment(paymentId, verificationData) {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new ErrorResponse('Payment not found', 404);
    }

    switch (payment.paymentMethod) {
      case 'chapa':
        return this.verifyChapaPayment(payment, verificationData);
      case 'telebirr':
        return this.verifyTeleBirrPayment(payment, verificationData);
      case 'cbe':
        return this.verifyCBEPayment(payment, verificationData);
      case 'awash':
        return this.verifyAwashPayment(payment, verificationData);
      default:
        throw new ErrorResponse('Unsupported payment method for verification', 400);
    }
  }

  async verifyChapaPayment(payment, verificationData) {
    try {
      const response = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${payment.paymentReference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
          }
        }
      );

      if (response.data.status === 'success') {
        payment.status = 'completed';
        payment.paymentDetails.verification = response.data;
        await payment.save();

        // Update booking payment status
        await this.updateBookingPaymentStatus(payment.booking);

        return {
          success: true,
          payment,
          verified: true
        };
      } else {
        payment.status = 'failed';
        payment.paymentDetails.verification = response.data;
        await payment.save();

        return {
          success: false,
          payment,
          verified: false,
          message: 'Payment verification failed'
        };
      }
    } catch (error) {
      console.error('Chapa verification error:', error.response?.data || error.message);
      throw new ErrorResponse(
        error.response?.data?.message || 'Payment verification failed',
        error.response?.status || 500
      );
    }
  }

  // Other verification methods would be implemented similarly
  async verifyTeleBirrPayment(payment, verificationData) {
    // TeleBirr verification logic
    payment.status = 'completed'; // Update based on actual verification
    await payment.save();
    await this.updateBookingPaymentStatus(payment.booking);
    return { success: true, payment, verified: true };
  }

  async verifyCBEPayment(payment, verificationData) {
    // CBE verification logic
    payment.status = 'completed'; // Update based on actual verification
    await payment.save();
    await this.updateBookingPaymentStatus(payment.booking);
    return { success: true, payment, verified: true };
  }

  async verifyAwashPayment(payment, verificationData) {
    // Awash Bank verification logic
    payment.status = 'completed'; // Update based on actual verification
    await payment.save();
    await this.updateBookingPaymentStatus(payment.booking);
    return { success: true, payment, verified: true };
  }

  async updateBookingPaymentStatus(bookingId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) return;

    const payments = await Payment.find({
      booking: bookingId,
      status: 'completed'
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const amountDue = booking.totalAmount - totalPaid;

    if (amountDue <= 0) {
      booking.paymentStatus = 'paid';
      booking.paidAt = Date.now();
    } else if (totalPaid > 0) {
      booking.paymentStatus = 'partially_paid';
    } else {
      booking.paymentStatus = 'pending';
    }

    await booking.save();
    return booking;
  }

  static getSupportedPaymentMethods() {
    return [
      { id: 'chapa', name: 'Chapa', description: 'Pay with Chapa (Cards, Mobile Money, etc.)' },
      { id: 'telebirr', name: 'TeleBirr', description: 'Pay with TeleBirr Mobile Money' },
      { id: 'cbe', name: 'CBE', description: 'Pay with Commercial Bank of Ethiopia' },
      { id: 'awash', name: 'Awash Bank', description: 'Pay with Awash Bank' },
      { id: 'cash', name: 'Cash', description: 'Pay with cash at the hotel' }
    ];
  }
}

module.exports = PaymentService;