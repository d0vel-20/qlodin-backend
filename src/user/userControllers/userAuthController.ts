import express, {Request, Response, NextFunction} from "express";
import User from "../../models/userModel";
import bcrypt from 'bcryptjs'
import { sendOTPEmail, sendResetPasswordEmail } from "../../services/emailService";
import { generateOTP,generateSixDigitCode } from "../../utils/generateOtp";
import { generateToken } from "../../utils/generateToken";



export const registerUser = async (req:Request, res: Response) => {

    try {
            const {firstName, userName, lastName, email, password} = req.body;
            const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
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
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP and the OTP expiration date
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // expires after 15 minutes

        const user = new User({
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

        await user.save();

        // send otp to email
        try {
            await sendOTPEmail(email, otp);
        } catch (error) {
            res.status(500).json({data: 'Failed to send OTP email', error})
            return;
        }

        // Generate initial token
        const token = generateToken(user._id.toString(), 'user');

        // Return user data
         res.status(201).json({
            status: 201,
            message: 'Registration successful. Please verify your email using the OTP sent.',
            data:{
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

        } catch (error) {
          res.status(500).json({ data: 'Internal Server Error', status: 500, error });
        }
};

export const verifyUserEmail = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
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
  
  
      await user.save();
  
      // Generate a new token for the verified user
      const token = generateToken(user._id.toString(), 'user');
  
      // Return the verified user data and new token
      res.status(200).json({
        status: 200,
        message: 'Email verified successfully',
        data:{
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
    } catch (error) {
      res.status(500).json({ data: 'Email verification failed', error });
    }
  };    
  
  // user login
  export const loginUser = async (req:Request, res:Response) =>{
    const {email, password, isDisabled} = req.body;
  
    // input validation
    if (!email || !password){
      res.status(400).json({ data: 'Please fill in all fields', status: 400 })
      return;
    }
  
    try {
      // Check if admin exists
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ data: 'User does not exist.', status: 400 });
        return;
      }
  
      // Check if password matches
      const isPasswordValid = await bcrypt.compare(password, user.password );
      if (!isPasswordValid) {
        res.status(403).json({ data: 'Invalid credentials', status: 403 });
        return;
      }
  
      // check if user is disabled
      if(user.isDisabled){
        res.status(403).json({ data: 'Account is disabled. Please contact support.', status: 403 });
        return;
      }
  
          // Generate a new token for the verified user
          const token = generateToken(user._id.toString(), 'user');
  
      // Return token with the user data
      res.status(200).json({
        status: 200,
        message: 'Login Successful',
        data:{
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
      return
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal Server Error', status: 500, error });
    return;
  }
  };



  export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ data: 'User not found', status: 404 });
        return;
      }
  
      const resetCode = generateSixDigitCode();
      const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Code expires in 15 minutes
  
      user.resetCode = resetCode;
      user.resetCodeExpires = resetCodeExpires;
      await user.save();
  
      await sendResetPasswordEmail(email, resetCode);
  
      res.status(200).json({ data: 'Reset code sent to email.', status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: 'Internal Server Error', status: 500, error });
        return;
    }
  };

  export const resendResetCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
  
      // Check if admin exists
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ data: 'User not found', status: 404 });
        return;
      }
  
      // Generate a new reset code and set expiration
      const resetCode = generateSixDigitCode();
      const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes
  
      user.resetCode = resetCode;
      user.resetCodeExpires = resetCodeExpires;
      await user.save();
  
      // Resend reset code to email
      await sendResetPasswordEmail(email, resetCode);
  
      res.status(200).json({ data: 'Reset code resent to email.', status: 200 });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ data: 'Internal Server Error', status: 500, error });
      return;
    }
  };



  // Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    // Validate input
    if (!email || !resetCode || !newPassword) {
      res.status(400).json({ data: 'Please fill in all fields', status: 400 });
      return;
    }

    // Find the admin by email and verify reset code
    const user = await User.findOne({ email, resetCode });
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
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin's password and clear the reset code and expiration
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({ data: 'Password reset successful.', status: 200 });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: 'Internal Server Error', status: 500, error });
    return;
  }
};







