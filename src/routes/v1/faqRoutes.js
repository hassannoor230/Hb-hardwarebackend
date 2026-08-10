const express = require('express')
const router = express.Router()
const faqController = require('../../controllers/faqController')

// Public routes
router.get('/', faqController.getAllFAQs)
router.get('/:id', faqController.getFAQById)

// Admin routes (would be protected with auth in production)
router.post('/', faqController.createFAQ)
router.put('/:id', faqController.updateFAQ)
router.delete('/:id', faqController.deleteFAQ)

module.exports = router