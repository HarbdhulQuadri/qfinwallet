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

// Function to send transfer notification to sender
const sendTransferNotification = async (recipientEmail, amount, receiverEmail) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: 'Money Transfer Confirmation',
            html: `
                <h2>Transfer Confirmation</h2>
                <p>You have successfully sent $${amount.toFixed(2)} to ${receiverEmail}.</p>
                <p>If you did not make this transfer, please contact our support immediately.</p>
                <p>Thank you for using our service!</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: 'Transfer notification sent successfully' };
    } catch (error) {
        console.error('Error sending transfer notification:', error);
        return { success: false, message: 'Failed to send transfer notification' };
    }
};

// Function to notify receiver about incoming transfer
const sendReceiveNotification = async (recipientEmail, amount, senderEmail) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: 'Money Received',
            html: `
                <h2>Money Received</h2>
                <p>You have received $${amount.toFixed(2)} from ${senderEmail}.</p>
                <p>The amount has been credited to your wallet.</p>
                <p>Thank you for using our service!</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: 'Receive notification sent successfully' };
    } catch (error) {
        console.error('Error sending receive notification:', error);
        return { success: false, message: 'Failed to send receive notification' };
    }
};

// Function to send deposit confirmation
const sendDepositConfirmation = async (recipientEmail, amount, transactionId) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: 'Deposit Confirmation',
            html: `
                <h2>Deposit Successful</h2>
                <p>Your deposit of $${amount.toFixed(2)} has been successfully processed.</p>
                <p>Transaction ID: ${transactionId}</p>
                <p>The amount has been credited to your wallet.</p>
                <p>Thank you for using our service!</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: 'Deposit confirmation sent successfully' };
    } catch (error) {
        console.error('Error sending deposit confirmation:', error);
        return { success: false, message: 'Failed to send deposit confirmation' };
    }
};

// Function to send login notification
const sendLoginNotification = async (recipientEmail, loginTime, deviceInfo) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: 'New Login Detected',
            html: `
                <h2>New Login Alert</h2>
                <p>A new login was detected on your account.</p>
                <p>Time: ${loginTime}</p>
                <p>Device: ${deviceInfo}</p>
                <p>If this wasn't you, please secure your account immediately.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: 'Login notification sent successfully' };
    } catch (error) {
        console.error('Error sending login notification:', error);
        return { success: false, message: 'Failed to send login notification' };
    }
};

module.exports = {
    sendResendOTPEmail,
    sendOTPEmail,
    sendVerificationSuccessEmail,
    forgotPassword,
    sendTransferNotification,
    sendReceiveNotification,
    sendDepositConfirmation,
    sendLoginNotification
};
