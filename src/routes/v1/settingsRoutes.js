const express = require('express')
const router = express.Router()
const settingsController = require('../../controllers/settingsController')

// Public routes
router.get('/site', settingsController.getSiteSettings)
router.get('/business', settingsController.getBusinessInfo)

// Admin routes (would be protected with auth in production)
router.put('/site', settingsController.updateSiteSettings)
router.put('/business', settingsController.updateBusinessInfo)

module.exports = router