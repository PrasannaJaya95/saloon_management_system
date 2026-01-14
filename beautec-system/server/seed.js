const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');
const Terminal = require('./models/Terminal');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beautec_db')
    .then(async () => {
        console.log('Connected to DB for Seeding...');

        // Clear existing
        await Service.deleteMany({});
        await Terminal.deleteMany({});

        // Create Terminals
        const terminals = await Terminal.insertMany([
            { name: 'Hair Station 1', type: 'Hair' },
            { name: 'Hair Station 2', type: 'Hair' },
            { name: 'Spa Room A', type: 'Spa' },
            { name: 'Nail Bar 1', type: 'Nail' }
        ]);
        console.log('Terminals Created:', terminals.length);

        // Create Services
        await Service.insertMany([
            { name: 'Haircut & Style', price: 50, duration: 60, requiredTerminalType: 'Hair' },
            { name: 'Gel Manicure', price: 40, duration: 45, requiredTerminalType: 'Nail' },
            { name: 'Deep Tissue Massage', price: 80, duration: 60, requiredTerminalType: 'Spa' }
        ]);
        console.log('Services Created');

        // Create Categories
        const Category = require('./models/Category');
        await Category.deleteMany({});
        const categories = await Category.insertMany([
            { name: 'Hair', description: 'Hair care products' },
            { name: 'Skin', description: 'Skincare essentials' },
            { name: 'Equipment', description: 'Salon tools' },
            { name: 'Supplies', description: 'Internal supplies' },
            { name: 'Accessories', description: 'Customer accessories' },
            { name: 'Nail', description: 'Nail care' }
        ]);

        const catMap = categories.reduce((acc, cat) => {
            acc[cat.name] = cat._id;
            return acc;
        }, {});
        console.log('Categories Created');

        // Create Products for E-commerce
        const Product = require('./models/Product');
        await Product.deleteMany({});
        await Product.insertMany([
            {
                name: 'Keratin Shampoo',
                price: 25,
                category: catMap['Hair'],
                imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500',
                description: 'Smoothing shampoo for frizzy hair.',
                showInWebsite: true,
                showInPOS: true
            },
            {
                name: 'Argan Oil Mask',
                price: 35,
                category: catMap['Hair'],
                imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
                description: 'Deep conditioning mask.',
                showInWebsite: true,
                showInPOS: true
            },
            {
                name: 'Vitamin C Serum',
                price: 45,
                category: catMap['Skin'],
                imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=500',
                description: 'Brightening serum for glowing skin.',
                showInWebsite: true,
                showInPOS: true
            },
            {
                name: 'Professional Salon Scissors (Staff Only)',
                price: 150,
                category: catMap['Equipment'],
                imageUrl: 'https://images.unsplash.com/photo-1590159787636-646ce9653db3?w=500',
                description: 'High-grade steel scissors.',
                showInWebsite: false,
                showInPOS: false
            },
            {
                name: 'Bulk Shampoo 5L (Internal)',
                price: 200,
                category: catMap['Supplies'],
                imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=500',
                description: 'Backbar supply only.',
                showInWebsite: false,
                showInPOS: false
            },
            {
                name: 'Luxury Rose Gold Hairbrush',
                price: 60,
                category: catMap['Accessories'],
                imageUrl: 'https://images.unsplash.com/photo-1590159787636-646ce9653db3?w=500',
                description: 'Premium detangling brush.',
                showInWebsite: true,
                showInPOS: true
            }
        ]);
        console.log('Products Created');

        // Create Admin User
        // await User.deleteMany({});

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin@123', salt);

        await User.create({
            name: 'Super Admin',
            email: 'admin',
            password: hashedPassword,
            role: 'SuperAdmin'
        });
        console.log('Admin User Created (admin/admin)');

        console.log('Seeding Complete');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
