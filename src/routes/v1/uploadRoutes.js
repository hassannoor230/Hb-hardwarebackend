const express = require('express')
const router = express.Router()
const uploadController = require('../../controllers/uploadController')
const { uploadSingle, uploadMultiple, handleUploadError } = require('../../middleware/upload')
const { protect, adminOnly } = require('../../middleware/auth')

// Protected routes (admin only)
router.post('/single', 
  protect, 
  adminOnly, 
  uploadSingle, 
  handleUploadError, 
  uploadController.uploadImage
)

router.post('/multiple', 
  protect, 
  adminOnly, 
  uploadMultiple, 
  handleUploadError, 
  uploadController.uploadMultipleImages
)

router.delete('/:id', 
  protect, 
  adminOnly, 
  uploadController.deleteUploadedImage
)

module.exports = router