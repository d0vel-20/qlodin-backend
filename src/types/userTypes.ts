import { Document, Types } from 'mongoose';
import { UserRole } from './roles';

export interface IUser extends Document {
    _id: Types.ObjectId;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: string;
    isPremium?: boolean;
    isDisabled?: boolean;
    isVerified?: boolean;
    createdAt: Date;
    otp: string;
    otpExpires: Date;
    resetCode?: string;
    resetCodeExpires?: Date;
  }


  export interface AuthenticatedRequest extends Request {
    user?: {
      id: string;
      role: string;
    };
  }

