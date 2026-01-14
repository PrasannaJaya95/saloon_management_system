const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const { protect, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Products
router.get('/products', productController.getProducts);
router.post('/products', upload.single('image'), productController.createProduct);
router.put('/products/:id', upload.single('image'), productController.updateProduct);

// Orders
router.get('/orders', orderController.getAllOrders);
router.post('/orders', orderController.createOrder); // Anyone can create orders (public/pos)
// Restricted Routes
router.delete('/orders/:id', protect, checkRole(['SuperAdmin', 'Admin']), orderController.deleteOrder);
router.put('/orders/:id', protect, checkRole(['SuperAdmin', 'Admin']), orderController.updateOrder);

module.exports = router;
