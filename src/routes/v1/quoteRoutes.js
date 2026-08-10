const express = require('express')
const router = express.Router()
const quoteController = require('../../controllers/quoteController')
const { validateQuote } = require('../../middleware/validation')
const { protect, adminOnly } = require('../../middleware/auth')

router.post('/', validateQuote, quoteController.submitQuote)

router.get('/', protect, adminOnly, quoteController.getAllQuotes)
router.get('/:id', protect, adminOnly, quoteController.getQuoteById)
router.put('/:id/status', protect, adminOnly, quoteController.updateQuoteStatus)
router.delete('/:id', protect, adminOnly, quoteController.deleteQuote)

module.exports = router
