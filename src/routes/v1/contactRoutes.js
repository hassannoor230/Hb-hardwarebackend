const express = require('express')
const router = express.Router()
const contactController = require('../../controllers/contactController')
const { validateContact } = require('../../middleware/validation')

// Public routes
router.post('/', validateContact, contactController.submitContact)

// Admin routes (would be protected with auth in production)
router.get('/', contactController.getAllContacts)
router.get('/:id', contactController.getContactById)
router.put('/:id/status', contactController.updateContactStatus)
router.delete('/:id', contactController.deleteContact)

module.exports = router