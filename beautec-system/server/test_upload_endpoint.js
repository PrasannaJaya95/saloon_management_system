const { openAsBlob } = require('node:fs');
const path = require('node:path');

const run = async () => {
    try {
        console.log('Starting upload test...');

        // 1. Fetch Category
        let categoryId = '65a000000000000000000000'; // Fallback
        try {
            const catRes = await fetch('http://localhost:5000/api/categories');
            const catData = await catRes.json();
            if (catData.data && catData.data.length > 0) {
                categoryId = catData.data[0]._id;
                console.log('Using Category ID:', categoryId);
            } else {
                console.log('No categories found, using dummy ID');
            }
        } catch (e) {
            console.log('Failed to fetch categories:', e.message);
        }

        // 2. Prepare Form Data
        const form = new FormData();
        form.append('name', 'TEST_PRODUCT_UPLOAD_' + Date.now());
        form.append('description', 'Test Description');
        form.append('price', '100');
        form.append('category', categoryId);

        const fileBlob = await openAsBlob(path.join(__dirname, 'uploads', 'hero-main.png'));
        form.append('image', fileBlob, 'hero-main.png');

        form.append('showInWebsite', 'true');
        form.append('showInPOS', 'true');
        form.append('itemNumber', '');

        console.log('Sending POST request...');
        const response = await fetch('http://localhost:5000/api/shop/products', {
            method: 'POST',
            body: form
        });

        console.log('Response Status:', response.status);
        const text = await response.text();
        console.log('Response Body:', text);
        // Try parsing only if looks like JSON
        try {
            const data = JSON.parse(text);
            console.log('Parsed JSON:', data);
        } catch (e) { console.log('Response was not JSON'); }

    } catch (error) {
        console.error('Script Error:', error);
    }
};

run();
