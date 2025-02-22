const API_KEY = process.env.API_KEY; // Store your API key in .env file

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.header('api_key');
    if (!apiKey) {
        return res.status(403).json({ msg: 'No Api Key Found' });
    }

    if (apiKey !== API_KEY) {
        return res.status(403).json({ msg: 'Invalid API Key' });
    }
    next();
};

module.exports = apiKeyMiddleware;
