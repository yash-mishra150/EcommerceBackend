const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later. Try again after 5 minutes',
});

module.exports = limiter;
