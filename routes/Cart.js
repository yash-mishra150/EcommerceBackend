const express = require('express');
const router = express.Router();
const User = require('../schema/auth/userSchema');
const apiKeyMiddleware = require(`${__dirname}/../middleware/apikey`);
const limiter = require(`${__dirname}/../middleware/rateLimiter`);
const removeWhitespace = require(`${__dirname}/../middleware/removeWhitespaces`);
