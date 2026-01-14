const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    salonName: { type: String, default: 'Beautec Salon' },
    address: { type: String, default: '123 Fashion Street, Colombo' },
    phone: { type: String, default: '+94 77 123 4567' },
    currency: { type: String, default: 'LKR' },
    logoUrl: { type: String, default: '' } // Path to uploaded logo
}, { timestamps: true });

// Singleton pattern: Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

module.exports = mongoose.model('Settings', SettingsSchema);
