const express = require('express')
const router = express.Router()
const galleryController = require('../../controllers/galleryController')
const { protect, adminOnly } = require('../../middleware/auth')

router.get('/', galleryController.getAllImages)
router.get('/:id', galleryController.getImageById)

router.post('/', protect, adminOnly, galleryController.createImage)
router.put('/:id', protect, adminOnly, galleryController.updateImage)
router.delete('/:id', protect, adminOnly, galleryController.deleteImage)

module.exports = router
