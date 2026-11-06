// imports the asynchronous error handling utility wrapper, asyncHandler from utils folder
import { asyncHandler } from "../utils/asyncHandler.js"

// imports the custom error class for standardized error handling across the project, apiError from utils folder
import { apiError } from "../utils/apiError.js"

import { User } from "../model/user.model.js"

import { upload } from "../middleware/multer.middleware.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { apiResponse } from "../utils/apiResponse.js";

// defines the asynchronous user registration controller wrapped in asyncHandler for error handling
const registerUser = asyncHandler ( async (req, res) => {

    // sends a success status and json response back to the client to verify route connectivity
    /*
    res.status(200).json({
        message: "he was never there"
    });
    */

    const { fullName, email, username, password } = req.body
    console.log("email: ", email)

    /* for checking a single record from user.model.js
    if ( fullName === "" ){
        throw new apiError(400, "fullname is required")
    }
    */

    // for checking multiple records
    if ( [fullName, email, username, password].some((field) => field?.trim() === "" )) {
        throw new apiError(400, "all fields are required")
    }

    const existedUser = User.findOne({
        $or: [ {username}, {email} ]
    })

    if( existedUser ){
        throw new apiError(409, "user with username or email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if( !avatarLocalPath ){
        throw new apiError(400, "avatar file is required")
    }

});

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if ( !avatar ) {
        throw new apiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if ( !createdUser ) {
        throw new apiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "user registered successfully")
    )

// exports the registerUser controller function for use in user routes
export { registerUser }
