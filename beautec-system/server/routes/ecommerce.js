const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { createOrder, getAllOrders, getOrderById, updateOrderStatus, getMyOrders, deleteOrder, updateOrder } = require('../controllers/orderController');
const { protect, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Products
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);

// Orders
router.post('/orders', createOrder); // Modified to allow Guest Checkout (protect removed)
router.get('/orders/myorders', protect, getMyOrders); // Place before /:id to prevent conflict
router.get('/orders', protect, checkRole(['SuperAdmin', 'Admin']), getAllOrders);

// Restricted Routes
router.delete('/orders/:id', protect, checkRole(['SuperAdmin', 'Admin']), deleteOrder);
router.put('/orders/:id', protect, checkRole(['SuperAdmin', 'Admin']), updateOrder);

module.exports = router;
