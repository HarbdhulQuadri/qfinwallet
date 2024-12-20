require("dotenv").config();
const transactionModel = require("../models/transactions");
const userModel = require("../models/users");
const cryptoRandomString = require("crypto-random-string");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const transferMoney = async (data) => {
    try {
        const { senderID, recipientID, amount } = data;

        // Validate required fields
        if (!amount || amount <= 0) {
            throw new Error("Transfer amount must be greater than 0");
        }

        // Fetch sender's profile
        const senderData = await userModel.getShortProfile({ user: senderID });
        if (senderData.error || !senderData.data.length) {
            throw new Error("Sender does not exist");
        }
        const sender = senderData.data[0];

        // Fetch recipient's profile
        const recipientData = await userModel.getShortProfile({ user: recipientID });
        if (recipientData.error || !recipientData.data.length) {
            throw new Error("Recipient does not exist");
        }
        const recipient = recipientData.data[0];
        console.log(recipient, "Recipieny")

        // Validate sender's balance
        if (sender.balance < amount) {
            throw new Error("Insufficient funds");
        }

        // Generate unique transaction ID
        const transactionID = await cryptoRandomString({ length: 12, type: "alphanumeric" });

        // Perform atomic balance updates
        const senderNewBalance = sender.balance - amount;
        const recipientNewBalance = recipient.balance + amount;

        // Update sender's balance
        const updateSender = await userModel.updateBalance({
            userID: sender.userID,
            balance: senderNewBalance,
        });
        if (updateSender.error) {
            throw new Error("Failed to update sender's balance");
        }

        // Update recipient's balance
        const updateRecipient = await userModel.updateBalance({
            userID: recipient.userID,
            balance: recipientNewBalance,
        });
        if (updateRecipient.error) {
            throw new Error("Failed to update recipient's balance");
        }

        // Log the transaction
        const transactionData = {
            transactionID,
            senderID: sender.userID,
            recipientID: recipient.userID,
            amount,
            type: "transfer",
            status: "completed",
            description: `Transfer of ${amount} from ${sender.userID} to ${recipient.userID}`,
            createdAt: new Date(),
        };
        const logTransaction = await transactionModel.createTransaction(transactionData);
        if (logTransaction.error) {
            throw new Error("Failed to log transaction");
        }
        console.log("loe", logTransaction)

        // Return success response
        return {
            error: false,
            message: "Money transferred successfully",
            transactionID,
        };
    } catch (error) {
        return {
            error: true,
            message: error.message,
        };
    }
};


const depositMoney = async (data) => {
    let transactionID = null; // Initialize the transaction ID to use for logging
    try {
        const { userID, amount, stripePaymentMethodId } = data;

        // Validate required fields
        if (!amount || amount <= 0) {
            throw new Error("Deposit amount must be greater than 0");
        }

        // Fetch user's profile
        const userData = await userModel.getShortProfile({ user: userID });
        if (userData.error || !userData.data.length) {
            throw new Error("User does not exist");
        }
        const user = userData.data[0];

        // Generate transaction ID
        transactionID = await cryptoRandomString({ length: 12, type: "alphanumeric" });

        // Create a Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Amount in the smallest currency unit
            currency: "usd",
            confirm: true, // Automatically confirm the intent
            automatic_payment_methods: { enabled: true },
            description: `Deposit of ${amount} by user ${userID}`,
        });
        
        

        if (paymentIntent.status !== "succeeded") {
            throw new Error("Payment failed. Please try again.");
        }

        // Update user's balance
        const newBalance = user.balance + amount;
        const updateBalance = await userModel.updateBalance({
            userID: user.userID,
            balance: newBalance,
        });

        if (updateBalance.error) {
            throw new Error("Failed to update user's balance");
        }

        // Log the successful transaction
        const transactionData = {
            transactionID,
            senderID: user.userID,
            recipientID: null, // No recipient for deposits
            amount,
            type: "deposit",
            status: "completed", // Completed because the payment succeeded
            description: `Deposit of ${amount} by user ${userID}`,
            createdAt: new Date(),
        };
        const logTransaction = await transactionModel.createTransaction(transactionData);
        if (logTransaction.error) {
            throw new Error("Failed to log transaction");
        }

        // Return success response
        return {
            error: false,
            message: "Deposit successful",
            transactionID,
        };
    } catch (error) {
        // Log failed transaction
        if (transactionID) {
            const failedTransactionData = {
                transactionID,
                senderID: data.userID,
                recipientID: null,
                amount: data.amount || 0,
                type: "deposit",
                status: "failed", // Mark as failed
                description: `Failed deposit of ${data.amount || 0} by user ${data.userID}: ${error.message}`,
                createdAt: new Date(),
            };
            await transactionModel.createTransaction(failedTransactionData); // Log failed transaction
        }

        // Return error response
        return {
            error: true,
            message: error.message,
        };
    }
};

const getAllTransactions = async (data) => {
    try {
        const transactions = await transactionModel.getAllTransactions(data);
        return transactions;
    } catch (error) {
        return ({ error: true, message: error.message });
    }
};

const getOneTransaction = async (data) => {
    try {
        const transaction = await transactionModel.getOneTransaction(data);
        return transaction;
    } catch (error) {
        return ({ error: true, message: error.message });
    }
};

const getTransactionByType = async (data) => {
    try {
        const transactions = await transactionModel.getTransactionByType(data);
        return transactions;
    } catch (error) {
        return ({ error: true, message: error.message });
    }
};

const getTransactionByStatus = async (data) => {
    try {
        const transactions = await transactionModel.getTransactionByStatus(data);
        return transactions;
    } catch (error) {
        return ({ error: true, message: error.message });
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
