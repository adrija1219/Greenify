const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plants');
const shopRoutes = require('./routes/shop');
const cartRoutes = require('./routes/cart');
const aiRoutes = require('./routes/ai');

const app = express();

// --- BULLETPROOF CORS CONFIGURATION FOR VERCEL ---
const allowedOrigins = [
  'http://localhost:5173', 
  'https://greenify-frontend-mocha.vercel.app'
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

// Manually handle OPTIONS preflight requests for all routes across Vercel
app.options('*', cors());
// -------------------------------------------------

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'Greenify API running 🌿' }));

// Connect MongoDB & start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // Exporting app for Vercel or running locally
    if (process.env.NODE_ENV !== 'production') {
      app.listen(process.env.PORT || 5000, () =>
        console.log(`🌿 Server running on port ${process.env.PORT || 5000}`)
      );
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Required for Vercel serverless environment execution
module.exports = app;