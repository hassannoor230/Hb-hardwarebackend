const QuoteRequest = require('../models/QuoteRequest')
const { sendQuoteEmail } = require('../utils/emailService')
const { validateQuote } = require('../utils/validators')

exports.submitQuote = async (req, res) => {
  try {
    // Validate input
    const { error } = validateQuote(req.body)
    if (error) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.details 
      })
    }

    // Add IP and user agent
    const quoteData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }

    // Save to database
    const quote = await QuoteRequest.create(quoteData)

    // Send email notification
    try {
      await sendQuoteEmail(quote)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Quote request submitted successfully',
      data: quote
    })
  } catch (error) {
    console.error('Quote submission error:', error)
    res.status(500).json({ 
      message: 'Failed to submit quote request',
      error: error.message 
    })
  }
}

exports.getAllQuotes = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    
    const query = status ? { status } : {}
    const skip = (page - 1) * limit

    const quotes = await QuoteRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await QuoteRequest.countDocuments(query)

    res.status(200).json({
      data: quotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get quotes error:', error)
    res.status(500).json({ 
      message: 'Failed to fetch quotes',
      error: error.message 
    })
  }
}

exports.getQuoteById = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id)
    if (!quote) {
      return res.status(404).json({ message: 'Quote request not found' })
    }
    res.status(200).json({ data: quote })
  } catch (error) {
    console.error('Get quote error:', error)
    res.status(500).json({ 
      message: 'Failed to fetch quote',
      error: error.message 
    })
  }
}

exports.updateQuoteStatus = async (req, res) => {
  try {
    const { status, quoteAmount, quoteDetails, notes } = req.body
    
    const quote = await QuoteRequest.findById(req.params.id)
    if (!quote) {
      return res.status(404).json({ message: 'Quote request not found' })
    }

    quote.status = status || quote.status
    if (quoteAmount !== undefined) quote.quoteAmount = quoteAmount
    if (quoteDetails) quote.quoteDetails = quoteDetails
    if (notes) quote.notes = notes
    if (status === 'quoted' || status === 'accepted') {
      quote.respondedAt = new Date()
      quote.respondedBy = req.user?.email || 'admin'
    }

    await quote.save()

    res.status(200).json({
      message: 'Quote status updated successfully',
      data: quote
    })
  } catch (error) {
    console.error('Update quote error:', error)
    res.status(500).json({ 
      message: 'Failed to update quote',
      error: error.message 
    })
  }
}

exports.deleteQuote = async (req, res) => {
  try {
    const quote = await QuoteRequest.findByIdAndDelete(req.params.id)
    if (!quote) {
      return res.status(404).json({ message: 'Quote request not found' })
    }
    res.status(200).json({ message: 'Quote request deleted successfully' })
  } catch (error) {
    console.error('Delete quote error:', error)
    res.status(500).json({ 
      message: 'Failed to delete quote',
      error: error.message 
    })
  }
}