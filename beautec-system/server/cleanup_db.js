const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const cleanup = async () => {
    await connectDB();
    try {
        // Delete items with "TEST_PRODUCT_UPLOAD" or "DEBUG_EMPTY_ITEM" in name
        const regex = /TEST_PRODUCT_UPLOAD|DEBUG_EMPTY_ITEM/;
        const result = await Product.deleteMany({ name: { $regex: regex } });
        console.log(`Deleted ${result.deletedCount} test products.`);
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

cleanup();
