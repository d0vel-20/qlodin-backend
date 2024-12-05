import { reset } from "nodemon";
import { IUser } from "../types/userTypes";
import mongoose, { Document, Schema, Types } from 'mongoose';
import { UserRole } from "../types/roles";

const UserSchema: Schema = new Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true,
        },
        userName:{
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        profilePicture:{
            type: String,
        },
        isPremium:{
            type: Boolean,
            default: false
        },
        isVerified:{
            type: Boolean,
            default: false
        },
        isDisabled: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: ''
        },
        otpExpires: {
            type: Date,
            default: ''
        },
        resetCode: {
            type: String
        },
        resetCodeExpires: {
            type: Date
        },
    },
    {
        timestamps: {
            createdAt: true
        }
    }

);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;