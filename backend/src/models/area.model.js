const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AreaSchema = new Schema({
  areaCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  boundary: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]],
      required: true
    }
  },
  counsellor: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
        trim: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      office: {
        type: String,
        required: true,
        trim: true
      }
    }
  },
  statistics: {
    totalIssues: {
      type: Number,
      default: 0
    },
    resolvedIssues: {
      type: Number,
      default: 0
    },
    pendingIssues: {
      type: Number,
      default: 0
    },
    highPriorityIssues: {
      type: Number,
      default: 0
    },
    redZoneIssues: {
      type: Number,
      default: 0
    },
    averageResolutionTime: {
      type: Number,
      default: 0
    }
  },
  topCategories: [{
    category: {
      type: String,
      required: true,
      trim: true
    },
    count: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Add GeoJSON index for efficient queries on location
AreaSchema.index({ boundary: '2dsphere' });

const Area = mongoose.model('Area', AreaSchema);

module.exports = Area;