require('dotenv').config()
const jwt = require('jsonwebtoken');
const transactionService = require("../services/transactions");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cryptoRandomString = require("crypto-random-string");


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
        res.status(500).json({
            status_code: 500,
            status: "error",
            message: error.message || "Internal Server Error",
        });
    }
};

const depositMoney = async (req, res) => {
    const { amount } = req.body;
    const userID = req.query.userID;

    try {
        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                userID: userID,
            }
        });

        res.status(200).json({
            status_code: 200,
            status: "success",
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(400).json({
            status_code: 400,
            status: "error",
            message: error.message || "Failed to initiate deposit"
        });
    }
};

// Add new endpoint to handle successful payment
const confirmDeposit = async (req, res) => {
    const { paymentIntentId } = req.body;
    const userID = req.query.userID;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            const amount = paymentIntent.amount / 100; // Convert from cents
            
            // Process the deposit through service
            const response = await transactionService.depositMoney({
                userID,
                amount,
                paymentIntentId
            });

            if (!response.error) {
                res.status(200).json({
                    status_code: 200,
                    status: "success",
                    message: "Deposit successful",
                    transactionID: response.transactionID,
                });
            } else {
                throw new Error(response.message);
            }
        } else {
            throw new Error('Payment not successful');
        }
    } catch (error) {
        res.status(400).json({
            status_code: 400,
            status: "error",
            message: error.message || "Failed to confirm deposit"
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

const createCheckoutSession = async (req, res) => {
    const { amount } = req.body;
    const userID = req.query.userID;

    try {
        // Create initial pending transaction
        const transactionID = await cryptoRandomString({ length: 12, type: "alphanumeric" });
        const pendingTransaction = await transactionService.createPendingTransaction({
            transactionID,
            userID,
            amount: parseFloat(amount),
            type: 'deposit',
            status: 'pending'
        });

        if (pendingTransaction.error) {
            throw new Error(pendingTransaction.message);
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Wallet Deposit',
                    },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: req.body.success_url,
            cancel_url: req.body.cancel_url,
            metadata: {
                userID: userID,
                amount: amount,
                transactionID: transactionID
            }
        });

        res.status(200).json({
            status: 'success',
            url: session.url,
            transactionID
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Failed to create checkout session'
        });
    }
};

const handleStripeWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const rawBody = req.body;

        let event;
        try {
            // Parse the raw body
            event = JSON.parse(rawBody);
        } catch (err) {
            event = rawBody; // If already parsed
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            // Update existing transaction and process deposit
            const depositResult = await transactionService.updateTransactionAndDeposit({
                transactionID: session.metadata.transactionID,
                userID: session.metadata.userID,
                amount: parseFloat(session.metadata.amount),
                paymentIntentId: session.payment_intent,
                stripeSessionId: session.id,
                status: 'completed'
            });

            if (depositResult.error) {
                throw new Error(depositResult.message);
            }

            res.json({ received: true, success: true });
        } else if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
            // Handle failed payment by updating transaction status
            const session = event.data.object;
            await transactionService.updateTransactionStatus({
                transactionID: session.metadata.transactionID,
                status: 'failed'
            });
            
            res.json({ received: true });
        } else {
            res.json({ received: true });
        }
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const verifyPayment = async (req, res) => {
    const sessionId = req.params.sessionId;
    const userID = req.query.userID;

    try {
        const existingTransaction = await transactionService.checkExistingTransaction(sessionId);
        if (existingTransaction.exists) {
            return res.json({
                status: 'success',
                message: 'Payment already processed',
                data: existingTransaction.data
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
            throw new Error(`Payment incomplete. Status: ${session.payment_status}`);
        }

        // Process the payment
        const depositResult = await transactionService.depositMoney({
            userID,
            amount: session.amount_total / 100,
            paymentIntentId: session.payment_intent,
            stripeSessionId: sessionId
        });

        if (depositResult.error) {
            throw new Error(depositResult.message);
        }

        res.json({
            status: 'success',
            message: 'Payment verified successfully',
            data: {
                transactionId: depositResult.transactionID,
                amount: session.amount_total / 100
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Payment verification failed'
        });
    }
};

const getTransactionBySessionId = async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const userID = req.query.userID;

        const existingTransaction = await transactionService.checkExistingTransaction(sessionId);
        
        if (!existingTransaction.error && existingTransaction.exists) {
            return res.json({
                status: 'success',
                data: existingTransaction.data
            });
        }

        res.status(404).json({
            status: 'error',
            message: 'Transaction not found'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get transaction'
        });
    }
};

module.exports = {
    transferMoney,
    depositMoney,
    getAllTransactions,
    getOneTransaction,
    getTransactionByType,
    getTransactionByStatus,
    confirmDeposit,
    createCheckoutSession,
    handleStripeWebhook,
    verifyPayment,
    getTransactionBySessionId
};

