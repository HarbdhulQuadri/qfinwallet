
const express = require('express');
const app = express();
const router = require('./router/router');

// ...existing code...

// Update the base API path
app.use('/api', router); // Make sure this matches the frontend baseURL

// ...existing code...

module.exports = app;