const express = require('express');
const Plant = require('../models/Plant');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

// GET /api/plants  — get user's plants
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/plants  — add plant
router.post('/', async (req, res) => {
  try {
    const plant = await Plant.create({ ...req.body, user: req.user._id });
    res.status(201).json(plant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/plants/:id  — update plant
router.put('/:id', async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, user: req.user._id });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    Object.assign(plant, req.body);
    await plant.save();
    res.json(plant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/plants/:id/water  — mark as watered
router.patch('/:id/water', async (req, res) => {
  try {
    const plant = await Plant.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { lastWatered: new Date(), status: 'good', statusLabel: 'Healthy' },
      { new: true }
    );
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/plants/:id
router.delete('/:id', async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json({ message: 'Plant removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
