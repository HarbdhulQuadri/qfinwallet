require('dotenv').config()
const jwt = require('jsonwebtoken');
const {sendOTPEmail,sendResendOTPEmail,sendVerificationSuccessEmail} = require('../../thirdParty/email');
const authService = require("../services/users")
const globalMessage = require("../../utility/globalMessage");
const tokenModel = require("../models/token");
// const authModel = require("../models/users");



const register = async (req, res) => {
    let data = req.body;
    try {
        let shortProfile = await authService.checkUserExist(data);
        console.log("2",shortProfile)

        if (shortProfile.emailProfile.data.length === 0 && shortProfile.phoneProfile.data.length === 0) {
            const registerResult = await authService.register(data);
            console.log("2",registerResult)

            const recipientEmail = data.emailAddress; // Assuming email is part of user data
            if (!registerResult.error) {
                const addOTP = await authService.AddOTP(data);
                if (!addOTP.error) {
                    await sendOTPEmail(recipientEmail, addOTP.otp);
                    res.status(200).json({
                        status_code: 200,
                        status: "success",
                        message: registerResult.message,
                        data: {otp: addOTP.otp}
                    }) // remove the otp later
                }
            } else {
                res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
            }
        } else if (shortProfile.emailProfile.data.length !== 0) {
            res.status(403).json({status_code: 403, status: "error", message: globalMessage.emailTaken})
        } else {
            res.status(403).json({status_code: 403, status: "error", message: globalMessage.phoneTaken})
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
    }
}

const login = async (req, res) => {
    let data = req.body;
    try {
        let shortProfile = await authService.checkUserExist(data);
        if (shortProfile.userProfile.data.length === 0) {
            res.status(403).json({status_code: 403, status: "error", message: globalMessage.userNotFound})
        } else if (!shortProfile.userProfile.data[0].emailVerify) {
            res.status(403).json({status_code: 403, status: "error", message: globalMessage.emailNotVerify})
        } else {
            data.userID = shortProfile.userProfile.data[0].userID
            data.hasspassword = shortProfile.userProfile.data[0].password;
            const login = await authService.Login(data)
            if (!login.error) {
                data.userID = shortProfile.userProfile.data[0].userID
                 data.userType = shortProfile.userProfile.data[0].userType
                data.emailAddress = shortProfile.userProfile.data[0].emailAddress
                // data.fullName = shortProfile.userProfile.data[0].fullName


                console.log(shortProfile.userProfile.data[0])
                let token = await authService.addToken(data);
                if (!token.error) {
                    res.status(200).json({
                        status_code: 200,
                        status: "success",
                        message: globalMessage.loginSuccessful,
                        data: {userType:data.userType, emailAddress:data.emailAddress, accessToken: token.data.accessToken}
                    })
                }
            } else {
                res.status(403).json({status_code: 403, status: "error", message: globalMessage.loginNotSuccessful})
            }
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
    }
}


const verifyOTP = async (req, res) => {
    let data = req.body;
    try {
        let shortProfile = await authService.checkUserExist(data);
        
        if (shortProfile.userProfile.data.length === 0) {
            res.status(403).json({status_code: 403, status: "error", message: globalMessage.userNotFound})
        } else {
            data.userID = shortProfile.userProfile.data[0].userID
            let otpProfile = await authService.verifyOTP(data);
            if (otpProfile.error) {
                res.status(403).json({status_code: 403, status: "error", message: otpProfile.message})
            } else {
                data.userID = shortProfile.userProfile.data[0].userID
                data.userType = shortProfile.userProfile.data[0].userType
                data.emailAddress = shortProfile.userProfile.data[0].emailAddress                
                let token = await authService.addToken(data);
                recipientEmail =  data.emailAddress;
                if (!token.error) {
                    sendVerificationSuccessEmail(recipientEmail)
                    res.status(200).json({
                        status_code: 200,
                        status: "success",
                        message: "email Verified successfully",
                        data: {userType: data.userType, accessToken: token.data.accessToken}
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
    }
}

const resendOTP = async (req, res) => {
    let data = req.body;
        try {
        let shortProfile = await authService.checkUserExist(data);
        if (shortProfile.userProfile.data.length === 0) {
            res.status(403).json({status_code: 403, status: "error", message: globalMessage.userNotFound})
        } else {
            data.userID = shortProfile.userProfile.data[0].userID
            data.emailAddress = shortProfile.userProfile.data[0].emailAddress
            data.fullName = shortProfile.userProfile.data[0].fullName
            const addOTP = await authService.AddOTP(data);
            const recipientEmail = data.emailAddress;
            if (!addOTP.error) {
                await sendResendOTPEmail(recipientEmail, addOTP.otp);
                res.status(200).json({
                    status_code: 200,
                    status: "success",
                    message: globalMessage.resetOTP,
                    // data: {otp: addOTP.otp}
                }) // remove the otp later
            }
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "server error ", message: "Internal Server Error"})
    }
}



const resetPassword = async (req, res) => {
    let data = req.body;
    try {
        let shortProfile = await authService.checkUserExist(data);
        if (shortProfile.userProfile.data.length === 0) {
            res.status(403).json({status_code: 403, status: "error", message: globalMessage.profileNotFound})
        } else {
            data.userID = shortProfile.userProfile.data[0].userID
            data.emailAddress = shortProfile.userProfile.data[0].emailAddress
            data.fullName = shortProfile.userProfile.data[0].fullName
            const addOTP = await authService.AddOTP(data);
            const recipientEmail = data.emailAddress;
            if (!addOTP.error) {
                await sendOTPEmail(recipientEmail, addOTP.otp);
                res.status(200).json({
                    status_code: 200,
                    status: "success",
                    message: globalMessage.sendOTP,
                    data: {otp: addOTP.otp}
                }) // remove the otp later
            }
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
    }
}
const forgotPassword = async (req, res) => {
    let data = req.body;
    try {
        const result = await authService.forgotPassword(data);
        let code = result.code;
        delete result.code;
        res.status(code).json(result)
    } catch (error) {
        let code = error.code;
        delete error.code;
        res.status(code).json(error)
    }
}

const addNewPassword = async (req, res) => {
    let data = req.body;
    data.userID = req.query.userID;
    try {
        let changePassword = await authService.addNewPassword(data);
        if (!changePassword.error) {
            res.status(200).json({status_code: 200, status: "success ", message: globalMessage.changePassword})
        } else {
            res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
    }
}

const addAccountDetails = async (req, res) => {
    let data = req.body;
    data.userID = req.query.userID;
    try {
        const { accountName, accountNumber, bankCode } = data;

        // Call the createRecipient function with the necessary details
        const recipientResponse = await paystack.createRecipient(accountName, accountNumber, bankCode);
        console.log('Recipient code: recipientResponse', recipientResponse);

        // Check if the recipient creation was successful
        if (!recipientResponse.error) {
            // Extract the recipient code from the response
            data.recipient_code = recipientResponse.data.recipient_code;
            console.log('Recipient code:', data.recipient_code);
            // Add the recipient code to the data object
            // Proceed with adding the account details, including the recipient code
            let result = await authService.addAccountDetails(data);
            if (!result.error) {
                res.status(200).json({ status_code: 200, status: "success", message: "Account Successfully added" });
            } else {
                res.status(500).json({ status_code: 500, status: "error", message: "Internal Server Error" });
            }
        } else {
            // Log the error and send a response indicating the failure
            console.error('Error creating recipient:', recipientResponse.message);
            res.status(500).json({ status_code: 500, status: "error", message: "Failed to create recipient on Paystack" });
        }
    } catch (error) {
        // Catch any unexpected errors and send a response indicating an internal server error
        console.error('Error in addAccountDetails:', error);
        res.status(500).json({ status_code: 500, status: "error", message: "Internal Server Error" });
    }
};



const getBankList = async (req, res) => {
    let data = req.query;
    try {
        let bankList = await authService.getBankList();
        if (!bankList.error) {
            res.status(200).json({status_code: 200, status: "success", data: bankList.data})
        } else {
            res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "server error ", message: "Internal Server Error"})
    }
}
const resolveAccount = async (req, res) => {
    let data = req.query;
    try {
        let resolveAccount = await authService.resolveAccount(data);
        if (!resolveAccount.error) {
            res.status(200).json({status_code: 200, status: "success", data: resolveAccount.data})
        } else {
            res.status(500).json({status_code: 500, status: "error ", message: "Invalid Account"})
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "server error ", message: "Internal Server Error"})
    }
}


const socialProfile = async (req, res) => {
    let data = req.body;
    try {
        let shortProfile = await authService.checkUserExist(data);
        if (shortProfile.emailProfile.data.length === 0) {
            const socialProfile = await authService.socialProfile(data);
            if (!socialProfile.error) {
                data.userID = socialProfile.userID
                data.userType = "renter"
                let token = await authService.addToken(data);
                if (!token.error) {
                    res.status(200).json({
                        status_code: 200,
                        status: "success",
                        message: globalMessage.registerSuccessful,
                        data: {userType: data.userType, accessToken: token.data.accessToken}
                    })
                }
            } else {
                res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
            }
        } else {
            data.userID = shortProfile.emailProfile.data[0].userID
            data.userType = shortProfile.emailProfile.data[0].userType
            let token = await authService.addToken(data);
            if (!token.error) {
                res.status(200).json({
                    status_code: 200,
                    status: "success",
                    message: globalMessage.loginSuccessful,
                    data: {userType: data.userType, accessToken: token.data.accessToken}
                })
            }
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
    }
}
const biometricProfile = async (req, res) => {
    let data = req.body;
    try {
        let shortProfile = await authService.checkUserExist(data);
        if (shortProfile.userProfile.data.length === 0) {
            res.status(500).json({status_code: 500, status: "error ", message: globalMessage.userNotFound})
        } else if (shortProfile.userProfile.data[0].biometricID !== data.biometricID) {
            res.status(500).json({status_code: 500, status: "error ", message: globalMessage.userNotFound})
        } else  {
            data.userID = shortProfile.userProfile.data[0].userID
            data.userType = shortProfile.userProfile.data[0].userType
            let token = await authService.addToken(data);
            if (!token.error) {
                res.status(200).json({
                    status_code: 200,
                    status: "success",
                    message: globalMessage.loginSuccessful,
                    data: {userType: data.userType, accessToken: token.data.accessToken}
                })
            }
        }
    } catch (error) {
        res.status(500).json({status_code: 500, status: "error ", message: "Internal Server Error"})
    }
}

const refreshToken = async (req, res) => {
    try {
        let data = {};
        data.accessToken = req.headers.authorization.split(' ')[1]
        let decode = jwt.decode(data.accessToken)
        data.userID = decode.userID;
        let token = await tokenModel.getToken(data)
        if (data.accessToken !== token.data[0].accessToken) {
            return res.status(400).json({
                status_code: 400,
                status: globalMessage.errorStatus,
                message: globalMessage.tokenInvalid
            })
        } else {
            data.user = data.userID
            let shortProfile = await authModel.getShortProfile(data);
            data.userID = shortProfile.data[0].userID
            data.userType = shortProfile.data[0].userType
            let token = await authService.addToken(data);
            if (!token.error) {
                res.status(200).json({
                    status_code: 200,
                    status: "success",
                    message: "tokenRefreshSuccessful",
                    data: {userType: data.userType, accessToken: token.data.accessToken}
                })
            }
        }
    } catch (error) {
        return res.status(400).json({
            status_code: 400,
            status: "errorStatus",
            message: "tokenInvalid"
        })
    }
}

const getUserProfile = async (req, res) => {
    let data = req.query;
    data.userID = req.query.userID;
    try {
        const profile = await authService.getUserProfile(data);

        if (!profile.error) {
            if (profile.data) {
                res.status(200).json({ status_code: 200, status: "success", data: profile.data });
            } else {
                res.status(404).json({ status_code: 404, status: "not found", message: "User profile not found" });
            }
        } else {
            res.status(500).json({ status_code: 500, status: "error", message: "Internal Server Error" });
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, status: "server error", message: "Internal Server Error" });
    }
};

module.exports = {
    register,
    verifyOTP,
    resendOTP,
    login,
    resetPassword,
    addNewPassword,
    socialProfile,
    refreshToken,
    addAccountDetails,
    biometricProfile,
    getBankList,
    resolveAccount,
    forgotPassword,
    getUserProfile
}
