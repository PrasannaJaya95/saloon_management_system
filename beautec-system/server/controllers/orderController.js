const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, items, totalAmount, paymentId, source } = req.body;

        // In a real app, verify payment with Gateway here using paymentId

        const order = await Order.create({
            customerName,
            customerEmail,
            items,
            totalAmount,
            paymentId,
            source: source || 'Website',
            status: 'Paid' // Assume success for demo
        });

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
