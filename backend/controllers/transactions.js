require('dotenv').config()
const jwt = require('jsonwebtoken');
const transactionService = require("../services/transactions");



// const transferMoney = async (req, res) => {
//     let data = req.body;
//     data.senderID = req.query.userID; // Get senderID from request query
//     try {
//         // Validate required fields
//         const { senderID, recipientID, amount } = data;
//         if (!senderID || !recipientID || !amount) {
//             return res.status(400).json({ status_code: 400, status: "error", message: "Missing required fields (senderID, recipientID, or amount)" });
//         }
//         if (amount <= 0) {
//             return res.status(400).json({ status_code: 400, status: "error", message: "Transfer amount must be greater than 0" });
//         }

//         // Fetch sender's profile
//         const senderProfile = await authService.getShortProfile({ user: senderID });
//         if (senderProfile.error || !senderProfile.data.length) {
//             return res.status(404).json({ status_code: 404, status: "error", message: "Sender does not exist" });
//         }
//         const sender = senderProfile.data[0];

//         // Check sender's balance
//         if (sender.balance < amount) {
//             return res.status(400).json({ status_code: 400, status: "error", message: "Insufficient funds" });
//         }

//         // Fetch receiver's profile
//         const recipientProfile = await authService.getShortProfile({ user: recipientID });
//         if (recipientProfile.error || !recipientProfile.data.length) {
//             return res.status(404).json({ status_code: 404, status: "error", message: "Recipient does not exist" });
//         }
//         const recipient = recipientProfile.data[0];

//         // Generate unique transaction ID
//         const transactionID = await cryptoRandomString({ length: 12, type: "alphanumeric" });

//         // Create a transaction log
//         const transactionData = {
//             transactionID,
//             senderID: sender.userID,
//             recipientID: recipient.userID,
//             amount,
//             type: "transfer",
//             status: "completed",
//             description: `Transfer of ${amount} from ${sender.userID} to ${recipient.userID}`,
//         };

//         // Execute atomic balance update and transaction log
//         const result = await transactionService.transferBalances({
//             senderID: sender.userID,
//             recipientID: recipient.userID,
//             amount,
//             transactionData,
//         });

//         if (result.error) {
//             throw new Error(result.message);
//         }

//         return res.status(200).json({
//             status_code: 200,
//             status: "success",
//             message: "Money transferred successfully",
//             transactionID,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status_code: 500,
//             status: "error",
//             message: error.message,
//         });
//     }
// };
// const transferMoney = async (req, res) => {
//     let data = req.query;

//     console.log("Incoming Data:", data); // Debugging log
//     data.senderID = data.userID; // Extracted from token in middleware


//     try {
//         // Validate required fields
//         if (!data.senderID || !data.recipientID || !data.amount) {
//             return res.status(400).json({
//                 status_code: 400,
//                 status: "error",
//                 message: "Missing required fields: senderID, recipientID, or amount",
//             });
//         }

//         // Ensure amount is a positive number
//         if (isNaN(data.amount) || data.amount <= 0) {
//             return res.status(400).json({
//                 status_code: 400,
//                 status: "error",
//                 message: "Transfer amount must be greater than 0",
//             });
//         }

//         // Call the service to process the transfer
//         let status = await transactionService.transferMoney(data);

//         console.log("Service Response:", status); // Debugging log

//         if (!status.error) {
//             res.status(200).json({
//                 status_code: 200,
//                 status: "success",
//                 message: "Money transferred successfully",
//                 transactionID: status.transactionID,
//             });
//         } else {
//             res.status(400).json({
//                 status_code: 400,
//                 status: "error",
//                 message: status.message || "Transaction failed",
//             });
//         }
//     } catch (error) {
//         console.error("Error in transferMoney:", error); // Log the full error for debugging

//         res.status(500).json({
//             status_code: 500,
//             status: "error",
//             message: error.message || "Internal Server Error",
//         });
//     }
// };
const transferMoney = async (req, res) => {
    let { user, amount } = req.body; // Extract email and amount from the body
    let senderID = req.query.userID; // Extract senderID from query (decoded from token in middleware)

    console.log("Incoming Data:", { user, amount, senderID }); // Debugging log

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



module.exports = {
    transferMoney,
};

