require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const dbService = require("./database/connection");

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000; // Ensure the port matches the frontend URL
const server = http.createServer(app);

// Middleware

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post('/webhook', (req, res) => {
  const event = req.body;

  if (event.type === 'payment_intent.succeeded') {
      console.log('Payment succeeded:', event.data.object);
  } else if (event.type === 'payment_intent.payment_failed') {
      console.log('Payment failed:', event.data.object);
  }

  res.status(200).send();
});
// Serve React static files
app.use(express.static(path.join(__dirname, "frontend/build")));

// Serve Tailwind CSS
app.use('/css/tailwind', express.static(path.join(__dirname, 'frontend/build/css')));

// API Routes
const walletRouter = require("./backend/router/router");
app.use("/api/wallet", walletRouter); // Update base path to match frontend

// Test Route
app.get("/api/test", (req, res) => { // Update path to include /api
  res.json({ success: true, message: "Backend is working!" });
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  if (req.path === "/login") {
    res.sendFile(path.join(__dirname, "frontend/build", "login.html"));
  } else if (req.path === "/dashboard") {
    res.sendFile(path.join(__dirname, "frontend/build", "dashboard.html"));
  } else {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  }
});

// Database connection and server startup
const start = async () => {
  try {
    await dbService.serverConnection();
    console.log("Database connected successfully.");
    server.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
};

start();
