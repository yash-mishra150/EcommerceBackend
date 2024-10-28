const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,

  },
  phone: {
    type: String,
  },
  profileImage: {
    url: { type: String },
    public_id: { type: String },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  items: [{
    productId: {
      type: String,
    },
    commonId: {
      type: String
    },
    quantity: {
      type: Number,
      default: 1
    },
  }],
}, { _id: false });


module.exports = mongoose.model('User', userSchema);
