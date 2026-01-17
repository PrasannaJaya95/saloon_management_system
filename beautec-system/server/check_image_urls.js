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

const checkImages = async () => {
    await connectDB();
    try {
        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);
        products.forEach(p => {
            console.log(`ID: ${p._id} | Name: ${p.name} | ImageUrl: ${p.imageUrl}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

checkImages();
