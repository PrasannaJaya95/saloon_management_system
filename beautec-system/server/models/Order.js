const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        type: { type: String, enum: ['Product', 'Service'], default: 'Product' },
        name: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Paid, Shipped
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'Bank Transfer'], default: 'Cash' },
    paymentReference: { type: String }, // Transaction ID, Ref Number, etc.
    paymentId: { type: String }, // Stripe/Razorpay ID
    source: { type: String, enum: ['Website', 'POS'], default: 'Website' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
