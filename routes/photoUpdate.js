const express = require('express');
const router = express.Router();
const User = require('../schema/auth/userSchema');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles', 
    allowed_formats: ['jpg', 'png', 'jpeg'], 
  },
});

const upload = multer({ storage: storage });

// Upload profile image
router.post('/:id', upload.single('profileImage'), async (req, res) => {
  const userId = req.params.id;

  try {
    // Find user by custom id
    const user = await User.findOne({ id: userId }); // Using the custom id field
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Update user profile image
    user.profileImage = {
      url: req.file.path, // URL from the multer upload
      public_id: req.file.filename, // Use filename provided by multer
    };

    await user.save();
    res.status(200).json({
      message: 'Successfully updated',
      user: {
        id: user.id, // Use the custom id field
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: 'Error in Uploading',
      status: 500,
    });
  }
});

module.exports = router;
