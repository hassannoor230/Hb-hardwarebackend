const express = require('express')
const router = express.Router()
const adminImportController = require('../../controllers/adminImportController')
const { protect, adminOnly } = require('../../middleware/auth')

router.get('/dashboard-stats', protect, adminOnly, adminImportController.getDashboardStats)
router.get('/pending-products', protect, adminOnly, adminImportController.listPendingProducts)
router.get('/pending-services', protect, adminOnly, adminImportController.listPendingServices)
router.put('/products/:id/approve', protect, adminOnly, adminImportController.approveProduct)
router.put('/products/:id/reject', protect, adminOnly, adminImportController.rejectProduct)
router.put('/services/:id/approve', protect, adminOnly, adminImportController.approveService)
router.put('/services/:id/reject', protect, adminOnly, adminImportController.rejectService)

module.exports = router
