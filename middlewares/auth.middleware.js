import { User } from "../models/userModel.js";
import asyncHandler from "../helpers/AsyncHandler.js";
import ApiError from "../helpers/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async function(req, res, next) {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "").trim();
    console.log(req.cookies);
    console.log(`accessToken: ${accessToken}`);

    if(!accessToken){
        throw new ApiError(401, "Unauthorized Access! Please Login!");
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(401, "Invalid Token, Such User Was Not Found!");
    }
    console.log(user);

    req.user = user;
    next();
});

export { verifyJWT };