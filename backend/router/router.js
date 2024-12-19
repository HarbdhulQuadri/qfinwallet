const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/users');
const userController = require('../controllers/users');

router.post('/user/register', userMiddleware.register, userController.register);

module.exports = router;
