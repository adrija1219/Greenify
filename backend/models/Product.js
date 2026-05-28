const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    scientificName: { type: String, default: '' },
    category: {
      type: String,
      enum: ['indoor', 'outdoor', 'succulent', 'tropical', 'accessories'],
      required: true,
    },
    price: { type: Number, required: true },
    emoji: { type: String, default: '🌿' },
    badge: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    care: { type: String, default: 'Easy' },
    light: { type: String, default: 'Medium' },
    stock: { type: Number, default: 100 },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
