const Product = require('../models/Product')
const Service = require('../models/Service')
const ImportJob = require('../models/ImportJob')

const adminImportController = {
  listPendingProducts: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1', 10))
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)))
      const skip = (page - 1) * limit

      const [items, total] = await Promise.all([
        Product.find({ status: { $in: ['pending', 'draft'] } }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Product.countDocuments({ status: { $in: ['pending', 'draft'] } })
      ])

      res.json({
        success: true,
        data: items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.max(1, Math.ceil(total / limit))
        }
      })
    } catch (error) {
      console.warn('Admin products list failed:', error.message)
      res.json({ success: true, data: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } })
    }
  },

  listPendingServices: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1', 10))
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)))
      const skip = (page - 1) * limit

      const [items, total] = await Promise.all([
        Service.find({ status: { $in: ['pending', 'draft'] } }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Service.countDocuments({ status: { $in: ['pending', 'draft'] } })
      ])

      res.json({
        success: true,
        data: items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.max(1, Math.ceil(total / limit))
        }
      })
    } catch (error) {
      console.warn('Admin services list failed:', error.message)
      res.json({ success: true, data: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } })
    }
  },

  approveProduct: async (req, res) => {
    try {
      const item = await Product.findByIdAndUpdate(
        req.params.id,
        { status: 'approved', approvedAt: new Date(), approvedBy: req.user?.email || 'admin' },
        { new: true }
      )
      if (!item) return res.status(404).json({ success: false, message: 'Product not found' })

      const job = item.importJob ? await ImportJob.findByIdAndUpdate(item.importJob, { $inc: { approvedCount: 1 } }, { new: true }) : null

      res.json({ success: true, data: item, job })
    } catch (error) {
      console.warn('Approve product failed:', error.message)
      res.status(400).json({ success: false, message: 'Failed to approve product', error: error.message })
    }
  },

  rejectProduct: async (req, res) => {
    try {
      const { notes } = req.body || {}
      const item = await Product.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected', reviewedNotes: notes || null },
        { new: true }
      )
      if (!item) return res.status(404).json({ success: false, message: 'Product not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      console.warn('Reject product failed:', error.message)
      res.status(400).json({ success: false, message: 'Failed to reject product', error: error.message })
    }
  },

  approveService: async (req, res) => {
    try {
      const item = await Service.findByIdAndUpdate(
        req.params.id,
        { status: 'approved', approvedAt: new Date(), approvedBy: req.user?.email || 'admin' },
        { new: true }
      )
      if (!item) return res.status(404).json({ success: false, message: 'Service not found' })

      const job = item.importJob ? await ImportJob.findByIdAndUpdate(item.importJob, { $inc: { approvedCount: 1 } }, { new: true }) : null

      res.json({ success: true, data: item, job })
    } catch (error) {
      console.warn('Approve service failed:', error.message)
      res.status(400).json({ success: false, message: 'Failed to approve service', error: error.message })
    }
  },

  rejectService: async (req, res) => {
    try {
      const { notes } = req.body || {}
      const item = await Service.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected', reviewedNotes: notes || null },
        { new: true }
      )
      if (!item) return res.status(404).json({ success: false, message: 'Service not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      console.warn('Reject service failed:', error.message)
      res.status(400).json({ success: false, message: 'Failed to reject service', error: error.message })
    }
  },

  getDashboardStats: async (req, res) => {
    try {
      const [
        pendingProducts,
        pendingServices,
        approvedProducts,
        approvedServices,
        recentJobs
      ] = await Promise.all([
        Product.countDocuments({ status: { $in: ['pending', 'draft'] } }).catch(() => 0),
        Service.countDocuments({ status: { $in: ['pending', 'draft'] } }).catch(() => 0),
        Product.countDocuments({ status: 'approved' }).catch(() => 0),
        Service.countDocuments({ status: 'approved' }).catch(() => 0),
        ImportJob.find().sort({ createdAt: -1 }).limit(5).lean().catch(() => [])
      ])

      res.json({
        success: true,
        data: {
          pendingProducts,
          pendingServices,
          approvedProducts,
          approvedServices,
          recentJobs
        }
      })
    } catch (error) {
      console.warn('Dashboard stats failed:', error.message)
      res.json({
        success: true,
        data: {
          pendingProducts: 0,
          pendingServices: 0,
          approvedProducts: 0,
          approvedServices: 0,
          recentJobs: []
        }
      })
    }
  }
}

module.exports = adminImportController
