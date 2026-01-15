const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, paymentReference, source, customerId } = req.body;

        // In a real app, verify payment with Gateway here using paymentReference if applicable

        const order = new Order({
            items,
            totalAmount,
            paymentMethod,
            paymentReference,
            source: source || 'Website',
            // If user is logged in (req.user exists), use their ID. Or allow passing customerId manually if needed (e.g. from POS)
            customerId: req.user ? req.user._id : customerId,
            customerName: req.user ? req.user.name : req.body.customerName,
            customerEmail: req.user ? req.user.email : req.body.customerEmail,
            status: 'Pending' // Initial status
        });

        await order.save();

        res.status(201).json({ success: true, data: order, message: 'Order placed successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete order
// @access  Private (Admin/SuperAdmin)
// Get logged-in user's orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        await order.deleteOne();
        res.status(200).json({ success: true, message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update order status
// @access  Private (Admin/SuperAdmin)
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        order.status = req.body.status || order.status;
        await order.save();

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
