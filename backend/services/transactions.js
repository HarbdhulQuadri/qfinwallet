require("dotenv").config();
const transactionModel = require("../models/transactions");
const userModel = require("../models/users");
const cryptoRandomString = require("crypto-random-string");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const transferMoney = async (data) => {
    try {
        const { senderID, recipientID, amount } = data;

        // Prevent self-transfer
        if (senderID === recipientID) {
            throw new Error("Cannot transfer money to yourself");
        }

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
    try {
        console.log('Deposit money called with data:', data);
        const { userID, amount, paymentIntentId, stripeSessionId } = data;

        // Get user profile
        const userData = await userModel.getShortProfile({ user: userID });
        if (userData.error || !userData.data.length) {
            throw new Error("User does not exist");
        }
        const user = userData.data[0];

        // Generate transaction ID if not provided
        const transactionID = data.transactionID || await cryptoRandomString({ length: 12, type: "alphanumeric" });

        // Update balance first
        const newBalance = parseFloat(user.balance || 0) + parseFloat(amount);
        const updateBalance = await userModel.updateBalance({
            userID: user.userID,
            balance: newBalance,
        });

        if (updateBalance.error) {
            throw new Error("Failed to update balance");
        }

        // Create transaction record
        const transactionData = {
            transactionID,
            senderID: userID,
            recipientID: userID,
            amount: parseFloat(amount),
            type: "deposit",
            status: "completed",
            description: `Deposit of $${parseFloat(amount).toFixed(2)}`,
            stripePaymentId: paymentIntentId,
            stripeSessionId: stripeSessionId,
            createdAt: new Date(),
        };
        
        console.log('Creating transaction record:', transactionData);
        const result = await transactionModel.createTransaction(transactionData);
        
        if (result.error) {
            // Rollback balance update if transaction creation fails
            await userModel.updateBalance({
                userID: user.userID,
                balance: user.balance,
            });
            throw new Error(result.message || "Failed to log transaction");
        }

        return {
            error: false,
            success: true,
            message: "Deposit successful",
            transactionID,
        };
    } catch (error) {
        console.error('Deposit money error:', error);
        return {
            error: true,
            message: error.message,
        };
    }
};

const createPendingTransaction = async (data) => {
    try {
        const transactionData = {
            transactionID: data.transactionID,
            senderID: data.userID,
            recipientID: data.userID,
            amount: data.amount,
            type: 'deposit',
            status: 'pending',
            description: `Pending deposit of $${data.amount.toFixed(2)}`,
            createdAt: new Date()
        };

        const result = await transactionModel.createTransaction(transactionData);
        return {
            error: false,
            transactionID: data.transactionID
        };
    } catch (error) {
        return {
            error: true,
            message: error.message
        };
    }
};

const updateTransactionAndDeposit = async (data) => {
    try {
        // Update transaction status first
        await transactionModel.updateTransactionStatus({
            transactionID: data.transactionID,
            status: 'completed',
            paymentIntentId: data.paymentIntentId,
            stripeSessionId: data.stripeSessionId
        });

        // Then update user balance
        const userData = await userModel.getShortProfile({ user: data.userID });
        if (userData.error || !userData.data.length) {
            throw new Error("User does not exist");
        }

        const user = userData.data[0];
        const newBalance = parseFloat(user.balance || 0) + parseFloat(data.amount);
        
        const updateBalance = await userModel.updateBalance({
            userID: data.userID,
            balance: newBalance
        });

        if (updateBalance.error) {
            throw new Error("Failed to update balance");
        }

        return {
            error: false,
            transactionID: data.transactionID
        };
    } catch (error) {
        return {
            error: true,
            message: error.message
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

const checkExistingTransaction = async (sessionId) => {
    try {
        const result = await transactionModel.checkExistingTransaction(sessionId);
        return result;
    } catch (error) {
        return {
            error: true,
            message: error.message
        };
    }
};

module.exports = {
    transferMoney,
    depositMoney,
    getAllTransactions,
    getOneTransaction,
    getTransactionByType,
    getTransactionByStatus,
    createPendingTransaction,
    updateTransactionAndDeposit,
    updateTransactionStatus: transactionModel.updateTransactionStatus,
    checkExistingTransaction
};
