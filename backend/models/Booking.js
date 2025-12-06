const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Please select a room']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please specify a user']
  },
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'Guest',
    required: [true, 'Please specify a guest']
  },
  checkInDate: {
    type: Date,
    required: [true, 'Please add a check-in date']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Please add a check-out date']
  },
  adults: {
    type: Number,
    required: [true, 'Please specify number of adults'],
    min: [1, 'At least one adult is required'],
    default: 1
  },
  children: {
    type: Number,
    default: 0,
    min: 0
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'],
    default: 'confirmed'
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please add the total amount']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially-paid', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit-card', 'debit-card', 'bank-transfer', 'mobile-money', 'other'],
    default: 'cash'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    amountPaid: Number,
    paymentNotes: String
  },
  source: {
    type: String,
    enum: ['website', 'walk-in', 'phone', 'travel-agent', 'other'],
    default: 'walk-in'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  cancellationDate: Date,
  cancellationReason: String,
  cancellationFee: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  checkInTime: Date,
  checkOutTime: Date,
  earlyCheckIn: {
    type: Boolean,
    default: false
  },
  lateCheckOut: {
    type: Boolean,
    default: false
  },
  roomServiceRequests: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'RoomService'
    }
  ],
  services: [
    {
      service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      total: Number,
      date: {
        type: Date,
        default: Date.now
      },
      notes: String
    }
  ]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent double booking
BookingSchema.index(
  { room: 1, checkInDate: 1, checkOutDate: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

// Calculate total amount before saving
BookingSchema.pre('save', async function(next) {
  // Only run this function if checkInDate or checkOutDate was modified
  if (!this.isModified('checkInDate') && !this.isModified('checkOutDate')) {
    return next();
  }

  // Calculate number of nights
  const days = Math.ceil(
    (new Date(this.checkOutDate) - new Date(this.checkInDate)) / (1000 * 60 * 60 * 24)
  );

  // Get room price
  const Room = mongoose.model('Room');
  const room = await Room.findById(this.room);
  
  // Calculate total amount
  this.totalAmount = room.price * days;

  // Calculate services total if any
  if (this.services && this.services.length > 0) {
    const servicesTotal = this.services.reduce(
      (total, service) => total + (service.quantity * service.price),
      0
    );
    this.totalAmount += servicesTotal;
  }

  next();
});

// Static method to get monthly revenue
BookingSchema.statics.getMonthlyRevenue = async function() {
  const now = new Date();
  const lastYear = new Date(now.setFullYear(now.getFullYear() - 1));

  const data = await this.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
        amount: "$totalAmount"
      },
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  return data;
};

// Call getMonthlyRevenue after save
BookingSchema.post('save', function() {
  this.constructor.getMonthlyRevenue();
});

// Reverse populate with virtuals
BookingSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'booking',
  justOne: false
});

// Calculate total paid amount
BookingSchema.virtual('paidAmount').get(function() {
  if (!this.payments) return 0;
  return this.payments.reduce((total, payment) => total + payment.amount, 0);
});

// Calculate balance
BookingSchema.virtual('balance').get(function() {
  return this.totalAmount - this.paidAmount;
});

// Check if booking is paid
BookingSchema.virtual('isFullyPaid').get(function() {
  return this.paidAmount >= this.totalAmount;
});

// Calculate number of nights
BookingSchema.virtual('nights').get(function() {
  return Math.ceil(
    (new Date(this.checkOutDate) - new Date(this.checkInDate)) / (1000 * 60 * 60 * 24)
  );
});

module.exports = mongoose.model('Booking', BookingSchema);
