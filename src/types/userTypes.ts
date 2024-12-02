import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: string;
    isVerified?: boolean;
    createdAt: Date;
    otp: string;
    otpExpires: Date;
    resetCode?: string;
    resetCodeExpires?: Date;
    role: string;
  }