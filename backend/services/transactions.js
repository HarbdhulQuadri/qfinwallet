const transactionModel = require("../models/transactions");
const userModel = require("../models/users");
const cryptoRandomString = require("crypto-random-string");

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
        console.log(recipient,"Recipieny")

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
        console.log("loe",logTransaction)

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

module.exports = {
    transferMoney,
};
