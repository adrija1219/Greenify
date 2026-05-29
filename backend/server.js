const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes  = require('./routes/auth');
const plantRoutes = require('./routes/plants');
const shopRoutes  = require('./routes/shop');
const cartRoutes  = require('./routes/cart');
const aiRoutes    = require('./routes/ai');

const app = express();

// ── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://greenify-frontend-mocha.vercel.app',  // ← replace with your actual frontend URL
  ],
  credentials: true,
}));
app.use(express.json());

// ── MongoDB: connect once, reuse across serverless invocations ──
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast instead of hanging
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    // Don't crash — let routes handle DB errors individually
  }
};

// ── Middleware to connect DB before any route ───────────────
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/shop',   shopRoutes);
app.use('/api/cart',   cartRoutes);
app.use('/api/ai',     aiRoutes);

// ── Health check (always works, even without DB) ────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Greenify API running 🌿',
    db: isConnected ? 'connected' : 'disconnected',
    env: {
      hasMongo:   !!process.env.MONGO_URI,
      hasMistral: !!process.env.MISTRAL_API_KEY,
      hasJWT:     !!process.env.JWT_SECRET,
    }
  });
});

// ── Export for Vercel (no app.listen) ───────────────────────
module.exports = app;