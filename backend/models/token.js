const DbConnection = require("../../database/connection");
const Dbname = require("../../database/name")
const userTokenCollection = Dbname.userTokenCollection

const addToken = async (data) => {
    let myquery = { userID: data.userID };
    let newvalues = {
        $set: {
            userID: data.userID, accessToken: data.accessToken, expire_at: data.expire_at
        }
    };
    let upsert = { upsert: true }
    try {
        await DbConnection.updateData(userTokenCollection, myquery, newvalues, upsert);
        return ({ error: false, message: "sucessfully" })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const getToken = async (data) => {
    let query = { userID: data.userID };
    let select = {
        projection: {
            _id: 0, userID: 1, accessToken: 1, expire_at: 1
        }
    };
    try {
        const result = await DbConnection.findAndSelectData(userTokenCollection, query, select);
        return ({ error: false, data: result.data })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}
const addFleetToken = async (data) => {
    let myquery = { fleetID: data.fleetID };
    let newvalues = {
        $set: {
            fleetID: data.fleetID, accessToken: data.accessToken, expire_at: data.expire_at
        }
    };
    let upsert = { upsert: true }
    try {
        await DbConnection.updateData(userTokenCollection, myquery, newvalues, upsert);
        return ({ error: false, message: "sucessfully" })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const getFleetToken = async (data) => {
    let query = { fleetID: data.fleetID };
    let select = {
        projection: {
            _id: 0, fleetID: 1, accessToken: 1, expire_at: 1
        }
    };
    try {
        const result = await DbConnection.findAndSelectData(userTokenCollection, query, select);
        return ({ error: false, data: result.data })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

module.exports = {
    addToken,
    getToken,
    addFleetToken,
    getFleetToken
}