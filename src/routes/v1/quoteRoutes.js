const express = require('express')
const router = express.Router()
const quoteController = require('../../controllers/quoteController')
const { validateQuote } = require('../../middleware/validation')

// Public routes
router.post('/', validateQuote, quoteController.submitQuote)

// Admin routes
router.get('/', quoteController.getAllQuotes)
router.get('/:id', quoteController.getQuoteById)
router.put('/:id/status', quoteController.updateQuoteStatus)
router.delete('/:id', quoteController.deleteQuote)

module.exports = router
