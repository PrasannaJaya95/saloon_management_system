const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const updateSettings = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // Define schema inline to avoid module issues if model isn't exported standardly
        const SettingsSchema = new mongoose.Schema({
            salonName: String,
            heroTitle: String,
            heroSubtitle: String,
            aboutTitle: String,
            aboutText: String,
            contactEmail: String,
            footerText: String,
            copyrightText: String,
            // Allow other fields
        }, { strict: false });

        const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

        const settings = await Settings.findOne();

        if (settings) {
            console.log('Found settings. Updating...');

            // Update fields if they contain 'Beautec'
            if (settings.salonName === 'Beautec' || settings.salonName === 'Beautec Salon') settings.salonName = 'Salonix';
            if (settings.heroTitle && settings.heroTitle.includes('Beautec')) settings.heroTitle = settings.heroTitle.replace(/Beautec/g, 'Salonix');

            // Check specific fields mentions in previous analysis
            if (settings.aboutTitle === 'About Beautec') settings.aboutTitle = 'About Salonix';
            if (settings.aboutText && settings.aboutText.includes('Beautec')) settings.aboutText = settings.aboutText.replace(/Beautec/g, 'Salonix');
            if (settings.contactEmail && settings.contactEmail.includes('beautec')) settings.contactEmail = settings.contactEmail.replace(/beautec/g, 'salonix');
            if (settings.footerText && settings.footerText.includes('Beautec')) settings.footerText = settings.footerText.replace(/Beautec/g, 'Salonix');
            if (settings.copyrightText && settings.copyrightText.includes('Beautec')) settings.copyrightText = settings.copyrightText.replace(/Beautec/g, 'Salonix');

            // Force update specific known defaults if they match exactly
            settings.salonName = 'Salonix';
            if (!settings.contactEmail) settings.contactEmail = 'hello@salonix.com';

            await settings.save();
            console.log('Settings updated successfully to Salonix.');
        } else {
            console.log('No settings document found. Creating default Salonix settings...');
            await Settings.create({
                salonName: 'Salonix',
                heroTitle: 'Experience Luxury & Wellness',
                heroSubtitle: 'Book your sanctuary. Rejuvenate your soul.',
                aboutTitle: 'About Salonix',
                aboutText: 'Welcome to Salonix, where beauty meets technology.',
                contactEmail: 'hello@salonix.com',
                footerText: 'Experience luxury and wellness redefined.',
                copyrightText: '© 2026 Salonix. All rights reserved.'
            });
            console.log('Created new settings.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating settings:', error);
        process.exit(1);
    }
};

updateSettings();
