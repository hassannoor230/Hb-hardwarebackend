const GalleryImage = require('../models/GalleryImage')
const { UPLOAD_DIR } = require('../config/constants')
const path = require('path')
const fs = require('fs')

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      })
    }

    const { title, description, category, altText } = req.body

    const imageData = {
      title: title || path.basename(req.file.filename, path.extname(req.file.filename)),
      description: description || '',
      category: category || 'other',
      altText: altText || title || 'Gallery image',
      imageUrl: `/uploads/${req.file.filename}`,
      thumbnailUrl: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user?.email || 'admin'
    }

    const image = await GalleryImage.create(imageData)

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image
    })
  } catch (error) {
    console.error('Upload image error:', error)
    // Clean up uploaded file if database save fails
    if (req.file) {
      const filePath = path.join(UPLOAD_DIR, req.file.filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    })
  }
}

exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      })
    }

    const { category } = req.body
    const images = []

    for (const file of req.files) {
      const title = path.basename(file.filename, path.extname(file.filename))
      const imageData = {
        title: title,
        description: '',
        category: category || 'other',
        altText: title,
        imageUrl: `/uploads/${file.filename}`,
        thumbnailUrl: `/uploads/${file.filename}`,
        size: file.size,
        mimeType: file.mimetype,
        uploadedBy: req.user?.email || 'admin'
      }
      const image = await GalleryImage.create(imageData)
      images.push(image)
    }

    res.status(201).json({
      success: true,
      message: `${images.length} images uploaded successfully`,
      data: images
    })
  } catch (error) {
    console.error('Upload multiple images error:', error)
    // Clean up uploaded files if database save fails
    if (req.files) {
      for (const file of req.files) {
        const filePath = path.join(UPLOAD_DIR, file.filename)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }
    }
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    })
  }
}

exports.deleteUploadedImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id)
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      })
    }

    // Delete file from filesystem
    const filePath = path.join(UPLOAD_DIR, path.basename(image.imageUrl))
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await image.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    })
  } catch (error) {
    console.error('Delete image error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    })
  }
}