const DbConnection = require("../../database/connection");
const Dbname = require("../../database/name")
const moment = require("moment-timezone");
const userCollection = Dbname.userCollection


const register = async (data) => {
    let date = moment.tz(Date.now(), "Africa/Lagos");
    let myquery = { userID: data.userID };
    let newvalues = {
        $set: {
            userID: data.userID, 
            fullName: data.fullName, 
            emailAddress: data.emailAddress,
            phoneNumber: data.phoneNumber,
            password: data.password,
            registerType: "password",
            kycStatus: false,
            status: "active",
            emailVerify: false,
            balance:0, 
            registerDate: date.format()
        }
    };
    let upsert = { upsert: true }
    try {
         await DbConnection.updateData(userCollection, myquery, newvalues, upsert);
        return ({ error: false, message: "user registered successfully" });
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}




const getShortProfile = async (data) => {
    let query = { $or: [{ emailAddress: data.user },
            { phoneNumber: data.user}, {userID : data.user }] };
    let select = {
        projection: {
            _id: 0, userID : 1, emailAddress: 1, phoneNumber: 1, password: 1, 
            emailVerify : 1, biometricID : 1,balance:1,
        }
    };
    try {
        const result = await DbConnection.findAndSelectData(userCollection, query, select);
        return ({ error: false, data: result.data })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}


const addNewPassword = async (data) => {
    let myquery = { userID: data.userID };
    let newvalues = {
        $set: {
            userID: data.userID,  
            password: data.password
        }
    };
    let upsert = { upsert: true }
    try {
         await DbConnection.updateData(userCollection, myquery, newvalues, upsert);
        return ({ error: false, message: "successfully" });
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

  
module.exports = {
    register,
    getShortProfile,
    addNewPassword,
}