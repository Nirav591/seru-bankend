const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const questionRoutes = require("./routes/questionRoutes");

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// CORS Middleware
const allowedOrigins = [
    "http://localhost:3039", // Your frontend local development origin
    "http://13.40.120.157:6340", // API server origin
    "http://sheru.solidblackabroad.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy does not allow access from this origin"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "x-access-key"], // Allow necessary headers
    credentials: true, // Allow cookies and credentials if required
  })
);

// Handle preflight requests
app.options("*", cors());

// Middleware to check the x-access-key header
const checkHeaderString = (req, res, next) => {
  const requiredString = "your-secret-string"; // Replace with your required string

  // Check if the required string is in the header
  const headerValue = req.headers["x-access-key"];

  if (headerValue && headerValue === requiredString) {
    return next(); // If valid, move to the next middleware or route handler
  }

  // If not valid, send an error response
  return res.status(403).json({ message: "Forbidden: Invalid or missing header string" });
};

// Apply the custom header check middleware
app.use(checkHeaderString);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/questions", questionRoutes);

// Start the server
const PORT = process.env.PORT || 6340;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
