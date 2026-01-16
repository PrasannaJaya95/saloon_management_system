const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const path = require('path');
const dotenv = require('dotenv');

// Explicitly load .env from the same directory as this script
dotenv.config({ path: path.join(__dirname, '.env') });

const createAccounts = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI is not defined in .env file.');
            process.exit(1);
        }

        console.log(`Connecting to database...`);
        // Mask the URI for logging safety if needed, but for local run it's fine.
        await mongoose.connect(mongoUri);
        console.log('Connected to Database.');

        // 1. Create Super Admin
        const superAdminEmail = 'superadmin@codebraze.lk';
        const superAdminPass = 'SuperAdmin@codebraze';

        const superAdminExists = await User.findOne({ email: superAdminEmail });
        if (superAdminExists) {
            console.log(`Super Admin (${superAdminEmail}) already exists. Updating role...`);
            superAdminExists.role = 'SuperAdmin';
            superAdminExists.permissions = ['all'];
            // Re-hash password in case it changed (optional, but good for "hard code" enforcement)
            const salt = await bcrypt.genSalt(10);
            superAdminExists.password = await bcrypt.hash(superAdminPass, salt);
            await superAdminExists.save();
            console.log('Super Admin updated (including password).');
        } else {
            const result = await createUser('Super Admin', superAdminEmail, superAdminPass, 'SuperAdmin', ['all']);
            console.log('Super Admin created:', result.email);
        }

        // 2. Create Admin
        const adminEmail = 'admin@beautec.live';
        const adminPass = 'Admin@2024'; // CHANGE THIS

        const adminExists = await User.findOne({ email: adminEmail });
        if (adminExists) {
            console.log(`Admin (${adminEmail}) already exists. Updating role...`);
            adminExists.role = 'Admin';
            adminExists.permissions = ['manage_bookings', 'manage_inventory', 'access_pos', 'view_reports', 'manage_staff'];
            await adminExists.save();
            console.log('Admin updated.');
        } else {
            const result = await createUser('General Admin', adminEmail, adminPass, 'Admin', ['manage_bookings', 'manage_inventory', 'access_pos', 'view_reports', 'manage_staff']);
            console.log('Admin created:', result.email);
        }

        console.log('\n--- Credentials ---');
        console.log(`Super Admin: ${superAdminEmail} / ${superAdminPass}`);
        console.log(`Admin:       ${adminEmail} / ${adminPass}`);
        console.log('-------------------');

        process.exit();

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

const createUser = async (name, email, password, role, permissions) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        permissions,
        status: 'Active'
    });
};

createAccounts();
