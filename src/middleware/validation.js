const { validateContact, validateQuote } = require('../utils/validators')

exports.validateContact = (req, res, next) => {
  const { error } = validateContact(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

exports.validateQuote = (req, res, next) => {
  const { error } = validateQuote(req.body)
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    })
  }
  next()
}

// Validate gallery image
exports.validateGalleryImage = (req, res, next) => {
  const { title, category, altText } = req.body
  
  if (!title || title.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Title is required and must be at least 2 characters'
    })
  }
  
  if (title.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Title cannot exceed 100 characters'
    })
  }
  
  next()
}

// Validate FAQ
exports.validateFAQ = (req, res, next) => {
  const { question, answer, category } = req.body
  
  if (!question || question.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Question is required and must be at least 5 characters'
    })
  }
  
  if (question.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Question cannot exceed 200 characters'
    })
  }
  
  if (!answer || answer.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Answer is required and must be at least 10 characters'
    })
  }
  
  next()
}