const mongoose = require('mongoose')

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [200, 'Question cannot exceed 200 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'products', 'services', 'delivery', 'payment', 'other'],
    default: 'general'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes
faqSchema.index({ isActive: 1, order: 1 })
faqSchema.index({ category: 1 })
faqSchema.index({ question: 'text' })
faqSchema.index({ createdAt: -1 })

const FAQ = mongoose.model('FAQ', faqSchema)

module.exports = FAQ