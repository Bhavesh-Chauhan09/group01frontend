const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// Create a workout (POST)
router.post('/', async (req, res) => {
  const workout = new Workout(req.body);
  try {
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all workouts (GET)
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all workouts for a user (GET)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const workouts = await Workout.find({ userId });
    if (!workouts.length) {
      return res.status(404).json({ message: "No workouts found for this user" });
    }
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a workout (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedWorkout = await Workout.findByIdAndDelete(id);
    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ message: "Workout deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Export the router
module.exports = router;
