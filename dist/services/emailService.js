"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendOTPEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure and create Nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.useplunk.com',
    port: 465,
    secure: true,
    auth: {
        user: 'plunk',
        pass: process.env.PLUNK_API_KEY, // API key from environment variables
    },
    tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
    },
});
const sendEmail = (email, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: 'send@qlodin.com',
            to: email,
            subject,
            html,
        });
        console.log(`Email sent successfully to ${email}:`, info.messageId);
        return true;
    }
    catch (error) {
        console.error('Error sending email:', error instanceof Error ? error.message : error);
        return false;
    }
});
exports.sendEmail = sendEmail;
const sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const html = `
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
  `;
    return yield (0, exports.sendEmail)(email, 'Your OTP Code', html);
});
exports.sendOTPEmail = sendOTPEmail;
const sendResetPasswordEmail = (email, resetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4CAF50;">Reset Your Password</h2>
      <p>Hi,</p>
      <p>You requested a password reset. Your reset code is:</p>
      <p style="font-size: 20px; font-weight: bold; color: #000;">${resetCode}</p>
      <p>This Reset Code is valid for 15 minutes.</p>
      <p>Click the link below to reset your password:</p>
      <a href="https://yourwebsite.com/reset-password?code=${resetCode}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>Qlodin</p>
    </div>
  `;
    return yield (0, exports.sendEmail)(email, 'Password Reset Request', html);
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
