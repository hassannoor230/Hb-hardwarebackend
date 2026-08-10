const express = require('express')
const router = express.Router()
const productController = require('../../controllers/productController')

router.get('/', productController.listProducts)
router.get('/slug/:slug', productController.getProduct)
router.get('/:id', productController.getProductById)

module.exports = router
