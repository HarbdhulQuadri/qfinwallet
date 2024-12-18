require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
// const initializeSocket = require('./socketHandler');
const dbService = require("./database/connection");

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Set up Socket.io
// initializeSocket(io);
// Combine body parsing middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Modular routers
const liftzorRouter = require("./backend/router/route");

app.use("/liftzor", liftzorRouter);

app.get("/test", (req, res) => {
  res.json({
    success: true,
    data: "here.......................",
  });
});

// 404 Not Found middleware
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Not Found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return res.status(404).json({
      status: 404,
      message: "Not Found",
    });
  }

  if (err.status === 500) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }

  // If the error doesn't match 404 or 500, you might want to log it
  console.error(err.message);

  // Optional: Send a generic error response
  res.status(500).json({
    status: 500,
    message: "Internal Server Error",
  });
});

// Connect to the Database and start the server
const start = async () => {
  try {
    await dbService.serverConnection();
    console.log("Connection to DB Successful...");
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    // simulate a ready application after 1 second
    setTimeout(function () {
      // process.send('ready');
    }, 1000);
  } catch (error) {
    console.error(error.message);
  }
};

start();

module.exports = server;
