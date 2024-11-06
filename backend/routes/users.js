// users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register new user (POST)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if all required fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    
    // Exclude the password from the response
    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData); 
  } catch (err) {
    // Check for duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Login user (POST)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Send back user data without password
    const { password: _, ...userData } = user.toObject();
    res.json(userData);  // Return all user data (minus password)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users (GET)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a user by ID (GET)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user settings (PUT)
router.put('/account-settings/update-settings', async (req, res) => {
  const { userId, fullName, dob, weight, height, goal } = req.body;
  
  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    // Find the user and update their account settings
    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, dob, weight, height, goal },
      { new: true } // Return the updated user
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the updated user data back
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get user settings (GET)
router.get('/account-settings/:userId', async (req, res) => {
  const { userId } = req.params;
  
  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the user's data back
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Partially update user settings (PATCH)
router.patch('/account-settings/:userId', async (req, res) => {
  const { userId } = req.params;
  const { fullName, dob, weight, height, goal } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    // Find the user and update the provided fields
    const updatedFields = { fullName, dob, weight, height, goal };
    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key]
    ); // Remove undefined fields

    const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the updated user data back
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete a user account (DELETE)
router.delete('/account-settings/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User account successfully deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
