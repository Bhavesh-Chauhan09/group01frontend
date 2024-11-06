// routes/goals.js
const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');

// Create a new goal for a specific day
// routes/goals.js
router.post('/', async (req, res) => {
  const { userId, day, distance, totalgoals, progress } = req.body;

  // Validate only required fields
  if (!userId || day == null || distance == null) {
    return res.status(400).json({ error: 'User ID, Day, and Distance are required.' });
  }

  try {
    const goal = new Goal({
      userId,
      day: Number(day),
      distance: Number(distance),
      totalgoals: totalgoals ? Number(totalgoals) : undefined, // Set undefined if empty
      progress: progress ? Number(progress) : undefined        // Set undefined if empty
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a goal
router.delete('/:goalId', async (req, res) => {
  const { goalId } = req.params;

  try {
    const deletedGoal = await Goal.findByIdAndDelete(goalId);
    
    if (!deletedGoal) {
      return res.status(404).json({ error: 'Goal not found.' });
    }

    res.json({ message: 'Goal deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a goal
router.put('/:goalId', async (req, res) => {
  const { goalId } = req.params;
  const { day, distance, totalgoals, progress } = req.body;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(goalId, { day, distance, totalgoals, progress }, { new: true });
    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all goals for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const goals = await Goal.find({ userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
