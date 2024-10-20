const express = require('express');
const router = express.Router();
const User = require('../schema/auth/userSchema');
const bcrypt = require('bcrypt');
const { generateToken } = require('../util/jwtToken');
const apiKeyMiddleware = require(`${__dirname}/../middleware/apikey`);
const limiter = require(`${__dirname}/../middleware/rateLimiter`);
const { verifyToken } = require('../util/jwtToken');

router.use(apiKeyMiddleware);
router.use(limiter);


router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ msg: 'User already exists' });
      }


      const hashedPassword = await bcrypt.hash(password, 10);


      let user = new User({
          name,
          email,
          password: hashedPassword,
          phone,
          profileImage: {
              url: '',
              public_id: '',
          },
      });


      await user.save();


      const token = generateToken(user.id);


      res.status(201).json({
          user: {
              id: user.id, 
              name: user.name,
              email: user.email,
              phone: user.phone,
              profileImage: {
                  url: user.profileImage.url || '',
                  public_id: user.profileImage.public_id || '',
              },
          },
          token,
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', error: err.message });
  }
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if(!user.isVerifed){
      return res.status(401).json({ msg: 'Please Verify First' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: {
          url: user.profileImage.url,
          public_id: user.profileImage.public_id,
        },
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      'message': 'Server Error',
      'status': 500
    });
  }
});

router.get('/verify-token', (req, res) => {
  const { token } = req.body; 

  if (!token) {
      return res.status(400).json({
          message: 'Token not provided',
          status: 400,
      });
  }

  try {
      const decoded = verifyToken(token); 

      if (!decoded) {
          return res.status(401).json({
              message: 'Invalid Token',
              status: 401,
          });
      }

      res.json({
          message: 'Token is valid',
          userId: decoded.id, // Include user ID from the token
      });
  } catch (error) {
      console.error(error);
      res.status(500).send({
          message: 'Server Error',
          status: 500,
      });
  }
});

router.get('/profile', async (req, res) => {
  res.json({ msg: 'This is a protected route', user: req.user });
});

module.exports = router;
