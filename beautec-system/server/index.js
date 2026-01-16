const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db');

dotenv.config();

const app = express();

/* ======================
   CORS
====================== */
app.use(cors({
  origin: 'https://codebrazesalon.netlify.app',
  credentials: true
}));

app.use(express.json());

/* ======================
   DB MIDDLEWARE (CORRECT)
====================== */
app.use(async (req, res, next) => {
  try {
    await connectDB(); // cached, fast after first connect
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

/* ======================
   Logger
====================== */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/* ======================
   Static
====================== */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ======================
   Routes
====================== */
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/shop', require('./routes/ecommerce'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/services', require('./routes/services'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chairs', require('./routes/chairs'));
app.use('/api/team', require('./routes/team'));

app.get('/', (req, res) => {
  res.send('Beautec API is running...');
});

module.exports = app;
