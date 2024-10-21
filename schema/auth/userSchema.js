const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4, 
  },
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
    type: String, 
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
  isVerified: { 
    type: Boolean,
    default: false,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
    },
  }],
});


module.exports = mongoose.model('User', userSchema);
