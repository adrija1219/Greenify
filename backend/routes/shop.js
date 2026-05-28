const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/shop  — list products with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Auto-seed if empty
    if (products.length === 0) {
      await Product.insertMany(SEED_PRODUCTS);
      return res.json(await Product.find(filter));
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/shop/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const SEED_PRODUCTS = [
  { name: 'Monstera Deliciosa', scientificName: 'Monstera deliciosa', category: 'tropical', price: 899, emoji: '🌿', badge: 'Bestseller', rating: 4.8, reviews: 124, care: 'Easy', light: 'Medium', description: 'The iconic split-leaf plant perfect for living rooms.' },
  { name: 'Fiddle Leaf Fig', scientificName: 'Ficus lyrata', category: 'indoor', price: 1299, emoji: '🌳', badge: 'Popular', rating: 4.5, reviews: 89, care: 'Medium', light: 'Bright', description: 'A statement piece for modern interiors.' },
  { name: 'Snake Plant', scientificName: 'Sansevieria trifasciata', category: 'indoor', price: 499, emoji: '🗡️', badge: '', rating: 4.9, reviews: 203, care: 'Easy', light: 'Any', description: 'Nearly indestructible — perfect for beginners.' },
  { name: 'Echeveria Rosette', scientificName: 'Echeveria elegans', category: 'succulent', price: 299, emoji: '🌸', badge: 'Sale', rating: 4.7, reviews: 67, care: 'Easy', light: 'Bright', description: 'Beautiful rosette-shaped succulent in pastel tones.' },
  { name: 'Bird of Paradise', scientificName: 'Strelitzia reginae', category: 'tropical', price: 1799, emoji: '🦜', badge: 'Rare', rating: 4.6, reviews: 45, care: 'Medium', light: 'Full Sun', description: 'Dramatic tropical plant with large, paddle-shaped leaves.' },
  { name: 'ZZ Plant', scientificName: 'Zamioculcas zamiifolia', category: 'indoor', price: 699, emoji: '🌱', badge: '', rating: 4.8, reviews: 156, care: 'Easy', light: 'Low', description: 'Thrives on neglect — ideal for offices and low light.' },
  { name: 'Aloe Vera', scientificName: 'Aloe barbadensis', category: 'succulent', price: 249, emoji: '🌵', badge: '', rating: 4.9, reviews: 312, care: 'Easy', light: 'Bright', description: 'Medicinal succulent great for soothing skin.' },
  { name: 'Peace Lily', scientificName: 'Spathiphyllum wallisii', category: 'indoor', price: 549, emoji: '🤍', badge: 'Pet Friendly', rating: 4.7, reviews: 98, care: 'Easy', light: 'Low', description: 'Elegant white blooms and excellent air purifier.' },
  { name: 'Palm Plant', scientificName: 'Chamaedorea elegans', category: 'outdoor', price: 999, emoji: '🌴', badge: '', rating: 4.5, reviews: 34, care: 'Medium', light: 'Bright', description: 'Tropical elegance perfect for patios and balconies.' },
  { name: 'Fiddle Pot — Terracotta', scientificName: 'Accessory', category: 'accessories', price: 349, emoji: '🪣', badge: '', rating: 4.8, reviews: 55, care: '-', light: '-', description: 'Handcrafted terracotta pot for medium plants.' },
  { name: 'Organic Plant Feed', scientificName: 'Accessory', category: 'accessories', price: 199, emoji: '🌿', badge: '', rating: 4.7, reviews: 88, care: '-', light: '-', description: 'Slow-release organic fertilizer for all plant types.' },
  { name: 'Cactus Mix Trio', scientificName: 'Various species', category: 'succulent', price: 199, emoji: '🌵', badge: '', rating: 4.6, reviews: 78, care: 'Easy', light: 'Full Sun', description: 'A curated trio of mini cacti — great gift set.' },
];

module.exports = router;
