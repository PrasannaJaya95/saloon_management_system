const dotenv = require('dotenv');
dotenv.config();

// Placeholder for Twilio or Meta WhatsApp Cloud API
// To use real WhatsApp integration, we need TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN

const sendWhatsAppMessage = async (to, message) => {
    console.log(`[WhatsApp Mock] Sending to ${to}: ${message}`);
    // In a real implementation:
    // await client.messages.create({ body: message, from: 'whatsapp:+14155238886', to: `whatsapp:${to}` });
    return { success: true, sid: 'mock_sid_' + Date.now() };
};

module.exports = { sendWhatsAppMessage };
