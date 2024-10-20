const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
require('dotenv').config();

const mongoose = require('mongoose');

// Connect to MongoDB Atlas

const auth = require('./routes/auth');
const UPP = require('./routes/photoUpdate');
const emailVerify = require('./routes/EmailOTPVerify');
const app = express();
const PORT = process.env.PORT || 3000;

// app.set('trust proxy', 1); // Or use a specific number if you know how many proxies are in front


app.use(bodyParser.json()); 


app.use(cors({ origin: '*' }));


app.use('/api/auth', auth);
app.use('/api/upload', UPP);
app.use('/api/eVerify',emailVerify);
app.get('/', (req, res) => {
  res.send('Welcome to my Node.js backend!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error: ', err));