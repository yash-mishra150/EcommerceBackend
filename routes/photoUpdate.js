const express = require('express');
const router = express.Router();
const User = require('../schema/auth/userSchema');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const apiKeyMiddleware = require('../middleware/apiKey');
const limiter = require('../middleware/rateLimiter');


router.use(apiKeyMiddleware);
router.use(limiter);


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles', 
    allowed_formats: ['jpg', 'png', 'jpeg'], 
  },
});

const upload = multer({ storage: storage });


router.post('/:id', upload.single('profileImage'), async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }


    const result = await cloudinary.uploader.upload(req.file.path);


    user.profileImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await user.save();
    res.status(200).json({
        message: 'Successfully updated',
        status: 200
      });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      'message': 'Error in Uploading',
      'status': 500
    });
  }
});

module.exports = router;
