const express = require('express')
const router = express.Router()
const serviceController = require('../../controllers/serviceController')

router.get('/', serviceController.listServices)
router.get('/slug/:slug', serviceController.getService)
router.get('/:id', serviceController.getServiceById)

module.exports = router
