const Service = require('../models/Service')

const serviceController = {
  listServices: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1', 10))
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)))
      const skip = (page - 1) * limit
      const category = req.query.category || null
      const search = req.query.search || null

      const filter = { status: 'approved' }
      if (category) filter.category = category
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      }

      const [items, total] = await Promise.all([
        Service.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().catch(() => []),
        Service.countDocuments(filter).catch(() => 0)
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
      res.status(500).json({ success: false, message: 'Failed to fetch services', error: error.message })
    }
  },

  getService: async (req, res) => {
    try {
      const item = await Service.findOne({ slug: req.params.slug, status: 'approved' }).lean()
      if (!item) return res.status(404).json({ success: false, message: 'Service not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch service', error: error.message })
    }
  },

  getServiceById: async (req, res) => {
    try {
      const item = await Service.findById(req.params.id).lean()
      if (!item) return res.status(404).json({ success: false, message: 'Service not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch service', error: error.message })
    }
  },

  createService: async (req, res) => {
    try {
      const item = await Service.create(req.body)
      res.status(201).json({ success: true, data: item })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: 'Service with this slug already exists' })
      }
      res.status(400).json({ success: false, message: 'Failed to create service', error: error.message })
    }
  },

  updateService: async (req, res) => {
    try {
      const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!item) return res.status(404).json({ success: false, message: 'Service not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: 'Service with this slug already exists' })
      }
      res.status(400).json({ success: false, message: 'Failed to update service', error: error.message })
    }
  },

  deleteService: async (req, res) => {
    try {
      const item = await Service.findByIdAndDelete(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'Service not found' })
      res.json({ success: true, message: 'Service deleted' })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete service', error: error.message })
    }
  }
}

module.exports = serviceController
