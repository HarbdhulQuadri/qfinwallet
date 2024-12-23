const express = require('express');
const http = require('http');
const app = express();
const router = require('./router/router');
const webSocket = require('./websocket');

// ...existing code...

// Update the base API path
app.use('/api', router); // Make sure this matches the frontend baseURL

// ...existing code...

const server = http.createServer(app);
webSocket.initialize(server);

// ...existing code...

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;