const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  duration: String,
  type: String,
  date: { type: Date, default: Date.now },
  weight: { type: Number, required: true }, // Add weight field
});

module.exports = mongoose.model('Workout', workoutSchema);
