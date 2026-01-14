const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const upload = require('../middleware/upload');

// Products
router.get('/products', productController.getProducts);
router.post('/products', upload.single('image'), productController.createProduct);
router.put('/products/:id', upload.single('image'), productController.updateProduct);

// Orders
router.get('/orders', orderController.getAllOrders);
router.post('/orders', orderController.createOrder);

module.exports = router;
