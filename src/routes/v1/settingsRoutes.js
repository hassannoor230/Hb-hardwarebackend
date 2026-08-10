const express = require('express')
const router = express.Router()
const settingsController = require('../../controllers/settingsController')
const { protect, adminOnly } = require('../../middleware/auth')

router.get('/site', settingsController.getSiteSettings)
router.get('/business', settingsController.getBusinessInfo)

router.put('/site', protect, adminOnly, settingsController.updateSiteSettings)
router.put('/business', protect, adminOnly, settingsController.updateBusinessInfo)

module.exports = router
