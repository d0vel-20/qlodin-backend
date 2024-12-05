import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure and create Nodemailer transporter
const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.useplunk.com',
  port: 465,
  secure: true, 
  auth: {
    user: 'plunk', 
    pass: process.env.PLUNK_API_KEY as string, // API key from environment variables
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

export const sendEmail = async (email: string, subject: string, html: string): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: 'send@qlodin.com', 
      to: email,
      subject,
      html,
    });
    console.log(`Email sent successfully to ${email}:`, info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error instanceof Error ? error.message : error);
    return false;
  }
};

export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
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
  return await sendEmail(email, 'Your OTP Code', html);
};

export const sendResetPasswordEmail = async (email: string, resetCode: string): Promise<boolean> => {
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
  return await sendEmail(email, 'Password Reset Request', html);
};


