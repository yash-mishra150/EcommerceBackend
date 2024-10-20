const express = require('express');
const router = express.Router();
const User = require('../schema/auth/userSchema');
const bcrypt = require('bcrypt');
const { generateToken } = require('../util/jwtToken');
const apiKeyMiddleware = require(`${__dirname}/../middleware/apikey`);
const limiter = require(`${__dirname}/../middleware/rateLimiter`);
const { check, validationResult } = require('express-validator');
const removeWhitespace = require(`${__dirname}/../middleware/removeWhitespaces`);


router.use(apiKeyMiddleware);
router.use(limiter);
router.use(removeWhitespace);

// Registration route with validations
router.post('/register', [
  check('name').trim().notEmpty().withMessage('Name is required.'),
  check('email').trim().isEmail().withMessage('Please include a valid email.'),
  check('phone')
    .trim()
    .isMobilePhone('any').withMessage('Please provide a valid phone number.'),
  check('phone')
    .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 digits long.'),
  check('password')
    .trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
  
], async (req, res) => {
  console.log('Received request body:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    let existingPhoneUser = await User.findOne({ phone });
    if (existingUser || existingPhoneUser) {
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

// Login route
router.post('/login', [
  check('email').isEmail().withMessage('Please include a valid email.'),
  check('password').notEmpty().withMessage('Password is required.')
], async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isVerifed) {
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
      message: 'Server Error',
      status: 500,
    });
  }
});

module.exports = router;
