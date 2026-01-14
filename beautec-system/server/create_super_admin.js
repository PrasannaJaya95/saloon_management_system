const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beautec_db');
        console.log('Connected to DB');

        const email = 'superadmin@beautec.local';
        const password = 'BeautecAdminUser@2024';

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Super Admin already exists.');
            // Optionally update their permissions/role just in case
            userExists.role = 'SuperAdmin';
            userExists.permissions = ['all'];
            await userExists.save();
            console.log('Updated existing Super Admin privileges.');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const superAdmin = await User.create({
            name: 'Super Administrator',
            email,
            password: hashedPassword,
            role: 'SuperAdmin',
            permissions: ['all'],
            status: 'Active',
            position: 'System Owner'
        });

        console.log('Super Admin Created Successfully!');
        console.log('Email:', email);
        console.log('Password:', password);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createSuperAdmin();
