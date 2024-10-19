const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10, 
    message: 'Too many requests from this IP, please try again later. Try again after 5 minutes',
});

module.exports = limiter;
