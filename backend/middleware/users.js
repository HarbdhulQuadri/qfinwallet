const globalMessage = require("../../utility/globalMessage")

const { check, body, query, oneOf, header, validationResult } = require('express-validator');

function validation(req, res, next) {
    let errorValidation = validationResult(req);
    if (errorValidation.errors.length > 0) {
        return res.status(500).json({ status_code: 400, status: globalMessage.errorStatus, message: errorValidation.errors[0].msg })
    }
    next()
}

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
    body('userType').exists().withMessage('Type is require').isIn(['driver', 'user',"admin"]).withMessage('Type can be either Driver or User or Admin').trim(),
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

const VerifyOTP = [
    body('user').exists().withMessage('Email Adddress or Phone number is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    },
    body('otp').exists().withMessage('OTP is required').trim(),
    (req, res, next) => {
        validation(req, res, next);
    }
]

const resentOTP = [
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
    VerifyOTP,
    login,
    socialProfile,
    resetPassword,
    resentOTP,
    addNewPassword,
    addBiometric,
    biometricProfile
}
