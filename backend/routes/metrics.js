// routes/metrics.js
const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const User = require('../models/User');
const Workout = require('../models/Workout');

router.get('/calculate/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all goals and calculate total distance covered
    const goals = await Goal.find({ userId });
    const totalDistance = goals.reduce((sum, goal) => sum + goal.distance, 0);

    // Fetch user data to determine calories per mile
    const user = await User.findById(userId);
    const weight = user?.weight || 155; // Default to 155 lbs if weight not found

    const caloriesPerKm = weight <= 125 ? 80 : weight <= 155 ? 100 : 120;
    const caloriesBurned = (totalDistance * caloriesPerKm)/100;

    // Calculate weight lost by comparing user's current weight with latest workout weight
    const latestWorkout = await Workout.findOne({ userId }).sort({ date: -1 });
    const latestWorkoutWeight = latestWorkout?.weight || weight;
    const weightLost = weight - latestWorkoutWeight;

    res.json({
      totalDistance,
      caloriesBurned,
      weightLost,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
