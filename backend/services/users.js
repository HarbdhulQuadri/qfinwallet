require('dotenv').config()
const authModel = require("../models/users")
const globalFunction = require("../../utility/globalFunction");
const jwt = require('jsonwebtoken');
const moment = require("moment-timezone");
const cryptoRandomString = require('crypto-random-string');
const globalMessage = require("../../utility/globalMessage")
const bcrypt = require("bcrypt")
const otpModel = require("../models/otp");
const tokenModel = require("../models/token");
const randomstring = require('randomstring')
const sendMail = require('../../thirdParty/email');



const register = async (data) => {
    try {
        data.password = await globalFunction.hashPassword(data.password)
        data.userID = await cryptoRandomString({ length: 6, type: 'alphanumeric' });
        await authModel.register(data);
        return ({
            error: false,
            message: globalMessage.registerSuccessful,
        })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}


const Login = async (data) => {
    try {
        const answer = await bcrypt.compare(data.password, data.hasspassword);
        // const answer = await bcrypt.compare(data.password, result.data[0].password);
        if (!answer) {
            return ({ error: true, message: "wrong password" })
        } else {

            return ({
                error: false,
                message: globalMessage.loginSuccessful,
            })
        }
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}
const forgotPassword = async (data) => {
    try {
        const result = await authModel.getShortProfile(data);
        if (result.data.length === 0) {
            return {
                error: false,
                message: globalMessage.profileNotFound,
                code: 404
            };
        } else {
            data.newPassword = randomstring.generate(8);
            data.userID = result.data[0].userID;
            data.fullName = result.data[0].fullName;
            data.recipientEmail = result.data[0].emailAddress;
            data.password = await globalFunction.hashPassword(data.newPassword);
            await profileModel.changePassword(data);
            await sendMail.forgotPassword(data.recipientEmail, data.newPassword); // Pass the new password
            return {
                error: false,
                message: globalMessage.resetPassword,
                code: 200
                
            };
        }
    } catch (error) {
        return {
            error: true,
            message: error.message,
            code: 403
        };
    }
};


const addToken = async (data) => {
    let date = moment.tz(Date.now(), "Africa/Lagos");
    try {
        // Calculate the expiration time for 8 hours from now
        const eightHoursFromNow = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // 8 hours in seconds

        data.accessToken = jwt.sign({
            userID : data.userID,
            userType : data.userType,
            iat: Math.floor(Date.now() / 1000),
            exp: eightHoursFromNow, // Set the token to expire in 8 hours
        }, process.env.JWTSECRET,);

        // Format the date for display or logging purposes
        data.expire_at = date.add(8, "hours").format(); // Show the expiration time in 8 hours
        await tokenModel.addToken(data);
        return ({ error: false, data: data });
    } catch (error) {
        return ({ error: true, message: error.message });
    }
};

const AddOTP = async (data) => {
    try {
        let date = moment.tz(Date.now(), "Africa/Lagos");
        data.otp = await cryptoRandomString({ length: 4, type: 'numeric' });
        data.expire_at = date.add(10, "minute").format();
        await otpModel.addOTP(data);
        console.log("...otp...", data.otp)
        //send otp to email 
        return ({
            error: false,
            message: globalMessage.registerSuccessful,
            otp: data.otp
        })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const verifyOTP = async (data) => {
    try {
        let otp = await otpModel.getOTP(data);
        if (otp.data.length === 0) {
            return ({ error: true, message: globalMessage.otpNotFound })
        } else if (Number(otp.data[0].otp) !== Number(data.otp)) {
            return ({ error: true, message: globalMessage.otpWrong })
        } else if (moment.tz(otp.data[0].expire_at, "Africa/Lagos") < moment.tz(Date.now(), "Africa/Lagos")) {
            return ({ error: true, message: globalMessage.otpExpire })
        } else {
            await otpModel.updateEmailVerify(data);
            return ({ error: false, message: "sucessful" })
        }
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const checkUserExist = async (data) => {
    try {
        let shortUserProfile = [], shortProfileEmail, shortProfilePhone;
        if (data.user !== undefined) {
            shortUserProfile = await authModel.getShortProfile(data);
        }
        data.user = data.emailAddress;
        shortProfileEmail = await authModel.getShortProfile(data);
        data.user = data.phoneNumber;
        shortProfilePhone = await authModel.getShortProfile(data);
        delete data.user;
        return ({ error: false, userProfile: shortUserProfile, emailProfile: shortProfileEmail, phoneProfile: shortProfilePhone })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const addNewPassword = async (data) => {
    try {
        data.password = await globalFunction.hashPassword(data.password)
        await authModel.addNewPassword(data);
        return ({
            error: false,
            message: globalMessage.successStatus,
        })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const addBiometric = async (data) => {
    try {
        await authModel.addBiometric(data);
        return ({
            error: false,
            message: globalMessage.successStatus,
        })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const addAccountDetails = async (data) => {
    try {
        await authModel.recipientCode(data);
        return ({
            error: false,
            message: globalMessage.successStatus,
        })
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const getBankList = async () => {
    try {
        const bankList = await paystack.getBankList();
        return (bankList)
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const resolveAccount = async (data) => {
    try {
        const accountDetails = await paystack.resolveAccount(data);
        return (accountDetails)
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const getUserProfile = async (data) => {
    try {
        const profile = await authModel.getUserProfile(data);
        return profile;
    } catch (error) {
        return ({ error: true, message: error.message });
    }
};

const refreshToken = async (data) => {
    try {
        let decode = jwt.decode(data.accessToken)
        let data = {}; data.userID = decode.userID;
        let token = await tokenModel.getToken(data)
        if (accessToken !== token.data[0].accessToken) {
            return res.status(400).json({ status_code: 400, status: globalMessage.errorStatus, message: globalMessage.tokenExpire })
        } else {

        }
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}


module.exports = {
    checkUserExist,
    Login,
    register,
    addToken,
    AddOTP,
    verifyOTP,
    addNewPassword,
    refreshToken,
    addBiometric,
    addAccountDetails,
    getBankList,
    resolveAccount,
    forgotPassword,
    getUserProfile
}
