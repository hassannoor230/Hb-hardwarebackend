const ContactInquiry = require('../models/ContactInquiry')
const { sendContactEmail } = require('../utils/emailService')
const { validateContact } = require('../utils/validators')

exports.submitContact = async (req, res) => {
  try {
    // Validate input
    const { error } = validateContact(req.body)
    if (error) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.details 
      })
    }

    // Add IP and user agent
    const contactData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }

    // Save to database
    const contact = await ContactInquiry.create(contactData)

    // Send email notification
    try {
      await sendContactEmail(contact)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Contact inquiry submitted successfully',
      data: contact
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    res.status(500).json({ 
      message: 'Failed to submit contact inquiry',
      error: error.message 
    })
  }
}

exports.getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    
    const query = status ? { status } : {}
    const skip = (page - 1) * limit

    const contacts = await ContactInquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await ContactInquiry.countDocuments(query)

    res.status(200).json({
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({ 
      message: 'Failed to fetch contacts',
      error: error.message 
    })
  }
}

exports.getContactById = async (req, res) => {
  try {
    const contact = await ContactInquiry.findById(req.params.id)
    if (!contact) {
      return res.status(404).json({ message: 'Contact inquiry not found' })
    }
    res.status(200).json({ data: contact })
  } catch (error) {
    console.error('Get contact error:', error)
    res.status(500).json({ 
      message: 'Failed to fetch contact',
      error: error.message 
    })
  }
}

exports.updateContactStatus = async (req, res) => {
  try {
    const { status, notes } = req.body
    
    const contact = await ContactInquiry.findById(req.params.id)
    if (!contact) {
      return res.status(404).json({ message: 'Contact inquiry not found' })
    }

    contact.status = status || contact.status
    if (notes) contact.notes = notes
    if (status === 'responded') {
      contact.respondedAt = new Date()
      contact.respondedBy = req.user?.email || 'admin'
    }

    await contact.save()

    res.status(200).json({
      message: 'Contact status updated successfully',
      data: contact
    })
  } catch (error) {
    console.error('Update contact error:', error)
    res.status(500).json({ 
      message: 'Failed to update contact',
      error: error.message 
    })
  }
}

exports.deleteContact = async (req, res) => {
  try {
    const contact = await ContactInquiry.findByIdAndDelete(req.params.id)
    if (!contact) {
      return res.status(404).json({ message: 'Contact inquiry not found' })
    }
    res.status(200).json({ message: 'Contact inquiry deleted successfully' })
  } catch (error) {
    console.error('Delete contact error:', error)
    res.status(500).json({ 
      message: 'Failed to delete contact',
      error: error.message 
    })
  }
}