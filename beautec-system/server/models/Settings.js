const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    salonName: { type: String, default: 'Beautec Salon' },
    address: { type: String, default: '123 Fashion Street, Colombo' },
    phone: { type: String, default: '+94 77 123 4567' },
    currency: { type: String, default: 'LKR' },
    logoUrl: { type: String, default: '' }, // Path to uploaded logo
    // Website Content
    heroTitle: { type: String, default: 'Experience Luxury Beauty & Wellness' },
    heroSubtitle: { type: String, default: 'Your sanctuary for premium hair, skin, and spa treatments.' },
    heroBackgroundUrl: { type: String, default: '' }, // Path to uploaded background
    aboutTitle: { type: String, default: 'About Beautec' },
    aboutText: { type: String, default: 'Welcome to Beautec, where beauty meets technology. We offer a wide range of services tailored to your needs.' },
    aboutImageUrl: { type: String, default: '' }, // New About Section Image
    // Contact Page Content
    contactTitle: { type: String, default: 'Get in Touch' },
    contactText: { type: String, default: 'We\'d love to hear from you. Book an appointment or just say hello.' },
    contactEmail: { type: String, default: 'hello@beautecsalon.com' },
    openingHours: { type: String, default: 'Mon - Sat: 9:00 AM - 8:00 PM\nSun: 10:00 AM - 6:00 PM' },
    contactHeroUrl: { type: String, default: '' },
    // Footer Content
    footerText: { type: String, default: 'Beautec is a premium salon management system designed to elevate your business.' },
    socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    },
    copyrightText: { type: String, default: '© 2024 Beautec. All rights reserved.' },
}, { timestamps: true });

// Singleton pattern: Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

module.exports = mongoose.model('Settings', SettingsSchema);
