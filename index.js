const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const apiKeyMiddleware = require(`${__dirname}/./middleware/Security/API_Security/apikey`);
const limiter = require(`${__dirname}/./middleware/Security/RateLimiting/rateLimiter`);
const removeWhitespace = require(`${__dirname}/./middleware/Validations/removeWhitespaces`);
const { restrictIpAddress }  = require(`${__dirname}/./middleware/Security/IPRestriction/security`);
const sanitizeInput = require("${__dirname}/./middleware/Validations/Sanitization");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const UPP = require("./routes/photoUpdate");
const emailVerify = require("./routes/EmailOTPVerify");
const products = require("./routes/Products");
const cart = require("./routes/Cart");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.set("trust proxy", 1);
const EventEmitter = require("events");
const logger = require("./middleware/logging/logger");
const bus = new EventEmitter();
bus.setMaxListeners(20);

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(apiKeyMiddleware);
// app.use(limiter);
app.use(removeWhitespace);
app.use(restrictIpAddress("*"));
app.use(sanitizeInput)

// Route setup
app.use("/api/auth", auth);
app.use("/api/upload", UPP);
app.use("/api/eVerify", emailVerify);
app.use("/api/product", products);
app.use("/api/cart", cart);

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to my Node.js backend!");
});

// Server setup
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => logger.error("MongoDB connection error: ", err));
