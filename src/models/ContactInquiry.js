const mongoose = require('mongoose')

const contactInquirySchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'responded', 'archived'],
    default: 'pending'
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

// Index for faster queries
contactInquirySchema.index({ status: 1, createdAt: -1 })
contactInquirySchema.index({ email: 1 })
contactInquirySchema.index({ phone: 1 })
contactInquirySchema.index({ createdAt: -1 })

const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema)

module.exports = ContactInquiry