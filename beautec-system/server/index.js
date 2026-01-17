const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

const connectDB = require('./config/db');

dotenv.config();

const app = express();

/* ======================
   CORS
====================== */
app.use(cors({
  origin: ['https://codebrazesalon.netlify.app', 'http://localhost:5173', 'http://localhost:5174'],
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: err.message });
  }
  res.status(500).json({ 
      success: false, 
      error: err.message || 'Server Error', 
      fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
  });
});app.get('/', (req, res) => {
  res.send('Beautec API is running...');
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
