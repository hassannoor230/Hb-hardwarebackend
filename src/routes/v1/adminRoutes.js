const express = require('express')
const router = express.Router()
const adminImportController = require('../../controllers/adminImportController')

router.get('/dashboard-stats', adminImportController.getDashboardStats)
router.get('/pending-products', adminImportController.listPendingProducts)
router.get('/pending-services', adminImportController.listPendingServices)
router.put('/products/:id/approve', adminImportController.approveProduct)
router.put('/products/:id/reject', adminImportController.rejectProduct)
router.put('/services/:id/approve', adminImportController.approveService)
router.put('/services/:id/reject', adminImportController.rejectService)

module.exports = router
