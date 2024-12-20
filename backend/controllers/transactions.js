require('dotenv').config()
const jwt = require('jsonwebtoken');
const transactionService = require("../services/transactions");

const transferMoney = async (req, res) => {
    let { user, amount } = req.body; // Extract email and amount from the body
    let senderID = req.query.userID; // Extract senderID from query (decoded from token in middleware)
    try {
        // Validate required fields
        if (!user || !amount || !senderID) {
            return res.status(400).json({
                status_code: 400,
                status: "error",
                message: "Missing required fields: emailAddress, amount, or senderID",
            });
        }

        // Ensure amount is a positive number
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                status_code: 400,
                status: "error",
                message: "Transfer amount must be greater than 0",
            });
        }

        // Prepare data for the service
        const data = {
            senderID,
            recipientID: user, // Using emailAddress to identify the recipient
            amount: parseFloat(amount), // Ensure amount is parsed as a float
        };

        // Call the service to process the transfer
        let status = await transactionService.transferMoney(data);

        console.log("Service Response:", status); // Debugging log

        if (!status.error) {
            res.status(200).json({
                status_code: 200,
                status: "success",
                message: "Money transferred successfully",
                transactionID: status.transactionID,
            });
        } else {
            res.status(400).json({
                status_code: 400,
                status: "error",
                message: status.message || "Transaction failed",
            });
        }
    } catch (error) {
        console.error("Error in transferMoney:", error); // Log the full error for debugging

        res.status(500).json({
            status_code: 500,
            status: "error",
            message: error.message || "Internal Server Error",
        });
    }
};
const depositMoney = async (req, res) => {
    const { amount, stripePaymentMethodId } = req.body;
    const userID = req.query.userID; // Extract sender ID from query or token

    try {
        const response = await transactionService.depositMoney({
            userID,
            amount,
            stripePaymentMethodId,
        });

        if (!response.error) {
            res.status(200).json({
                status_code: 200,
                status: "success",
                message: response.message,
                transactionID: response.transactionID,
            });
        } else {
            res.status(400).json({
                status_code: 400,
                status: "error",
                message: response.message,
            });
        }
    } catch (error) {
        res.status(500).json({
            status_code: 500,
            status: "error",
            message: "Internal Server Error",
        });
    }
};

const getAllTransactions = async (req, res) => {
    let data = req.query;
    data.userID = req.query.userID;
    try {
        let transactions = await transactionService.getAllTransactions(data);

        if (!transactions.error) {
            if (transactions.data && transactions.data.length > 0) {
                res.status(200).json({ status_code: 200, status: "success", data: transactions.data });
            } else {
                res.status(404).json({ status_code: 404, status: "not found", message: "No transactions found" });
            }
        } else {
            res.status(500).json({ status_code: 500, status: "error", message: "Internal Server Error" });
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, status: "server error", message: "Internal Server Error" });
    }
};

const getOneTransaction = async (req, res) => {
    let data = req.query;
    data.userID = req.query.userID;
    data.transactionID = req.params.transactionID;
    try {
        let transaction = await transactionService.getOneTransaction(data);

        if (!transaction.error) {
            if (transaction.data) {
                res.status(200).json({ status_code: 200, status: "success", data: transaction.data });
            } else {
                res.status(404).json({ status_code: 404, status: "not found", message: "Transaction not found" });
            }
        } else {
            res.status(500).json({ status_code: 500, status: "error", message: "Internal Server Error" });
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, status: "server error", message: "Internal Server Error" });
    }
};

const getTransactionByType = async (req, res) => {
    let data = req.query;
    data.userID = req.query.userID;
    data.type = req.params.type;
    try {
        let transactions = await transactionService.getTransactionByType(data);

        if (!transactions.error) {
            if (transactions.data && transactions.data.length > 0) {
                res.status(200).json({ status_code: 200, status: "success", data: transactions.data });
            } else {
                res.status(404).json({ status_code: 404, status: "not found", message: "No transactions found" });
            }
        } else {
            res.status(500).json({ status_code: 500, status: "error", message: "Internal Server Error" });
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, status: "server error", message: "Internal Server Error" });
    }
};

const getTransactionByStatus = async (req, res) => {
    let data = req.query;
    data.userID = req.query.userID;
    data.status = req.params.status;
    try {
        let transactions = await transactionService.getTransactionByStatus(data);

        if (!transactions.error) {
            if (transactions.data && transactions.data.length > 0) {
                res.status(200).json({ status_code: 200, status: "success", data: transactions.data });
            } else {
                res.status(404).json({ status_code: 404, status: "not found", message: "No transactions found" });
            }
        } else {
            res.status(500).json({ status_code: 500, status: "error", message: "Internal Server Error" });
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, status: "server error", message: "Internal Server Error" });
    }
};

module.exports = {
    transferMoney,
    depositMoney,
    getAllTransactions,
    getOneTransaction,
    getTransactionByType,
    getTransactionByStatus
};

