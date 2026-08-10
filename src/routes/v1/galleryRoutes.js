const express = require('express')
const router = express.Router()
const galleryController = require('../../controllers/galleryController')

// Public routes
router.get('/', galleryController.getAllImages)
router.get('/:id', galleryController.getImageById)

// Admin routes (would be protected with auth in production)
router.post('/', galleryController.createImage)
router.put('/:id', galleryController.updateImage)
router.delete('/:id', galleryController.deleteImage)

module.exports = router