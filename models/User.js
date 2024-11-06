const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: String,
  dob: Date,
  weight: Number,
  height: Number,
  goal: String,
});

module.exports = mongoose.model('User', UserSchema);
