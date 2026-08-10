const path = require('path')

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV === 'production'
const tempUploadDir = process.env.UPLOAD_DIR || path.join(process.env.TMPDIR || '/tmp', 'uploads')

module.exports = {
  // Upload directories
  UPLOAD_DIR: process.env.UPLOAD_DIR || (isVercel ? tempUploadDir : path.join(__dirname, '../../../uploads')),
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  
  // File types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  
  // Pagination defaults
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  
  // Status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  },
  
  // Contact statuses
  CONTACT_STATUS: {
    PENDING: 'pending',
    READ: 'read',
    RESPONDED: 'responded',
    ARCHIVED: 'archived'
  },
  
  // Quote statuses
  QUOTE_STATUS: {
    PENDING: 'pending',
    REVIEWING: 'reviewing',
    QUOTED: 'quoted',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    ARCHIVED: 'archived'
  },
  
  // Gallery categories
  GALLERY_CATEGORIES: ['store', 'products', 'showroom', 'events', 'other'],
  
  // FAQ categories
  FAQ_CATEGORIES: ['general', 'products', 'services', 'delivery', 'payment', 'other'],
  
  // Product categories
  PRODUCT_CATEGORIES: [
    'Construction Hardware',
    'Door Hardware',
    'Cabinet Hardware',
    'Bathroom Hardware',
    'Kitchen Hardware',
    'Tools & Equipment',
    'Fasteners',
    'Safety Equipment',
    'Other'
  ]
}