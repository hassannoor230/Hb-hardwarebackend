const FAQ = require('../models/FAQ')

exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body)
    res.status(201).json({
      message: 'FAQ created successfully',
      data: faq
    })
  } catch (error) {
    console.error('Create FAQ error:', error)
    res.status(500).json({ 
      message: 'Failed to create FAQ',
      error: error.message 
    })
  }
}

exports.getAllFAQs = async (req, res) => {
  try {
    const { category, isActive, page = 1, limit = 20 } = req.query
    
    const query = {}
    if (category) query.category = category
    if (isActive !== undefined) query.isActive = isActive === 'true'
    
    const skip = (page - 1) * limit

    const faqs = await FAQ.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await FAQ.countDocuments(query)

    res.status(200).json({
      data: faqs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get FAQs error:', error)
    res.status(500).json({ 
      message: 'Failed to fetch FAQs',
      error: error.message 
    })
  }
}

exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id)
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' })
    }
    
    // Increment view count
    faq.views += 1
    await faq.save()
    
    res.status(200).json({ data: faq })
  } catch (error) {
    console.error('Get FAQ error:', error)
    res.status(500).json({ 
      message: 'Failed to fetch FAQ',
      error: error.message 
    })
  }
}

exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' })
    }
    
    res.status(200).json({
      message: 'FAQ updated successfully',
      data: faq
    })
  } catch (error) {
    console.error('Update FAQ error:', error)
    res.status(500).json({ 
      message: 'Failed to update FAQ',
      error: error.message 
    })
  }
}

exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id)
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' })
    }
    res.status(200).json({ message: 'FAQ deleted successfully' })
  } catch (error) {
    console.error('Delete FAQ error:', error)
    res.status(500).json({ 
      message: 'Failed to delete FAQ',
      error: error.message 
    })
  }
}