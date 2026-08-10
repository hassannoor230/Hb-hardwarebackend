const ImportJob = require('../models/ImportJob')
const { startGoogleImport, startFacebookImport, createDemoProducts } = require('../services/importService')

const importController = {
  listJobs: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1', 10))
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)))
      const skip = (page - 1) * limit
      const source = req.query.source || null

      const filter = {}
      if (source) filter.source = source

      const [jobs, total] = await Promise.all([
        ImportJob.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().catch(() => []),
        ImportJob.countDocuments(filter).catch(() => 0)
      ])

      res.json({
        success: true,
        data: jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.max(1, Math.ceil(total / limit))
        }
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch import jobs', error: error.message })
    }
  },

  getJob: async (req, res) => {
    try {
      const job = await ImportJob.findById(req.params.id).lean()
      if (!job) return res.status(404).json({ success: false, message: 'Import job not found' })
      res.json({ success: true, data: job })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch import job', error: error.message })
    }
  },

  startGoogleImport: async (req, res) => {
    try {
      const { sourceUrl, label } = req.body
      if (!sourceUrl || typeof sourceUrl !== 'string') {
        return res.status(400).json({ success: false, message: 'sourceUrl is required' })
      }

      const job = await ImportJob.create({
        source: 'google',
        sourceUrl,
        sourceLabel: label || null,
        status: 'queued',
        initiatedBy: req.user?.email || null
      })

      res.status(202).json({ success: true, data: job, message: 'Google import job created' })

      const googleKey = process.env.GOOGLE_MAPS_API_KEY
      const aiKey = process.env.AI_API_KEY

      try {
        if (!googleKey || googleKey.includes('your-') || !aiKey || aiKey.includes('your-')) {
          await createDemoProducts(job._id, 'google', sourceUrl)
        } else {
          await startGoogleImport(job._id)
        }
      } catch (backgroundError) {
        console.error('Background Google import failed:', backgroundError)
        await ImportJob.findByIdAndUpdate(job._id, {
          status: 'failed',
          completedAt: new Date(),
          errorMessages: [backgroundError.message]
        }).catch(() => {})
      }
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to start Google import', error: error.message })
    }
  },

  startFacebookImport: async (req, res) => {
    try {
      const { sourceUrl, label, manualContent } = req.body

      if (!manualContent || !manualContent.trim()) {
        return res.status(400).json({ success: false, message: 'manualContent is required for Facebook import' })
      }

      const job = await ImportJob.create({
        source: 'facebook',
        sourceUrl: sourceUrl || null,
        sourceLabel: label || null,
        status: 'queued',
        rawPayload: { manualContent },
        initiatedBy: req.user?.email || null
      })

      res.status(202).json({ success: true, data: job, message: 'Facebook import job created' })

      const aiKey = process.env.AI_API_KEY

      try {
        if (!aiKey || aiKey.includes('your-')) {
          await createDemoProducts(job._id, 'facebook', sourceUrl)
        } else {
          await startFacebookImport(job._id)
        }
      } catch (backgroundError) {
        console.error('Background Facebook import failed:', backgroundError)
        await ImportJob.findByIdAndUpdate(job._id, {
          status: 'failed',
          completedAt: new Date(),
          errorMessages: [backgroundError.message]
        }).catch(() => {})
      }
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to start Facebook import', error: error.message })
    }
  }
}

module.exports = importController
