// import custom error utility class for structured error handling
import { apiError } from "../utils/apiError.js"

// import async handler wrapper to automatically catch errors in async functions
import { asyncHandler } from "../utils/asyncHandler.js"

// import jsonwebtoken library to create and verify authentication tokens
import jwt from "jsonwebtoken"

// import user mongoose model to interact with the user database collection
import { User } from "../model/user.model.js"

/* since res wasn't being used it was replaced with _
this is a production-grade practice too */
// export authentication middleware function wrapped in async error handler
export const verifyJWT = asyncHandler(async (req, _, next) => {

    // extract token from cookies or authorization header
    const token = req.cookies?.accessToken || req.header("authorization")?.replace(/^Bearer\s+/i, "").trim()

    try {
        // check if token exists, throw error if missing
        if (!token) {
            throw new apiError(401, "unauthorized request")
        }
    
        // verify token using secret key and decode user payload (or get user details)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    /* user vs. User:
        - `User` (Uppercase): Refers to the Mongoose Model. 
        Use it to talk directly to the database collection (e.g., User.findOne, User.findById).

        - `user` (Lowercase): Refers to an individual document instance. 
        Use it after you have found a specific user in the database and want to run methods on that specific user (e.g., user.isPasswordValid).
    */
        // find user in database using decoded id and hide sensitive fields
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        // check if user still exists in database, throw error if not
        if (!user) {
            throw new apiError(401, "invalid access token")
        }
    
        // attach user object to request and proceed to next middleware or controller
        req.user = user
        next()
    } 
    catch (error) {
        // catch verification errors and throw unauthorized response
        throw new apiError(401, error?.message || "invalid access token")
    }
})
