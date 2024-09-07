import mongoose from "mongoose";
import User from "../models/user.model.js";
import asyncHandler from "../helpers/AsyncHandler.js";
import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";

const generateTokens = async function(userId){
    try {
        const user = await User.findOne(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        //console.log(`accessToken: ${accessToken}`);
        //console.log(`refreshToken: ${refreshToken}`);
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return ({accessToken, refreshToken});
    } catch (error) {
        throw new ApiError(500, "Error Generating Tokens Inside Controller!!");
    }
};

const registerHandler = asyncHandler(async function(req, res){
    const {username, fullName, email, password} = req.body;
    if(!username || !fullName || !email || !password){
        throw new ApiError(400, "All Field are Required for User Registration!");
    }
    const existingUser = await User.findOne({
        $or: [{username}, {email}],
    });

    if(existingUser ){
        throw new ApiError(400, "User Already Exists!,  Please Login!");
    }
    password = password.trim().toLowerCase();
    const newUser = await User.create({
        username : username.trim().toLowerCase(),
        fullName,
        email,
        password,
    });

    const createdUser = await newUser.findById(newUser._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(500, "Error WHile Creating User Entry in MongoDB!!");
    }

    res.status(200).json(new ApiResponse(200, {user: createdUser}, "User Created Successfully!"));
});

const loginHandler = asyncHandler(async function(req, res){
    const {username, email, password} = req.body;
    if(!username && !email){
        throw new ApiError(400, "Username or Email is Required for Login!");
    }
    if(!password){ //optional as constraints can be put at the frontend to not enter submit without the password field
        throw new ApiError(400, "Password is Required for Login!");
    }

    const user = await user.findOne({
        $or: [
            username && { username }, 
            email && { email }
        ].filter(Boolean), //optional checking, filter(Boolean) removes the falsy values from the array, ie null and undefined, which works if the username or email is not provided.
    });
    if(!user){
        throw new ApiError(400, "User not Found, Please Register First!");
    }

    const passwordResponse = await user.isPasswordCorrect(password);
    if(!passwordResponse){
        throw new ApiError(400, "Invalid Password, Please Enter Correct Password!");
    }

    const {accessToken, refreshToken} = await generateTokens({userId: user._id});
    if(!accessToken || !refreshToken){
        throw new ApiError(500, "Error Generating Tokens!!");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const cookieOptions = {
        httpOnly: true,
        secure: false,
    }

    res.status(200)
    .cookie("accessTokenAsCookie", accessToken, cookieOptions)
    .cookie("refreshTokenAsCookie", refreshToken, cookieOptions)
    .json(new ApiResponse(200, 
        {
            user : loggedInUser,
            accessToken,
            refreshToken,
        },
        "User Logged In Successfully!"));
});

const logoutHandler = asyncHandler(async function(req, res){
    await User.findByIdAndUpdate(req.user._id,
        {
        // $set:{ //not a good practice to set the refreshToken to empty string, as it will be stored in the database, and can be accessed by anyone with access to the database.
        //     refreshToken: "",
        // }
            $unset:{
                refreshToken: 1,
            }
        },
        {
            new: true,
        }
    );

    const cookieOptions = {
        httpOnly: true,
        secure: false,
    }
    return res
    .status(200).json(new ApiResponse(200, {}, "User Logged Out Successfully!"))
    .clearCookie("accessTokenAsCookie", cookieOptions)
    .clearCookie("refreshTokenAsCookie", cookieOptions);
    
});

const forgotPasswordHandler = asyncHandler(async function(req, res){
    const {email} = req.body;
    if(!email){
        throw new ApiError(400, "Email is Required to Reset Password!");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400, "No User Found with this Email!");
    }
    if(user.forgotPasswordTokenExpires < Date.now()) {
        throw new ApiError(400, "Token has expired!");
    }
    const token = req.query.token;
    console.log(token);
    const tokeninDB = user.forgotPasswordToken;
    console.log(tokeninDB);
    if(token !== tokeninDB){
        throw new ApiError(400, "Invalid Tokens, Do not match, Please Try Again!");
    }
    next();
});

const changePasswordHandler = asyncHandler(async function(req, res){
    const {email, newPassword} = req.body;
    if(!newPassword){
        throw new ApiError(400, "Password is Required to Change Password!");
    }
    const user = await User.findOne({email});
    user.password = newPassword;
    
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpires = undefined;

    await user.save();
    return res.status(200).json(new ApiResponse(200, {}, "Password Changed Successfully!"));

});

const verifyEmailHandler = asyncHandler(async function(req, res){
    const token = req.query.token;
    if(!token){
        throw new ApiError(400, "Invalid Verification Request, No Token!");
    }
    const user = await User.findOne({verificationToken: token});
    if(user.verificationTokenExpires < Date.now()){
        throw new ApiError(400, "Token has expired!");
    }
    if(!user){
        throw new ApiError(400, "Invalid Token, No User Found!");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    return res.status(200).json(new ApiResponse(200, {}, "Email Verified Successfully!"));
});

const resetPasswordHandler = asyncHandler(async function(req, res){

});

const refreshAccessToken = asyncHandler(async function(req, res){

});

const getCurrentUser = asyncHandler(async function(req, res){

});

export{
    registerHandler,
    loginHandler,
    logoutHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    refreshAccessToken,
    getCurrentUser,
}