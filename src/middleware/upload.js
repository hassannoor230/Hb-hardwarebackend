const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, UPLOAD_DIR } = require('../config/constants')

// Ensure upload directory exists in a serverless-safe way
try {
  if (!UPLOAD_DIR) {
    throw new Error('UPLOAD_DIR is not configured')
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true, mode: 0o755 })
  }
} catch (error) {
  console.warn(`Warning: Could not create upload directory ${UPLOAD_DIR}:`, error.message)
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

// File filter
const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false)
  }
}

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
})

// Single file upload middleware
const uploadSingle = upload.single('image')

// Multiple files upload middleware
const uploadMultiple = upload.array('images', 10)

// Error handler for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      })
    }
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
  next(err)
}

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError
}