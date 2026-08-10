const mongoose = require('mongoose')

const quoteRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  productCategory: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'archived'],
    default: 'pending'
  },
  quoteAmount: {
    type: Number,
    min: 0
  },
  quoteDetails: {
    type: String,
    trim: true
  },
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
})

// Indexes
quoteRequestSchema.index({ status: 1, createdAt: -1 })
quoteRequestSchema.index({ email: 1 })
quoteRequestSchema.index({ phone: 1 })
quoteRequestSchema.index({ createdAt: -1 })

const QuoteRequest = mongoose.model('QuoteRequest', quoteRequestSchema)

module.exports = QuoteRequest