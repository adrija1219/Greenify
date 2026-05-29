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

// Middleware
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'https://greenify-frontend-mocha.vercel.app'
  ], 
  credentials: true 
}));
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
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🌿 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));
