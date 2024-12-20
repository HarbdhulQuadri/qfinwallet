const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/users');
const userController = require('../controllers/users');
const transactionController = require('../controllers/transactions');


router.post('/user/register', userMiddleware.register, userController.register);
router.post('/user/verifyOTP', userMiddleware.verifyOTP, userController.verifyOTP);
router.post('/user/resendOTP', userMiddleware.resendOTP, userController.resendOTP);
router.post('/user/login', userMiddleware.login, userController.login);
router.post('/user/resetPassword', userMiddleware.resetPassword, userController.resetPassword);
router.post('/user/addNewPassword', userMiddleware.getToken, userController.addNewPassword);
router.post('/user/forgotPassword', userMiddleware.resetPassword, userController.forgotPassword);
router.get('/user/profile', userMiddleware.getToken, userController.getUserProfile);

// Transactions
router.post('/transaction/transfer', userMiddleware.getToken, transactionController.transferMoney);
router.post('/transaction/deposit', userMiddleware.getToken, transactionController.depositMoney);
router.get('/transactions', userMiddleware.getToken, transactionController.getAllTransactions);
router.get('/transaction/:transactionID', userMiddleware.getToken, transactionController.getOneTransaction);
router.get('/transactions/:type', userMiddleware.getToken, transactionController.getTransactionByType);
router.get('/transactions/:status', userMiddleware.getToken, transactionController.getTransactionByStatus);

module.exports = router;
