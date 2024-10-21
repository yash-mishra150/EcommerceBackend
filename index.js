const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const mongoose = require('mongoose');
const auth = require('./routes/auth');
const UPP = require('./routes/photoUpdate');
const emailVerify = require('./routes/EmailOTPVerify');
const products = require('./routes/Products');
const app = express();
const PORT = process.env.PORT || 3000;

const EventEmitter = require('events');
const bus = new EventEmitter();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

bus.setMaxListeners(20);

// app.set('trust proxy', true);


app.use(bodyParser.json());


app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));


app.use('/api/auth', auth);
app.use('/api/upload', UPP);
app.use('/api/eVerify', emailVerify);
app.use('/api/product', products);
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