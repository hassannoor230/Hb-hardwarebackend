const express = require('express')
const router = express.Router()

// Import routes
const contactRoutes = require('./v1/contactRoutes')
const quoteRoutes = require('./v1/quoteRoutes')
const galleryRoutes = require('./v1/galleryRoutes')
const faqRoutes = require('./v1/faqRoutes')
const settingsRoutes = require('./v1/settingsRoutes')
const uploadRoutes = require('./v1/uploadRoutes')
const productRoutes = require('./v1/productRoutes')
const serviceRoutes = require('./v1/serviceRoutes')
const importRoutes = require('./v1/importRoutes')
const adminRoutes = require('./v1/adminRoutes')
const adminAuthRoutes = require('./v1/adminAuthRoutes')

// Register routes
router.use('/contact', contactRoutes)
router.use('/quotes', quoteRoutes)
router.use('/gallery', galleryRoutes)
router.use('/faq', faqRoutes)
router.use('/settings', settingsRoutes)
router.use('/upload', uploadRoutes)
router.use('/products', productRoutes)
router.use('/services', serviceRoutes)
router.use('/import', importRoutes)
router.use('/admin', adminRoutes)
router.use('/admin', adminAuthRoutes)

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

module.exports = router
