const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  Business_Code: {
    type: Number,
    required: true,
  },
  Business_Name: {
    type: String,
    required: true,
  },
  Business_Address: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    default: null, 
  },
  Business_Latitude: {
    type: Number,
    required: true,
  },
  Business_Longitude: {
    type: Number,
    required: true,
  },
  Business_Contact: {
    type: String,
    required: true,
  },
  Business_Rating: {
    type: Number,
    required: true,
    min: 0, 
    max: 5,
  },
  Business_Opening_Hrs: {
    type: String,
    required: true,
  },
  Business_Closing_Hrs: {
    type: String,
    required: true,
  },
  Banner_URL: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, 
});


module.exports = mongoose.model('Business', businessSchema);
