const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [120, 'Service name cannot exceed 120 characters']
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'PKR',
    uppercase: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['manual', 'google', 'facebook', 'ai_import', null],
    default: 'manual'
  },
  sourceUrl: {
    type: String,
    trim: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'archived'],
    default: 'approved'
  },
  importJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ImportJob',
    index: true
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: String,
    trim: true
  },
  reviewedNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Reviewed notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

serviceSchema.index({ status: 1, category: 1, createdAt: -1 })
serviceSchema.index({ source: 1, sourceUrl: 1 })

serviceSchema.virtual('displayPrice').get(function () {
  if (this.price === null || this.price === undefined) return 'Price on request'
  return `${this.currency || 'PKR'} ${this.price.toLocaleString()}`
})

function buildSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

serviceSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = buildSlug(this.name)
  }
  next()
})

serviceSchema.pre('insertMany', function (next, docs) {
  if (Array.isArray(docs)) {
    docs.forEach((doc) => {
      if (!doc.slug && doc.name) {
        doc.slug = buildSlug(doc.name)
      }
    })
  }
  next()
})

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service
