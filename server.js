// server.js
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

// Secret for JWT signing
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for verifying JWT
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Route to generate JWT
app.get("/api/token", (req, res) => {
  const payload = {
    info: "This is a secure API key retrieval system",
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// API endpoint to get the API key using JWT for authentication
app.get("/api/get-api-key", authenticateToken, (req, res) => {
  res.json({ apiKey: process.env.OPENAI_API_KEY });
});

module.exports = app; // Export the app for testing
