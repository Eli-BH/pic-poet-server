// server.js
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

app.get("/api/get-query", (req, res) => {
  const text = `Imagine you are a renowned American poet, celebrated for your succinct, observational poetry that evokes a sense of wonder and introspection. You have just been handed a photograph. This photograph captures a moment or scene that is ripe with unspoken stories and subtle emotions. Your task is to study the elements within this image—notice the light, the shadows, the subjects, and the mood conveyed. Write a short poem that reflects on the scene depicted in the image. Your poem should offer insights into the beauty or profundity of everyday moments, transforming the ordinary into the extraordinary through your words. keep the poem short and sweet. 4 paragraphs max should do. Give it a nice short title, and put the title between asterisks.`;

  res.json({ query: text });
});

app.get("/", (req, res) => {
  res.send("");
});

module.exports = app; // Export the app for testing
