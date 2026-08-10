const express = require('express')
const router = express.Router()
const importController = require('../../controllers/importController')

router.get('/jobs', importController.listJobs)
router.get('/jobs/:id', importController.getJob)
router.post('/google', importController.startGoogleImport)
router.post('/facebook', importController.startFacebookImport)

module.exports = router
