const mongoose = require('mongoose')

const importJobSchema = new mongoose.Schema({
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: ['google', 'facebook', 'manual'],
    index: true
  },
  sourceUrl: {
    type: String,
    trim: true
  },
  sourceLabel: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed', 'partial_success'],
    default: 'queued',
    index: true
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  itemsFound: {
    type: Number,
    default: 0,
    min: 0
  },
  productsFound: {
    type: Number,
    default: 0,
    min: 0
  },
  servicesFound: {
    type: Number,
    default: 0,
    min: 0
  },
  duplicatesFound: {
    type: Number,
    default: 0,
    min: 0
  },
  approvedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  rejectedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  errorMessages: {
    type: [String],
    default: []
  },
  rawPayload: {
    type: mongoose.Schema.Types.Mixed
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  initiatedBy: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

importJobSchema.index({ createdAt: -1 })
importJobSchema.index({ status: 1, createdAt: -1 })

const ImportJob = mongoose.model('ImportJob', importJobSchema)

module.exports = ImportJob
