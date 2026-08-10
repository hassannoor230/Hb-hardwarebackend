const express = require('express')
const router = express.Router()
const contactController = require('../../controllers/contactController')
const { validateContact } = require('../../middleware/validation')
const { protect, adminOnly } = require('../../middleware/auth')

router.post('/', validateContact, contactController.submitContact)

router.get('/', protect, adminOnly, contactController.getAllContacts)
router.get('/:id', protect, adminOnly, contactController.getContactById)
router.put('/:id/status', protect, adminOnly, contactController.updateContactStatus)
router.delete('/:id', protect, adminOnly, contactController.deleteContact)

module.exports = router
