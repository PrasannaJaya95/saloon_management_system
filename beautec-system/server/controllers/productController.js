const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getProducts = async (req, res) => {
    try {
        const isAdmin = req.query.admin === 'true';
        const isPOS = req.query.pos === 'true';

        console.log('GET /products Query:', req.query); // DEBUG LOG

        let filter = { showInWebsite: true };
        if (isAdmin) filter = {};
        if (isPOS) filter = { showInPOS: true };

        // 1. Category Filter
        if (req.query.category) {
            console.log('Category Filter:', req.query.category, 'Valid?', mongoose.isValidObjectId(req.query.category));
            if (mongoose.isValidObjectId(req.query.category)) {
                filter.category = new mongoose.Types.ObjectId(req.query.category);
            } else {
                console.warn('Invalid Category ID received:', req.query.category);
            }
        }

        // 2. Price Range Filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

        // 3. Search (Name OR ItemNumber)
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { name: searchRegex },
                { itemNumber: searchRegex }
            ];
        }

        const products = await Product.find(filter).populate('category', 'name');

        // Transform imageUrl to be absolute URL if it flows from uploads
        const productsWithUrl = products.map(p => ({
            ...p._doc,
            category: p.category ? p.category.name : 'Uncategorized', // Flatten for frontend compatibility if needed
            categoryId: p.category ? p.category._id : null,
            imageUrl: p.imageUrl && !p.imageUrl.startsWith('http')
                ? `${req.protocol}://${req.get('host')}/uploads/${p.imageUrl}`
                : p.imageUrl
        }));

        res.status(200).json({ success: true, data: productsWithUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, error: 'Invalid Product ID' });
        }

        const product = await Product.findById(req.params.id).populate('category', 'name');

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const productWithUrl = {
            ...product._doc,
            category: product.category ? product.category.name : 'Uncategorized',
            categoryId: product.category ? product.category._id : null,
            imageUrl: product.imageUrl && !product.imageUrl.startsWith('http')
                ? `${req.protocol}://${req.get('host')}/uploads/${product.imageUrl}`
                : product.imageUrl
        };

        res.status(200).json({ success: true, data: productWithUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        // Handle Image Upload
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.filename;
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }

        const productData = {
            ...req.body,
            imageUrl,
            showInWebsite: req.body.showInWebsite === 'true' || req.body.showInWebsite === true,
            showInPOS: req.body.showInPOS === 'true' || req.body.showInPOS === true,
            relatedProducts: req.body.relatedProducts ? JSON.parse(req.body.relatedProducts) : []
        };

        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Handle Image Update
        let imageUrl = product.imageUrl;
        if (req.file) {
            imageUrl = req.file.filename;
        }

        const updateData = {
            ...req.body,
            imageUrl,
            showInWebsite: req.body.showInWebsite === 'true' || req.body.showInWebsite === true,
            showInPOS: req.body.showInPOS === 'true' || req.body.showInPOS === true,
            relatedProducts: req.body.relatedProducts ? JSON.parse(req.body.relatedProducts) : product.relatedProducts
        };

        product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
