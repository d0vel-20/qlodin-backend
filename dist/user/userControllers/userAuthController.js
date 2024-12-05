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
exports.resetPassword = exports.resendResetCode = exports.forgotPassword = exports.loginUser = exports.verifyUserEmail = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emailService_1 = require("../../services/emailService");
const generateOtp_1 = require("../../utils/generateOtp");
const generateToken_1 = require("../../utils/generateToken");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, userName, lastName, email, password } = req.body;
        const existingUser = yield userModel_1.default.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            res.status(400).json({
                status: 400,
                message: existingUser.email === email
                    ? 'User with this email already exists'
                    : 'User with this name already exists',
            });
            return;
        }
        // hash the paswword
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Generate OTP and the OTP expiration date
        const otp = (0, generateOtp_1.generateOTP)();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // expires after 15 minutes
        const user = new userModel_1.default({
            email,
            userName,
            password: hashedPassword,
            firstName,
            lastName,
            otp,
            otpExpires,
            isVerified: false,
            profilePicture: '', // image 
        });
        yield user.save();
        // send otp to email
        try {
            yield (0, emailService_1.sendOTPEmail)(email, otp);
        }
        catch (error) {
            res.status(500).json({ data: 'Failed to send OTP email', error });
            return;
        }
        // Generate initial token
        const token = (0, generateToken_1.generateToken)(user._id.toString(), 'user');
        // Return user data
        res.status(201).json({
            status: 201,
            message: 'Registration successful. Please verify your email using the OTP sent.',
            data: {
                user: {
                    _id: user._id,
                    email: user.email,
                    userName: user.userName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isVerified: user.isVerified,
                },
            }
        });
        return;
    }
    catch (error) {
        res.status(500).json({ data: 'Internal Server Error', status: 500, error });
    }
});
exports.registerUser = registerUser;
const verifyUserEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        // Find the user by email
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ data: 'User not found', status: 404 });
            return;
        }
        // Check if OTP is correct and not expired
        if (user.otp !== otp || user.otpExpires < new Date()) {
            res.status(400).json({ data: 'Invalid or expired OTP', status: 400 });
            return;
        }
        // Mark user as verified
        user.isVerified = true;
        user.otp = ''; // Clear OTP
        yield user.save();
        // Generate a new token for the verified user
        const token = (0, generateToken_1.generateToken)(user._id.toString(), 'user');
        // Return the verified user data and new token
        res.status(200).json({
            status: 200,
            message: 'Email verified successfully',
            data: {
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isVerified: user.isVerified,
                },
            }
        });
        return;
    }
    catch (error) {
        res.status(500).json({ data: 'Email verification failed', error });
    }
});
exports.verifyUserEmail = verifyUserEmail;
// user login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // input validation
    if (!email || !password) {
        res.status(400).json({ data: 'Please fill in all fields', status: 400 });
        return;
    }
    try {
        // Check if admin exists
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ data: 'User does not exist.', status: 400 });
            return;
        }
        // Check if password matches
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(403).json({ data: 'Invalid credentials', status: 403 });
            return;
        }
        // check if user is disabled
        if (user.isDisabled) {
            res.status(403).json({ data: 'Account is disabled. Please contact support.', status: 403 });
            return;
        }
        // Generate a new token for the verified user
        const token = (0, generateToken_1.generateToken)(user._id.toString(), 'user');
        // Return token with the user data
        res.status(200).json({
            status: 200,
            message: 'Login Successful',
            data: {
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isVerified: user.isVerified,
                },
            }
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ data: 'Internal Server Error', status: 500, error });
        return;
    }
});
exports.loginUser = loginUser;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ data: 'User not found', status: 404 });
            return;
        }
        const resetCode = (0, generateOtp_1.generateSixDigitCode)();
        const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Code expires in 15 minutes
        user.resetCode = resetCode;
        user.resetCodeExpires = resetCodeExpires;
        yield user.save();
        yield (0, emailService_1.sendResetPasswordEmail)(email, resetCode);
        res.status(200).json({ data: 'Reset code sent to email.', status: 200 });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ data: 'Internal Server Error', status: 500, error });
        return;
    }
});
exports.forgotPassword = forgotPassword;
const resendResetCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Check if admin exists
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ data: 'User not found', status: 404 });
            return;
        }
        // Generate a new reset code and set expiration
        const resetCode = (0, generateOtp_1.generateSixDigitCode)();
        const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes
        user.resetCode = resetCode;
        user.resetCodeExpires = resetCodeExpires;
        yield user.save();
        // Resend reset code to email
        yield (0, emailService_1.sendResetPasswordEmail)(email, resetCode);
        res.status(200).json({ data: 'Reset code resent to email.', status: 200 });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ data: 'Internal Server Error', status: 500, error });
        return;
    }
});
exports.resendResetCode = resendResetCode;
// Reset Password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, resetCode, newPassword } = req.body;
        // Validate input
        if (!email || !resetCode || !newPassword) {
            res.status(400).json({ data: 'Please fill in all fields', status: 400 });
            return;
        }
        // Find the admin by email and verify reset code
        const user = yield userModel_1.default.findOne({ email, resetCode });
        if (!user) {
            res.status(404).json({ data: 'Invalid reset code or email.', status: 404 });
            return;
        }
        // Check if the reset code has expired
        if (user.resetCodeExpires && user.resetCodeExpires < new Date()) {
            res.status(400).json({ data: 'Reset code has expired.', status: 400 });
            return;
        }
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        // Update the admin's password and clear the reset code and expiration
        user.password = hashedPassword;
        user.resetCode = undefined;
        user.resetCodeExpires = undefined;
        yield user.save();
        res.status(200).json({ data: 'Password reset successful.', status: 200 });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ data: 'Internal Server Error', status: 500, error });
        return;
    }
});
exports.resetPassword = resetPassword;
