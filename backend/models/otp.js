const DbConnection = require("../../database/connection");
const Dbname = require("../../database/name")
const userOTPCollection = Dbname.userOTPCollection
const userCollection = Dbname.userCollection


const addOTP = async (data) => {
    let myquery = { userID: data.userID };
    let newvalues = {
        $set: {
            userID: data.userID, otp: Number(data.otp), expire_at: data.expire_at
        }
    };
    let upsert = { upsert: true }
    try {
        await DbConnection.updateData(userOTPCollection, myquery, newvalues, upsert);
        return ({ error: false, message: "sucessfully" })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const updateEmailVerify = async (data) => {
    let myquery = { userID: data.userID };
    let newvalues = {
        $set: {
            userID: data.userID, emailVerify : true
        }
    };
    let upsert = { upsert: true }
    try {
        await DbConnection.updateData(userCollection, myquery, newvalues, upsert);
        return ({ error: false, message: "sucessfully" })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const getOTP = async (data) => {
    let query = { userID: data.userID };
    let select = {
        projection: {
            _id: 0, userID: 1, otp: 1, expire_at: 1
        }
    };
    try {
        const result = await DbConnection.findAndSelectData(userOTPCollection, query, select);
        return ({ error: false, data: result.data })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

module.exports = {
    addOTP,
    updateEmailVerify,
    getOTP
}