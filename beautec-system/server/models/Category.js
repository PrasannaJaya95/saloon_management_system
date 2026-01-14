const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ['Product', 'Service'],
        default: 'Product'
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
