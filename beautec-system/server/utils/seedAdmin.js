const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedSuperAdmin = async () => {
    try {
        const email = 'admin'; // 'admin' as username
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log('✅ Super Admin check: User "admin" exists.');
            if (existingAdmin.role !== 'SuperAdmin') {
                existingAdmin.role = 'SuperAdmin';
                await existingAdmin.save();
                console.log('🔄 Updated existing "admin" user to SuperAdmin role.');
            }
        } else {
            console.log('⚠️ Super Admin "admin" not found. Creating default account...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin', salt); // Password: admin

            await User.create({
                name: 'Super Admin',
                email: email,
                password: hashedPassword,
                role: 'SuperAdmin',
                status: 'Active',
                permissions: ['manage_bookings', 'manage_inventory', 'access_pos', 'view_reports', 'manage_staff']
            });
            console.log('🎉 Success! Default Super Admin created.');
            console.log('👤 Username: admin');
            console.log('🔑 Password: admin');
        }
    } catch (error) {
        console.error('❌ Error seeding Super Admin:', error.message);
    }
};

module.exports = seedSuperAdmin;
