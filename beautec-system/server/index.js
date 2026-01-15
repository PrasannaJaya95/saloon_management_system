const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    "https://codebrazesalon.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
const path = require('path');

// Routes
const bookingRoutes = require('./routes/bookings');
const ecommerceRoutes = require('./routes/ecommerce');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team'); // Added team routes import

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use('/api/bookings', bookingRoutes);
app.use('/api/shop', require('./routes/ecommerce'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/categories', categoryRoutes);
app.use('/api/services', require('./routes/services'));
app.use('/api/auth', authRoutes);
app.use('/api/chairs', require('./routes/chairs'));
app.use('/api/team', teamRoutes); // Added team routes usage

app.get('/', (req, res) => {
    res.send('Beautec API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beautec_db')
    .then(async () => {
        console.log('MongoDB Connected');
        // Auto-Seed Super Admin
        const seedSuperAdmin = require('./utils/seedAdmin');
        await seedSuperAdmin();
    })
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
