const globalMessage = require("../../utility/globalMessage")
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token");

const { check, body, query, oneOf, header, validationResult } = require('express-validator');

function validation(req, res, next) {
    let errorValidation = validationResult(req);
    if (errorValidation.errors.length > 0) {
        return res.status(500).json({ status_code: 400, status: globalMessage.errorStatus, message: errorValidation.errors[0].msg })
    }
    next()
}
const getToken = [
    header("Authorization")
      .exists()
      .withMessage("Authorization is required")
      .trim(),
    (req, res, next) => {
      validation(req, res, next);
    },
    async (req, res, next) => {
      if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        let token = req.headers.authorization.split(" ")[1]; // Use lowercase 'token'
        try {
          const decoded = jwt.verify(token, process.env.JWTSECRET);
          let data = { userID: decoded.userID };
          console.log("ID:", data.userID);
  
          const result = await tokenModel.getToken(data);
          if (result.data.length === 0) {
            return res.status(401).json({ error: true, message: "Session Expired Kindly Login Again..... " });
          }
  
          // Check for token expiration and mismatch
          if (result.data[0].expire_at < new Date() || token !== result.data[0].accessToken) {
            return res.status(401).json({ error: true, message: globalMessage.AuthorizationExpire });
          }
  
          // Successful token validation
          req.query.userID = decoded.userID;
          next();
        } catch (error) {
          // Handle potential JWT errors (including expired tokens)
          if (error instanceof jwt.TokenExpiredError) {
            // Inform user about expired token and prompt re-authentication
            return res.status(401).json({ error: true, message: "Your session has expired. Please log in again." });
          }
          return res.status(403).json({ error: true, message: error.message });
        }
      } else {
        return res.status(403).json({ error: true, message: globalMessage.AuthorizationNotSupported });
      }
    },
  ];
const register = [
    body('fullName').exists().withMessage('Full name is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
    body('emailAddress').exists().withMessage('Email Address is required').isEmail().withMessage('Enter a valid email address').trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
    body('phoneNumber').exists().withMessage('Phone Number is required').trim().custom((value) => {
        if (value.length !== 11) {
            return Promise.reject("Phone number should be 11 digits");
        } else {
            return true;
        }
    }),
    (req, res, next) => {
        validation(req, res, next);
    },

    body('password').exists().withMessage('Password is required')
        .matches(/[a-z]/g).withMessage('Please enter a password with a small letter')
        .matches(/[A-Z]/g).withMessage('Please enter a password with a Capital letter')
        .matches(/[0-9]/g).withMessage('Please enter a password with a Number')
        .isLength({ min: 8 }).withMessage('Please enter a password with at least 8 letter')
        .trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
    // body('referralCode').optional().exists().isLength({ min: 6, max: 6 }).withMessage('referral Code must be six in length').trim(),
    // (req, res, next) => {
    //     validation(req, res, next);
    // },
]

const verifyOTP = [
    body('user').exists().withMessage('Email Adddress or Phone number is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
    body('otp').exists().withMessage('OTP is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    }
]

const resendOTP = [
    body('user').exists().withMessage('Email Adddress or Phone number is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    }
]

const login = [
    body('user').exists().withMessage('Email Adddress or Phone number is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
    body('password').exists().withMessage('Password is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
]

const socialProfile = [
    body('fullName').exists().withMessage('Full name is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
    body('emailAddress').exists().withMessage('emailAddress is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
    body('socialType').exists().withMessage('Social Media type is required').isIn(['google', 'apple']).withMessage('Kindly enter a valid social media type').trim(),
    (req, res, next) => {
        validation(req, res, next);
    }, body('socialID').exists().withMessage('socialID is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
    body('referralCode').optional().exists().isLength({ min: 6, max: 6 }).withMessage('referral Code must be six in length').trim(),
    (req, res, next) => {
        validation(req, res, next);
    }
]

const resetPassword = [
    body('user').exists().withMessage('Email Address or Phone number is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    }
]

const addNewPassword = [
    body('password').exists().withMessage('Password is required')
        .matches(/[a-z]/g).withMessage('Please enter a password with a small letter')
        .matches(/[A-Z]/g).withMessage('Please enter a password with a Capital letter')
        .matches(/[0-9]/g).withMessage('Please enter a password with a Number')
        .isLength({ min: 8 }).withMessage('Please enter a password with at least 8 letter')
        .trim(),
    (req, res, next) => {
        validation(req, res, next);
    }
]

const addBiometric = [
    body('biometricID').exists().withMessage('Device ID is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    }
]

const biometricProfile = [
    body('user').exists().withMessage('Email Address or Phone number is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    }, body('biometricID').exists().withMessage('Device ID is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    }
]

module.exports = {
    register,
    verifyOTP,
    login,
    socialProfile,
    resetPassword,
    resendOTP,
    addNewPassword,
    addBiometric,
    biometricProfile,
    getToken
}

