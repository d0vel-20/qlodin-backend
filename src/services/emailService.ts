import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// mail request
export const sendOTPEmail = (email: string, otp: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
      // email configuration 
      const transporter = nodemailer.createTransport({
          // host: HOST,
          // port: PORT,
          service: 'gmail',
          auth: {
            // user: USER,
            // pass: PASS

            user: process.env.GMAIL_USER,  // Your Gmail address
            pass: process.env.GMAIL_PASS,  // App password from Google
          },
          tls: {
            rejectUnauthorized: false, // Allow self-signed certificates
          },
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

      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.error('Error sending email:', error);
          reject(error);
      } else {
          console.log('Email sent:', info.response);
          resolve(true);
      }
      });
  });

}

export const sendResetPasswordEmail = (email: string, resetCode: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        // host: HOST,
        // port: PORT,
        service: 'gmail',
        auth: {
          // user: USER,
          // pass: PASS,
          user: process.env.GMAIL_USER,  // Your Gmail address
          pass: process.env.GMAIL_PASS,  // App password from Google
        },
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates
        },
      });
  
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Your reset code is ${resetCode}. This code expires in 15 minutes.`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Welcome to Qlodin!</h2>
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
        } else {
          console.log('Email sent:', info.response);
          resolve(true);
        }
      });
    });
  };
