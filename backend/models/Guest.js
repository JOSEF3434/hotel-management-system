const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters'],
    required: [true, 'Please add a phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  dateOfBirth: {
    type: Date
  },
  idType: {
    type: String,
    enum: ['passport', 'national-id', 'driving-license', 'other'],
    required: [true, 'Please specify ID type']
  },
  idNumber: {
    type: String,
    required: [true, 'Please add ID number']
  },
  idExpiryDate: Date,
  nationality: String,
  company: {
    name: String,
    taxNumber: String,
    address: String
  },
  isVip: {
    type: Boolean,
    default: false
  },
  vipLevel: {
    type: String,
    enum: ['none', 'silver', 'gold', 'platinum'],
    default: 'none'
  },
  preferences: {
    roomType: String,
    floor: Number,
    amenities: [String],
    specialNeeds: String
  },
  marketingOptIn: {
    type: Boolean,
    default: false
  },
  isBlacklisted: {
    type: Boolean,
    default: false
  },
  blacklistReason: String,
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
  documents: [
    {
      type: {
        type: String,
        required: true,
        enum: ['id-front', 'id-back', 'visa', 'other']
      },
      url: {
        type: String,
        required: true
      },
      uploadDate: {
        type: Date,
        default: Date.now
      },
      notes: String
    }
  ],
  customFields: {
    type: Map,
    of: String
  },
  lastStay: Date,
  totalStays: {
    type: Number,
    default: 0
  },
  totalNights: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  tags: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create a compound index for faster search
GuestSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phone: 'text',
  'address.city': 'text',
  'address.country': 'text'
});

// Virtual for full name
GuestSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Virtual for age
GuestSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Cascade delete bookings when a guest is deleted
GuestSchema.pre('remove', async function(next) {
  console.log(`Bookings being removed for guest ${this._id}`);
  await this.model('Booking').deleteMany({ guest: this._id });
  next();
});

// Reverse populate with virtuals
GuestSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'guest',
  justOne: false
});

// Static method to get guest stats
GuestSchema.statics.getGuestStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$nationality',
        count: { $sum: 1 },
        totalNights: { $sum: '$totalNights' },
        totalSpent: { $sum: '$totalSpent' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  return stats;
};

// Update guest stats after saving a booking
GuestSchema.statics.updateGuestStats = async function(guestId, nights, amount) {
  await this.findByIdAndUpdate(guestId, {
    $inc: {
      totalStays: 1,
      totalNights: nights,
      totalSpent: amount
    },
    lastStay: Date.now()
  });
};

// Update guest stats after deleting a booking
GuestSchema.statics.revertGuestStats = async function(guestId, nights, amount) {
  await this.findByIdAndUpdate(guestId, {
    $inc: {
      totalStays: -1,
      totalNights: -nights,
      totalSpent: -amount
    }
  });
};

module.exports = mongoose.model('Guest', GuestSchema);
