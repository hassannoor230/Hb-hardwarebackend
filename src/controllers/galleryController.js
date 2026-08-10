const GalleryImage = require('../models/GalleryImage')

exports.getAllImages = async (req, res) => {
    try {
        const images = await GalleryImage.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
        res.status(200).json({ data: images })
    } catch (error) {
        console.error('Get gallery images error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch gallery images', error: error.message })
    }
}

exports.getImageById = async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id)
        if (!image) {
            return res.status(404).json({ success: false, message: 'Gallery image not found' })
        }
        res.status(200).json({ data: image })
    } catch (error) {
        console.error('Get gallery image error:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch gallery image', error: error.message })
    }
}

exports.createImage = async (req, res) => {
    try {
        const image = await GalleryImage.create(req.body)
        res.status(201).json({ message: 'Gallery image created successfully', data: image })
    } catch (error) {
        console.error('Create gallery image error:', error)
        res.status(500).json({ success: false, message: 'Failed to create gallery image', error: error.message })
    }
}

exports.updateImage = async (req, res) => {
    try {
        const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!image) {
            return res.status(404).json({ success: false, message: 'Gallery image not found' })
        }
        res.status(200).json({ message: 'Gallery image updated successfully', data: image })
    } catch (error) {
        console.error('Update gallery image error:', error)
        res.status(500).json({ success: false, message: 'Failed to update gallery image', error: error.message })
    }
}

exports.deleteImage = async (req, res) => {
    try {
        const image = await GalleryImage.findByIdAndDelete(req.params.id)
        if (!image) {
            return res.status(404).json({ success: false, message: 'Gallery image not found' })
        }
        res.status(200).json({ message: 'Gallery image deleted successfully' })
    } catch (error) {
        console.error('Delete gallery image error:', error)
        res.status(500).json({ success: false, message: 'Failed to delete gallery image', error: error.message })
    }
}
