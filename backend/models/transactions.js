const DbConnection = require("../../database/connection");
const Dbname = require("../../database/name")
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
    let date = moment.tz(Date.now(), "Africa/Lagos");
    let myquery = { transactionID: data.transactionID };
    let newvalues = {
        $set: {
            transactionID: data.transactionID,
            senderID: data.senderID,
            recipientID: data.recipientID,
            amount: data.amount,
            type: data.type,
            status: data.status,
            description: data.description,
            createdAt: date.format()
        }
    };
    let upsert = { upsert: true };
    try {
        await DbConnection.updateData(transactionsCollection, myquery, newvalues, upsert);
        return ({ error: false, message: "  Success" });
    } catch (error) {
        return ({ error: true, message: error.message });
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

module.exports = { 
    createTransaction,
    getAllTransactions,
    getOneTransaction,
    getTransactionByType,
    getTransactionByStatus
};