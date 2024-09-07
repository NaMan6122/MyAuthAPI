import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userModel  = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,

    },
    fullName: {
        type: String,
        required: true,
    },
    passwordValidity:{
        type: Date,
        default: Date.now(),
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verificationToken: String,
    verificationTokenExpiry: Date,

}, {timestamps: true});

User.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    this.passwordValidity = Date.now();
});

User.methods.isPasswordCorrect = async function(password){
    return await bcryptjs.compare(password, this.password); //this.password is the hashed password stored in database, accssed by mongoose.
};

User.methods.generateAccessToken = async function(){ //short lived token, used to access protected resources.
    const token = jwt.sign({
        user_id: this.user_id,
        email: this.email,
        fullName: this.fullName,
        username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    return token;
};

User.methods.generateRefreshToken = async function(){ //long lived token, used to generate new access token, without the need of repeated authentication.
    const token = jwt.sign({
        username: this.username,
        password: this.password,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
    return token;
};



export const User = mongoose.model("User", userModel);