const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    itemNumber: { type: String, unique: true, sparse: true }, // Sparse allows null/undefined for existing checks, unique for new
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
    showInWebsite: { type: Boolean, default: true },
    showInPOS: { type: Boolean, default: true },
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
