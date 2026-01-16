const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const run = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Get a category
        let category = await Category.findOne({ type: 'Product' });
        if (!category) {
            console.log('No category found, creating one...');
            category = await Category.create({ name: 'Test Category', type: 'Product' });
        }

        // 2. Try to create FIRST product with empty string itemNumber
        let p1Data = {
            name: 'DEBUG_EMPTY_ITEM_1_' + Date.now(),
            price: 100,
            category: category._id,
            itemNumber: "" // Frontend might send this if optional
        };
        // SIMULATE CONTROLLER LOGIC
        if (p1Data.itemNumber === "") delete p1Data.itemNumber;

        console.log('Creating Product 1 with empty itemNumber...');
        const p1 = await Product.create(p1Data);
        console.log('Product 1 created:', p1._id);

        // 3. Try to create SECOND product with empty string itemNumber
        let p2Data = {
            name: 'DEBUG_EMPTY_ITEM_2_' + Date.now(),
            price: 200,
            category: category._id,
            itemNumber: "" // Should now pass if sparse works and we delete it
        };
        // SIMULATE CONTROLLER LOGIC
        if (p2Data.itemNumber === "") delete p2Data.itemNumber;

        console.log('Creating Product 2 with empty itemNumber...');
        const p2 = await Product.create(p2Data); // Expecting error here
        console.log('Product 2 created (SUCCESS):', p2._id);

        // Cleanup if both passed (EXPECTED NOW)
        await Product.findByIdAndDelete(p1._id);
        await Product.findByIdAndDelete(p2._id);

    } catch (error) {
        console.log('CAUGHT EXPECTED ERROR?');
        console.error(error.message);
        // Cleanup p1 if p2 failed
        // (Not strictly necessary for this test script but good practice)
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

run();
