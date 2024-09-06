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

const registerHandler = asyncHandler(async function(req, res, next){

});

const loginHandler = asyncHandler(async function(req, res, next){

});

const logoutHandler = asyncHandler(async function(req, res, next){

});

const forgotPasswordHandler = asyncHandler(async function(req, res, next){

});

const resetPasswordHandler = asyncHandler(async function(req, res, next){

});

const refreshAccessToken = asyncHandler(async function(req, res, next){

});

const getCurrentUser = asyncHandler(async function(req, res, next){

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