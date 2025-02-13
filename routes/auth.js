const express = require("express");
const router = express.Router();
const User = require("../schema/auth/userSchema");
const bcrypt = require("bcrypt");
const { generateToken } = require("../util/jwtToken");

const { check, validationResult } = require("express-validator");

const { verifyToken } = require("../util/jwtToken");
const logger = require("../middleware/logging/logger");

router.post(
  "/register",
  [
    check("name").trim().notEmpty().withMessage("Name is required."),
    check("email")
      .trim()
      .isEmail()
      .withMessage("Please include a valid email."),
    check("phone")
      .trim()
      .isMobilePhone("any")
      .withMessage("Please provide a valid phone number."),
    check("phone")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be 10 digits long."),
    check("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  async (req, res) => {
    logger.info("Received request body:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    try {
      if (!name || !email || !password || !phone) {
        return res
          .status(400)
          .json({ msg: "Please provide all required details." });
      }

      const existingUser = await User.findOne({ name, phone });
      const existingEmail = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists." });
      }
      if (!existingEmail) {
        return res.status(404).json({ msg: "Please verify first." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          name,
          password: hashedPassword,
          phone,
          profileImage: {
            url: "",
            public_id: "",
          },
        },
        { new: true }
      );

      const token = generateToken(updatedUser.id);

      res.status(200).json({
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          profileImage: {
            url: updatedUser.profileImage.url || "",
            public_id: updatedUser.profileImage.public_id || "",
          },
        },
        token,
      });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please include a valid email."),
    check("password").notEmpty().withMessage("Password is required."),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      if (!user.isVerified) {
        return res.status(401).json({ msg: "Please Verify First" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
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
      logger.error(err);
      res.status(500).send({
        message: "Server Error",
        status: 500,
      });
    }
  }
);

router.post("/verify-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: "Token not provided",
      status: 400,
    });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        status: 401,
      });
    }

    res.status(200).json({
      message: "Token is valid",
      userId: decoded.id,
      status: 200,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Server error",
      status: 500,
    });
  }
});

module.exports = router;
