const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number'],
    unique: true,
    trim: true,
    maxlength: [10, 'Room number cannot be more than 10 characters']
  },
  roomType: {
    type: String,
    required: [true, 'Please select a room type'],
    enum: [
      'Single',
      'Double',
      'Deluxe',
      'Suite',
      'Executive Suite',
      'Presidential Suite'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Please add a price per night'],
    min: [0, 'Price cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add room capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  amenities: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'cleaning'],
    default: 'available'
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    set: val => Math.round(val * 10) / 10 // Rounds to 1 decimal place
  },
  numberOfReviews: {
    type: Number,
    default: 0
  },
  floor: {
    type: Number,
    required: [true, 'Please specify the floor number']
  },
  view: {
    type: String,
    enum: ['city', 'garden', 'pool', 'mountain', 'sea', 'none'],
    default: 'none'
  },
  isSmoking: {
    type: Boolean,
    default: false
  },
  bedType: {
    type: String,
    enum: ['single', 'double', 'queen', 'king', 'twin', 'bunk'],
    required: true
  },
  size: {
    type: Number,
    required: [true, 'Please add room size in square meters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastCleaned: {
    type: Date
  },
  nextCleaning: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete bookings when a room is deleted
RoomSchema.pre('remove', async function(next) {
  console.log(`Bookings being removed for room ${this._id}`);
  await this.model('Booking').deleteMany({ room: this._id });
  next();
});

// Reverse populate with virtuals
RoomSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'room',
  justOne: false
});

// Static method to get average room price
RoomSchema.statics.getAverageCost = async function() {
  const obj = await this.aggregate([
    {
      $group: {
        _id: '$roomType',
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        count: { $sum: 1 }
      }
    }
  ]);

  try {
    // You can save this data to another collection if needed
    return obj;
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
RoomSchema.post('save', function() {
  this.constructor.getAverageCost();
});

// Call getAverageCost before remove
RoomSchema.pre('remove', function() {
  this.constructor.getAverageCost();
});

module.exports = mongoose.model('Room', RoomSchema);
