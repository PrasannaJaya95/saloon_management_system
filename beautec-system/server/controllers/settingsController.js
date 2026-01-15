const Settings = require('../models/Settings');

// @desc    Get Shop Settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update Shop Settings
// @route   PUT /api/settings
// @access  Private (Admin/SuperAdmin)
exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        const { salonName, address, phone, currency, heroTitle, heroSubtitle, aboutTitle, aboutText, contactTitle, contactText, contactEmail, openingHours, footerText, socialLinks, copyrightText } = req.body;

        console.log('Update Settings Request Body:', req.body);
        console.log('Update Settings SocialLinks:', socialLinks);
        console.log('Update Settings FooterText:', footerText);

        settings.salonName = salonName || settings.salonName;
        settings.address = address || settings.address;
        settings.phone = phone || settings.phone;
        settings.currency = currency || settings.currency;

        settings.aboutTitle = aboutTitle || settings.aboutTitle;
        settings.aboutText = aboutText || settings.aboutText;

        settings.contactTitle = contactTitle || settings.contactTitle;
        settings.contactText = contactText || settings.contactText;
        settings.contactEmail = contactEmail || settings.contactEmail;
        settings.openingHours = openingHours || settings.openingHours;

        settings.footerText = footerText || settings.footerText;
        if (socialLinks) {
            // Check if socialLinks is sent as a JSON string (Multipart form data nuance) or object
            try {
                const parsedLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
                settings.socialLinks = { ...settings.socialLinks, ...parsedLinks };
            } catch (e) {
                console.error("Error parsing socialLinks:", e);
            }
        }
        settings.copyrightText = copyrightText || settings.copyrightText;



        // Handle File Uploads (Logo & Hero Background)
        if (req.files) {
            const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

            if (req.files['logo'] && req.files['logo'][0]) {
                const logoPath = 'uploads/' + req.files['logo'][0].filename;
                settings.logoUrl = `${baseUrl}/${logoPath}`;
            }

            if (req.files['heroBackground'] && req.files['heroBackground'][0]) {
                const heroPath = 'uploads/' + req.files['heroBackground'][0].filename;
                settings.heroBackgroundUrl = `${baseUrl}/${heroPath}`;
            }

            if (req.files['aboutImage'] && req.files['aboutImage'][0]) {
                const aboutPath = 'uploads/' + req.files['aboutImage'][0].filename;
                settings.aboutImageUrl = `${baseUrl}/${aboutPath}`;
            }

            if (req.files['contactHero'] && req.files['contactHero'][0]) {
                const contactPath = 'uploads/' + req.files['contactHero'][0].filename;
                settings.contactHeroUrl = `${baseUrl}/${contactPath}`;
            }
        }
        // Fallback for single file (legacy/safety if middleware didn't parse as fields correctly but shouldn't happen with multer fields)
        // actually multer fields populates req.files, single populates req.file
        // We will stick to req.files logic as route is updated.

        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};
