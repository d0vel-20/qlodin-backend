"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// mail request
const sendOTPEmail = (email, otp) => {
    return new Promise((resolve, reject) => {
        // email configuration 
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Your Gmail address
                pass: process.env.GMAIL_PASS, // App password from Google
            }
        });
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It expires in 15 minutes.`,
            html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Welcome to Qlodin!</h2>
            <p>Hi,</p>
            <p>Thank you for registering on our platform. To complete your registration, please use the following OTP to verify your email address:</p>
            <p style="font-size: 20px; font-weight: bold; color: #000;">${otp}</p>
            <p>This OTP is valid for 15 minutes.</p>
            <p>Click the link below to enter your OTP and verify your email:</p>
            <a href="https://yourwebsite.com/verify-email?otp=${otp}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>Qlodin</p>
          </div>
        `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            }
            else {
                console.log('Email sent:', info.response);
                resolve(true);
            }
        });
    });
};
exports.sendOTPEmail = sendOTPEmail;
const sendResetPasswordEmail = (email, resetCode) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer_1.default.createTransport({
            // host: HOST,
            // port: PORT,
            service: 'gmail',
            auth: {
                // user: USER,
                // pass: PASS,
                user: process.env.GMAIL_USER, // Your Gmail address
                pass: process.env.GMAIL_PASS, // App password from Google
            },
        });
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Your reset code is ${resetCode}. This code expires in 15 minutes.`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to Our SkirmApp!</h2>
          <p>Hi,</p>
          <p>You have requested for this code to change your password:</p>
          <p style="font-size: 20px; font-weight: bold; color: #000;">${resetCode}</p>
          <p>This Reset Code is valid for 15 minutes.</p>
          <p>Click the link below to enter your Reset Code and change your password:</p>
          <a href="https://yourwebsite.com/verify-email?otp=${resetCode}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Qlodin</p>
        </div>
      `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            }
            else {
                console.log('Email sent:', info.response);
                resolve(true);
            }
        });
    });
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
