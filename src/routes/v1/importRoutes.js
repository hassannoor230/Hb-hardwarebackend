const express = require('express')
const router = express.Router()
const importController = require('../../controllers/importController')
const { protect, adminOnly } = require('../../middleware/auth')

router.get('/jobs', protect, adminOnly, importController.listJobs)
router.get('/jobs/:id', protect, adminOnly, importController.getJob)
router.post('/google', protect, adminOnly, importController.startGoogleImport)
router.post('/facebook', protect, adminOnly, importController.startFacebookImport)

module.exports = router
