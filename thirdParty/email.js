require("dotenv").config();
const { database } = require("firebase-admin");
const nodemailer = require('nodemailer');

// Function to send OTP email
const sendOTPEmail = async (recipientEmail, otp) => {
    try {
        // Create a transporter using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail email address
                pass: process.env.EMAIL_PASS   // Your Gmail password or App Password
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,     // Sender email address
            to: recipientEmail,               // Receiver email address
            subject: 'Your One-Time Password', // Email subject
            text: `Your OTP is: ${otp}`       // Email body with OTP
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return { success: false, message: 'Failed to send OTP email' };
    }
};
// Function to send resend OTP email
const sendResendOTPEmail = async (recipientEmail, otp) => {
    try {
        // Create a transporter using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail email address
                pass: process.env.EMAIL_PASS   // Your Gmail password or App Password
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,     // Sender email address
            to: recipientEmail,               // Receiver email address
            subject: 'Resend OTP',            // Email subject for resend OTP
            text: `Your new OTP is: ${otp}`  // Email body with new OTP
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Resend OTP email sent:', info.response);
        return { success: true, message: 'Resend OTP sent successfully' };
    } catch (error) {
        console.error('Error sending resend OTP email:', error);
        return { success: false, message: 'Failed to send resend OTP email' };
    }
};
// Function to send verification success email
const sendVerificationSuccessEmail = async (recipientEmail) => {
    try {
        // Create a transporter using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail email address
                pass: process.env.EMAIL_PASS  // Your Gmail password or App Password
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,             // Sender email address
            to: recipientEmail,                       // Receiver email address
            subject: 'Email Verification Successful', // Email subject for verification success
            text: 'Your email has been successfully verified!' // Email body for verification success
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification success email sent:', info.response);
        return { success: true, message: 'Verification success email sent successfully' };
    } catch (error) {
        console.error('Error sending verification success email:', error);
        return { success: false, message: 'Failed to send verification success email' };
    }
};

// const forgotPassword = async (recipientEmail) => {
//     try {
//         // Create a transporter using SMTP transport
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL_USER, // Your Gmail email address
//                 pass: process.env.EMAIL_PASS  // Your Gmail password or App Password
//             }
//         });

//         // Email options
//         const mailOptions = {
//             from: process.env.EMAIL_USER,             // Sender email address
//             to: recipientEmail,                       // Receiver email address
//             subject: 'Password Reset', // Email subject for verification success
//             text: 'Please use the code below as your new password and change the password in your profile.', // Updated email body
//             code: data.newPassword
//         };

//         // Send email
//         const info = await transporter.sendMail(mailOptions);
//         return { success: true, message: 'Verification success email sent successfully' };
//     } catch (error) {
//         console.error('Error sending email  email:', error);
//         return { success: false, message: 'Failed to send   email' };
//     }
// };
const forgotPassword = async (recipientEmail, newPassword) => {
    try {
        // Create a transporter using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail email address
                pass: process.env.EMAIL_PASS  // Your Gmail password or App Password
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,             // Sender email address
            to: recipientEmail,                       // Receiver email address
            subject: 'Password Reset', // Email subject for verification success
            text: `Please use the code below as your new password and change the password in your profile:\n\n${newPassword}`, // Updated email body
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: 'Verification success email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email' };
    }
};



module.exports = {
    sendResendOTPEmail,
    sendOTPEmail,
    sendVerificationSuccessEmail,
    forgotPassword

};
