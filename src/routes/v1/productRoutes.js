const express = require('express')
const router = express.Router()
const productController = require('../../controllers/productController')
const { protect, adminOnly } = require('../../middleware/auth')

router.get('/', productController.listProducts)
router.get('/slug/:slug', productController.getProduct)
router.get('/:id', productController.getProductById)

router.post('/', protect, adminOnly, productController.createProduct)
router.put('/:id', protect, adminOnly, productController.updateProduct)
router.delete('/:id', protect, adminOnly, productController.deleteProduct)

module.exports = router