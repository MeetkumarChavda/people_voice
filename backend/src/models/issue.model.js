const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  issueType: {
    type: String,
    enum: ["public"],
    required: true
  },
  category: {
    type: String,
    enum: [
      "infrastructure", "publicSafety", "environmental",
      "governmentServices", "socialWelfare", "publicTransportation",
      "plumbing", "electricity", "carpentry", "cleaning", "other"
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  reportedBy: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    areaCode: String
  },
  photos: [String], // Array of photo URLs
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "verified", "inProgress", "extended", "resolved", "rejected", "highPriority", "redZone"],
    default: "pending"
  },
  assignedTo: {
    role: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String
  },
  serviceProviders: [{
    providerId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceProvider'
    },
    name: String,
    contactInfo: String,
    selected: {
      type: Boolean,
      default: false
    }
  }],
  currentPhase: {
    type: String,
    enum: ["verification", "etaDeadline", "resolution"],
    default: "verification"
  },
  phaseDetails: {
    verification: {
      status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending"
      },
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      verificationDate: Date,
      comments: String
    },
    etaDeadline: {
      initialDeadline: Date,
      extendedDeadline: Date,
      isExtended: {
        type: Boolean,
        default: false
      },
      reason: String
    },
    resolution: {
      status: {
        type: String,
        enum: ["pending", "solved", "escalated"],
        default: "pending"
      },
      resolvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      resolutionDate: Date,
      proof: [String], // Array of proof image URLs
      comments: String
    }
  },
  escalationHistory: [{
    from: {
      role: String,
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    to: {
      role: String,
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    reason: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    upvotes: {
      type: Number,
      default: 0
    }
  }]
}, { timestamps: true });

// Add index for geospatial queries
IssueSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('Issue', IssueSchema);