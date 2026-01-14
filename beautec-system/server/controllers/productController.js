const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const isAdmin = req.query.admin === 'true';
        const isPOS = req.query.pos === 'true';

        let filter = { showInWebsite: true };
        if (isAdmin) filter = {};
        if (isPOS) filter = { showInPOS: true };

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
            showInPOS: req.body.showInPOS === 'true' || req.body.showInPOS === true
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
            showInPOS: req.body.showInPOS === 'true' || req.body.showInPOS === true
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
