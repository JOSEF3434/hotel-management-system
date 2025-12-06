const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: [true, 'Please specify a booking']
  },
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'Guest',
    required: [true, 'Please specify a guest']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please select a payment method'],
    enum: [
      'cash',
      'credit-card',
      'debit-card',
      'bank-transfer',
      'mobile-money',
      'voucher',
      'other'
    ]
  },
  paymentType: {
    type: String,
    required: [true, 'Please specify payment type'],
    enum: [
      'deposit',
      'partial',
      'full',
      'refund',
      'cancellation-fee',
      'no-show-fee',
      'damage-deposit',
      'service-charge',
      'other'
    ]
  },
  currency: {
    type: String,
    default: 'ETB',
    uppercase: true,
    maxlength: 3
  },
  exchangeRate: {
    type: Number,
    default: 1
  },
  transactionId: {
    type: String,
    required: [
      function() {
        return this.paymentMethod !== 'cash';
      },
      'Transaction ID is required for non-cash payments'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially-refunded', 'void'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  paymentDetails: {
    cardType: String,
    last4: String,
    authCode: String,
    paymentGateway: String,
    gatewayTransactionId: String,
    gatewayResponse: String
  },
  isRefundable: {
    type: Boolean,
    default: true
  },
  refundedAmount: {
    type: Number,
    default: 0
  },
  refundDate: Date,
  refundReason: String,
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  attachments: [
    {
      name: String,
      url: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  taxAmount: {
    type: Number,
    default: 0
  },
  serviceCharge: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  isCommissionable: {
    type: Boolean,
    default: false
  },
  commissionRate: {
    type: Number,
    default: 0
  },
  commissionAmount: {
    type: Number,
    default: 0
  },
  isSettled: {
    type: Boolean,
    default: false
  },
  settledDate: Date,
  customFields: {
    type: Map,
    of: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate receipt number before saving
PaymentSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const count = await this.constructor.countDocuments();
    this.receiptNumber = `RCPT-${Date.now()}-${count + 1}`;
  }
  
  // If payment is marked as completed, set the payment date to now
  if (this.isModified('status') && this.status === 'completed' && !this.paymentDate) {
    this.paymentDate = new Date();
  }
  
  // If payment is marked as refunded, set the refund date to now
  if (this.isModified('status') && (this.status === 'refunded' || this.status === 'partially-refunded') && !this.refundDate) {
    this.refundDate = new Date();
  }
  
  next();
});

// Update booking payment status after saving a payment
PaymentSchema.post('save', async function(doc) {
  const Booking = mongoose.model('Booking');
  const booking = await Booking.findById(doc.booking);
  
  if (!booking) return;
  
  // Get all payments for this booking
  const payments = await this.constructor.find({ booking: doc.booking });
  const totalPaid = payments.reduce((sum, payment) => {
    return payment.status === 'completed' ? sum + payment.amount : sum;
  }, 0);
  
  // Update booking payment status
  if (totalPaid >= booking.totalAmount) {
    booking.paymentStatus = 'paid';
  } else if (totalPaid > 0) {
    booking.paymentStatus = 'partially-paid';
  } else {
    booking.paymentStatus = 'pending';
  }
  
  // Update booking's paid amount
  booking.paymentDetails = booking.paymentDetails || {};
  booking.paymentDetails.amountPaid = totalPaid;
  booking.paymentDetails.lastPaymentDate = new Date();
  
  await booking.save();
});

// Update booking payment status after removing a payment
PaymentSchema.post('remove', async function(doc) {
  const Booking = mongoose.model('Booking');
  const booking = await Booking.findById(doc.booking);
  
  if (!booking) return;
  
  // Get all remaining payments for this booking
  const payments = await this.constructor.find({ 
    booking: doc.booking,
    _id: { $ne: doc._id } // Exclude the deleted payment
  });
  
  const totalPaid = payments.reduce((sum, payment) => {
    return payment.status === 'completed' ? sum + payment.amount : sum;
  }, 0);
  
  // Update booking payment status
  if (totalPaid >= booking.totalAmount) {
    booking.paymentStatus = 'paid';
  } else if (totalPaid > 0) {
    booking.paymentStatus = 'partially-paid';
  } else {
    booking.paymentStatus = 'pending';
  }
  
  // Update booking's paid amount
  booking.paymentDetails = booking.paymentDetails || {};
  booking.paymentDetails.amountPaid = totalPaid;
  
  await booking.save();
});

// Static method to get payment statistics
PaymentSchema.statics.getPaymentStats = async function() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  
  const [daily, monthly, yearly] = await Promise.all([
    this.aggregate([
      {
        $match: {
          paymentDate: { $gte: startOfDay },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' },
          byMethod: { $push: { method: '$paymentMethod', amount: '$amount' } }
        }
      },
      {
        $unwind: '$byMethod'
      },
      {
        $group: {
          _id: '$byMethod.method',
          total: { $sum: '$byMethod.amount' },
          count: { $sum: 1 },
          average: { $avg: '$byMethod.amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]),
    
    this.aggregate([
      {
        $match: {
          paymentDate: { $gte: startOfMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: '$paymentDate' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]),
    
    this.aggregate([
      {
        $match: {
          paymentDate: { $gte: startOfYear },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $month: '$paymentDate' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
  ]);
  
  return { daily, monthly, yearly };
};

module.exports = mongoose.model('Payment', PaymentSchema);
