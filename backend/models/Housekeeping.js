const mongoose = require('mongoose');

const HousekeepingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Please specify a room']
  },
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number']
  },
  roomType: {
    type: String,
    required: [true, 'Please specify room type']
  },
  status: {
    type: String,
    required: [true, 'Please specify status'],
    enum: [
      'requested',
      'assigned',
      'in-progress',
      'completed',
      'inspected',
      'delayed',
      'cancelled'
    ],
    default: 'requested'
  },
  type: {
    type: String,
    required: [true, 'Please specify task type'],
    enum: [
      'cleaning',
      'deep-cleaning',
      'maintenance',
      'inspection',
      'turn-down',
      'amenity-request',
      'other'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  assignedTo: [
    {
      staff: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      name: String,
      role: String
    }
  ],
  requestedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who requested this task']
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  scheduledStart: {
    type: Date,
    required: [
      function() {
        return this.type === 'maintenance' || this.type === 'inspection';
      },
      'Scheduled start time is required for maintenance and inspection tasks'
    ]
  },
  scheduledEnd: {
    type: Date,
    validate: {
      validator: function(value) {
        return !this.scheduledStart || value > this.scheduledStart;
      },
      message: 'End time must be after start time'
    }
  },
  actualStart: Date,
  actualEnd: Date,
  timeSpent: Number, // in minutes
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  issuesFound: [
    {
      description: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      reportedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      reportedAt: {
        type: Date,
        default: Date.now
      },
      resolved: {
        type: Boolean,
        default: false
      },
      resolvedAt: Date,
      resolvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      resolutionNotes: String
    }
  ],
  itemsUsed: [
    {
      item: String,
      quantity: {
        type: Number,
        min: [1, 'Quantity must be at least 1']
      },
      unit: String
    }
  ],
  beforeImages: [
    {
      url: String,
      caption: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  afterImages: [
    {
      url: String,
      caption: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  inspection: {
    inspectedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    inspectedAt: Date,
    passed: Boolean,
    notes: String,
    score: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: String,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']
    },
    daysOfWeek: [{
      type: Number,
      min: 0, // Sunday
      max: 6  // Saturday
    }],
    endDate: Date,
    occurrences: Number
  },
  nextOccurrence: Date,
  parentTask: {
    type: mongoose.Schema.ObjectId,
    ref: 'Housekeeping'
  },
  childTasks: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Housekeeping'
  }],
  customFields: {
    type: Map,
    of: String
  },
  completedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  completedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate time spent when actual end is set
HousekeepingSchema.pre('save', function(next) {
  if (this.isModified('actualEnd') && this.actualEnd && this.actualStart) {
    this.timeSpent = Math.round((this.actualEnd - this.actualStart) / 60000); // Convert to minutes
  }
  
  // Set room status based on task status
  if (this.isModified('status')) {
    this.wasNew = this.isNew;
    this.statusChanged = true;
  }
  
  next();
});

// Update room status when housekeeping task is saved
HousekeepingSchema.post('save', async function(doc) {
  const Room = mongoose.model('Room');
  
  if (doc.statusChanged) {
    let roomStatus;
    
    switch (doc.status) {
      case 'in-progress':
        roomStatus = 'cleaning';
        break;
      case 'completed':
      case 'inspected':
        roomStatus = 'available';
        break;
      case 'delayed':
        roomStatus = 'maintenance';
        break;
      default:
        return;
    }
    
    await Room.findByIdAndUpdate(doc.room, { status: roomStatus });
  }
});

// Static method to get housekeeping statistics
HousekeepingSchema.statics.getStats = async function() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  
  const [todayStats, weeklyStats, pendingTasks, staffPerformance] = await Promise.all([
    this.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgTime: { $avg: '$timeSpent' }
        }
      }
    ]),
    
    this.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          avgTime: { $avg: '$timeSpent' }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    
    this.aggregate([
      {
        $match: {
          status: { $in: ['requested', 'assigned', 'in-progress'] }
        }
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomDetails'
        }
      },
      { $unwind: '$roomDetails' },
      {
        $project: {
          roomNumber: 1,
          type: 1,
          status: 1,
          priority: 1,
          requestedAt: 1,
          'roomDetails.roomType': 1,
          'roomDetails.floor': 1,
          assignedTo: 1
        }
      },
      { $sort: { priority: -1, requestedAt: 1 } }
    ]),
    
    this.aggregate([
      {
        $match: {
          status: 'completed',
          'assignedTo.0': { $exists: true }
        }
      },
      { $unwind: '$assignedTo' },
      {
        $group: {
          _id: '$assignedTo.staff',
          staffName: { $first: '$assignedTo.name' },
          totalTasks: { $sum: 1 },
          avgTime: { $avg: '$timeSpent' },
          lastTask: { $last: '$updatedAt' },
          completedThisWeek: {
            $sum: {
              $cond: [
                { $gte: ['$updatedAt', startOfWeek] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { totalTasks: -1 } }
    ])
  ]);
  
  return {
    today: todayStats,
    weekly: weeklyStats,
    pending: pendingTasks,
    staffPerformance
  };
};

// Method to create a follow-up task
HousekeepingSchema.methods.createFollowUp = async function(userId, notes, scheduledDate) {
  const followUpTask = new this.constructor({
    room: this.room,
    roomNumber: this.roomNumber,
    roomType: this.roomType,
    type: this.type,
    priority: this.priority,
    requestedBy: userId,
    notes: notes || `Follow-up for task ${this._id}`,
    scheduledStart: scheduledDate || new Date(),
    parentTask: this._id,
    status: 'requested'
  });
  
  await followUpTask.save();
  
  // Add to child tasks
  this.childTasks.push(followUpTask._id);
  await this.save();
  
  return followUpTask;
};

// Virtual for task duration
HousekeepingSchema.virtual('duration').get(function() {
  if (this.actualStart && this.actualEnd) {
    return Math.round((this.actualEnd - this.actualStart) / 60000); // minutes
  }
  return null;
});

// Indexes for better query performance
HousekeepingSchema.index({ room: 1, status: 1 });
HousekeepingSchema.index({ status: 1, priority: 1 });
HousekeepingSchema.index({ 'assignedTo.staff': 1, status: 1 });
HousekeepingSchema.index({ scheduledStart: 1, scheduledEnd: 1 });

module.exports = mongoose.model('Housekeeping', HousekeepingSchema);
