const DbConnection = require("../../database/connection");
const Dbname = require("../../database/name");
const moment = require("moment-timezone");
const transactionsCollection = Dbname.transactionsCollection;
// Transactions {
//     string transactionID PK
//     string senderID FK
//     string recipientID FK
//     decimal amount
//     string type "deposit/transfer/withdrawal"
//     string status "pending/completed/failed"
//     string description
//     datetime createdAt

const createTransaction = async (data) => {
    try {
        // Check if transaction already exists with either transactionID or stripeSessionId
        let query = {};
        if (data.stripeSessionId) {
            query.stripeSessionId = data.stripeSessionId;
        } else {
            query.transactionID = data.transactionID;
        }

        const existing = await DbConnection.findData(transactionsCollection, query);
        
        if (existing.success && existing.data && existing.data.length > 0) {
            return { error: true, message: "Transaction already processed" };
        }

        // Create new transaction
        let date = moment.tz(Date.now(), "Africa/Lagos");
        const newTransaction = {
            ...data,
            createdAt: date.format()
        };
        
        const result = await DbConnection.insertData(transactionsCollection, newTransaction);
        return { error: !result.success, message: result.message, data: result };
    } catch (error) {
        console.error('Create transaction error:', error);
        return { error: true, message: error.message };
    }
};

const getAllTransactions = async (data) => {
    let aggregate = [
        {
            $match: {
                $or: [{ senderID: data.userID }, { recipientID: data.userID }]
            }
        },
        {
            $project: {
                _id: 0, transactionID: 1, senderID: 1, recipientID: 1, amount: 1, 
                type: 1, status: 1, description: 1, createdAt: 1
            }
        }
    ];
    try {
        const result = await DbConnection.aggregateData(transactionsCollection, aggregate);
        return ({ error: false, data: result.data });
    } catch (error) {
        return ({ error: true, message: error.message });
    }
};

const getOneTransaction = async (data) => {
    let aggregate = [
        {
            $match: {
                transactionID: data.transactionID,
                $or: [{ senderID: data.userID }, { recipientID: data.userID }]
            }
        },
        {
            $project: {
                _id: 0, transactionID: 1, senderID: 1, recipientID: 1, amount: 1, 
                type: 1, status: 1, description: 1, createdAt: 1
            }
        }
    ];
    try {
        const result = await DbConnection.aggregateData(transactionsCollection, aggregate);
        return ({ error: false, data: result.data });
    } catch (error) {
        return ({ error: true, message: error.message });
    }
};

const getTransactionByType = async (data) => {
    let aggregate = [
        {
            $match: {
                type: data.type,
                $or: [{ senderID: data.userID }, { recipientID: data.userID }]
            }
        },
        {
            $project: {
                _id: 0, transactionID: 1, senderID: 1, recipientID: 1, amount: 1, 
                type: 1, status: 1, description: 1, createdAt: 1
            }
        }
    ];
    try {
        const result = await DbConnection.aggregateData(transactionsCollection, aggregate);
        return ({ error: false, data: result.data });
    } catch (error) {
        return ({ error: true, message: error.message });
    }
};

const getTransactionByStatus = async (data) => {
    let aggregate = [
        {
            $match: {
                status: data.status,
                $or: [{ senderID: data.userID }, { recipientID: data.userID }]
            }
        },
        {
            $project: {
                _id: 0, transactionID: 1, senderID: 1, recipientID: 1, amount: 1, 
                type: 1, status: 1, description: 1, createdAt: 1
            }
        }
    ];
    try {
        const result = await DbConnection.aggregateData(transactionsCollection, aggregate);
        return ({ error: false, data: result.data });
    } catch (error) {
        return ({ error: true, message: error.message });
    }
};

const updateTransactionStatus = async (data) => {
    try {
        const updateData = {
            $set: {
                status: data.status,
                ...(data.paymentIntentId && { paymentIntentId: data.paymentIntentId }),
                ...(data.stripeSessionId && { stripeSessionId: data.stripeSessionId }),
                updatedAt: moment.tz(Date.now(), "Africa/Lagos").format()
            }
        };

        await DbConnection.updateData(
            transactionsCollection,
            { transactionID: data.transactionID },
            updateData
        );

        return { error: false, message: "Success" };
    } catch (error) {
        return { error: true, message: error.message };
    }
};

const checkExistingTransaction = async (sessionId) => {
    try {
        const existing = await DbConnection.findData(transactionsCollection, {
            stripeSessionId: sessionId
        });
        
        return { 
            error: !existing.success, 
            exists: existing.success && existing.data && existing.data.length > 0, 
            data: existing.data?.[0] 
        };
    } catch (error) {
        console.error('Check transaction error:', error);
        return { error: true, message: error.message };
    }
};

module.exports = { 
    createTransaction,
    getAllTransactions,
    getOneTransaction,
    getTransactionByType,
    getTransactionByStatus,
    updateTransactionStatus,
    checkExistingTransaction
};