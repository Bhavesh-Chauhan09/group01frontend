// models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming userId should always be present
  day: { type: Number, required: true },     // Make day required
  distance: { type: Number, required: true }, // Make distance required
  totalgoals: { type: Number, required: false }, // Optional field
  progress: { type: Number, required: false },   // Optional field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Goal', goalSchema);
