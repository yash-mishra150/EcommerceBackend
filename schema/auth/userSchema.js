const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  phone: {
    type: Number,
    required: true,
  },
  profileImage: {
    url: { type: String },
    public_id: { type: String },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isVerifed: {
    type: Boolean,
    default: false
  }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
