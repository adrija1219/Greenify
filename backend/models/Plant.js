const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    species: { type: String, trim: true },
    location: { type: String, trim: true },
    emoji: { type: String, default: '🌿' },
    health: { type: Number, default: 100, min: 0, max: 100 },
    status: { type: String, enum: ['good', 'warn', 'urgent'], default: 'good' },
    statusLabel: { type: String, default: 'Healthy' },
    lastWatered: { type: Date, default: Date.now },
    wateringFrequencyDays: { type: Number, default: 7 },
    light: { type: String, default: 'Medium' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Virtual: next watering date
plantSchema.virtual('nextWater').get(function () {
  const next = new Date(this.lastWatered);
  next.setDate(next.getDate() + this.wateringFrequencyDays);
  return next;
});

module.exports = mongoose.model('Plant', plantSchema);
