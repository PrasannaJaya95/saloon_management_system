const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beautec_db');
        console.log('Connected to Database...');

        const email = 'admin'; // Using 'admin' as username/email for simplicity as requested before, or change to email format
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log('Super Admin already exists.');
            if (existingAdmin.role !== 'SuperAdmin') {
                existingAdmin.role = 'SuperAdmin';
                await existingAdmin.save();
                console.log('Updated existing admin user to SuperAdmin role.');
            }
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin@123', salt);

            await User.create({
                name: 'Super Admin',
                email: email,
                password: hashedPassword,
                role: 'SuperAdmin',
                status: 'Active',
                permissions: ['manage_bookings', 'manage_inventory', 'access_pos', 'view_reports', 'manage_staff']
            });
            console.log('Success! Super Admin created.');
            console.log('Email/Username: admin');
            console.log('Password: admin@123');
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

createAdmin();
