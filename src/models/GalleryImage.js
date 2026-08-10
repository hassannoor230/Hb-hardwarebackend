const mongoose = require('mongoose')

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  thumbnailUrl: {
    type: String
  },
  category: {
    type: String,
    enum: ['store', 'products', 'showroom', 'events', 'other'],
    default: 'other'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  altText: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: String
  },
  size: {
    type: Number
  },
  mimeType: {
    type: String
  }
}, {
  timestamps: true
})

// Indexes
galleryImageSchema.index({ isActive: 1, order: 1 })
galleryImageSchema.index({ category: 1 })
galleryImageSchema.index({ createdAt: -1 })

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema)

module.exports = GalleryImage