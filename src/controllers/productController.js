const Product = require('../models/Product')

const productController = {
  listProducts: async (req, res) => {
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
        Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().catch(() => []),
        Product.countDocuments(filter).catch(() => 0)
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
      res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message })
    }
  },

  getProduct: async (req, res) => {
    try {
      const item = await Product.findOne({ slug: req.params.slug, status: 'approved' }).lean()
      if (!item) return res.status(404).json({ success: false, message: 'Product not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message })
    }
  },

  getProductById: async (req, res) => {
    try {
      const item = await Product.findById(req.params.id).lean()
      if (!item) return res.status(404).json({ success: false, message: 'Product not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch product', error: error.message })
    }
  },

  createProduct: async (req, res) => {
    try {
      const item = await Product.create(req.body)
      res.status(201).json({ success: true, data: item })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: 'Product with this slug or SKU already exists' })
      }
      res.status(400).json({ success: false, message: 'Failed to create product', error: error.message })
    }
  },

  updateProduct: async (req, res) => {
    try {
      const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!item) return res.status(404).json({ success: false, message: 'Product not found' })
      res.json({ success: true, data: item })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: 'Product with this slug or SKU already exists' })
      }
      res.status(400).json({ success: false, message: 'Failed to update product', error: error.message })
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const item = await Product.findByIdAndDelete(req.params.id)
      if (!item) return res.status(404).json({ success: false, message: 'Product not found' })
      res.json({ success: true, message: 'Product deleted' })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete product', error: error.message })
    }
  }
}

module.exports = productController
