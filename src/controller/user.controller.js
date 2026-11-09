// imports the asynchronous error handling wrapper to catch unhandled promise rejections automatically
import { asyncHandler } from "../utils/asyncHandler.js";

// imports the custom error constructor to throw structured http errors with status codes and messages
import { apiError } from "../utils/apiError.js";

// imports the mongoose user model interface for querying and creating user records in mongodb
import { User } from "../model/user.model.js";

// imports the cloudinary helper utility to stream local files to cloud storage
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// imports the standardized api response formatter for uniform json output structures
import { apiResponse } from "../utils/apiResponse.js";

import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new apiError(500, "something went wrong while generating refresh and access tokens")
    }
}

// hint: check notes_2.md for register controller steps
// defines the asynchronous user registration controller wrapped in error handling logic
const registerUser = asyncHandler ( async (req, res) => {
    
    // extracts text fields from the incoming client request body
    const { fullname, email, username, password } = req.body;
    
    // prints the user email to the console for tracking and debugging
    console.log("email: ", email);

    // checks if any required text field is missing, empty, or contains only whitespace
    if ( [fullname, email, username, password].some((field) => field?.trim() === "") ) {
        
        // throws a 400 bad request error if any mandatory field is empty
        throw new apiError(400, "all fields are required")
    }

    // searches mongodb asynchronously to see if a user already exists with matching credentials
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    // checks if an existing user record was found in the database
    if (existedUser) {
        
        // throws a 409 conflict error to prevent duplicate user registrations
        throw new apiError(409, "user with username or email already exists");
    }

    // logs the uploaded files object containing multer file metadata to the console for debugging
    console.log(req.files);

    /* approach 1: uses modern js optional chaining (?.) and array access approach */
    // retrieves or fetches the temporary local file path for the mandatory avatar upload from multer
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    
    // retrieves or fetches the temporary local file path for the optional cover image upload from multer
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    /* approach 2: uses regular programming approach
    // declares a variable to hold the local path for the optional cover image
    let coverImageLocalPath

    // explicitly validates every layer of the object and array structure before accessing properties
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    
        // extracts the temporary file path from the first element of the coverImage array
        coverImageLocalPath = req.files.coverImage[0].path
    }
    */

    // checks if the local avatar file path is missing from the request
    if (!avatarLocalPath) {
        // throws a 400 bad request error since the profile avatar is mandatory
        throw new apiError(400, "avatar file is required")
    }
    /* note: instead of doing this you may do:
        const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath)
        check for coverImage below you will automcatically know
    */

    // uploads the local avatar file to cloudinary and awaits the secure cloud asset result
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
    // checks if a cover image local path exists, then uploads it to cloudinary or assigns null
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null

    // checks if the cloudinary upload for the mandatory avatar failed or returned null
    if (!avatar) {
        // throws a 400 bad request error if the avatar failed to upload to cloud storage
        throw new apiError(400, "avatar file is required")
    }

    // creates a new user document in mongodb using the validated data and cloud asset urls
    const user = await User.create({
        fullname, // assigns the user's full name matching schema requirements
        avatar: avatar.url, // stores the secure cloud url returned by cloudinary
        coverImage: coverImage?.url || "", // stores the cover image url or defaults to an empty string
        email, // assigns the user's email address
        password, // assigns the raw password (hashed automatically by mongoose pre-save hooks)
        username: username.toLowerCase() // converts and stores the username in lowercase for consistency
    });

    // fetches the newly created user record from mongodb while excluding sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // checks if the user record failed to retrieve from the database after creation
    if (!createdUser) {
        // throws a 500 internal server error if document creation failed unexpectedly
        throw new apiError(500, "something went wrong while registering the user")
    }

    // sends a successful 201 status response containing the standardized api response and created user data
    return res.status(201).json(
        new apiResponse(201, createdUser, "user registered successfully")
    )
})

// hint: check notes_2.md for login controller steps
const loginUser = asyncHandler(async (req, res) => { // wrap controller in async handler to catch errors automatically

    const { email, username, password } = req.body // extract credentials from request body

    if (!username && !email) { // check if both username and email are missing
        throw new apiError(400, "username or email is required") // throw error if identifiers are absent
    }
    if (!password) { // check if password field is empty
        throw new apiError(400, "password is required") // throw error if password is missing
    }

    const user = await User.findOne({ // search database to find user document
        // $_ ➡️ mongodb operators
        $or: [{ username }, { email }] // match user by either username or email
    })

    if (!user) { // check if user exists in database
        throw new apiError(404, "user does not exist") // throw error if user is missing
    }

    const isPasswordValid = await user.isPasswordValid (password) // compare entered password with hashed db password

    if (!isPasswordValid) { // check if password validation failed
        throw new apiError(401, "invalid user credentials") // throw unauthorized error for incorrect password
    }

    // generate short-lived access token and long-lived refresh token pair 
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id) 

    // fetch user record from db excluding sensitive fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") 

    const options = { // define security configuration flags/constraints for cookies

        httpOnly: true, // prevents XSS by blocking client-side script access
        secure: true    // enforce https transmission for cookies
    }

    // return response with the following methods
    return res
        .status(200) // set successful http status code
        .cookie("accessToken", accessToken, options) // set secure access token cookie
        .cookie("refreshToken", refreshToken, options) // set secure refresh token cookie
        .json(
            new apiResponse( // wrap response in standardized api response structure
                200, 
                {
                    user: loggedInUser, // attach sanitized user object
                    accessToken,        // send access token in body
                    refreshToken        // send refresh token in body
                },
                "user logged in successfully" // success message
            )
        )
})

// hint: check notes_2.md for logout controller steps
// wrap controller with asynchandler to catch errors and manage asynchronous execution safely
const logoutUser = asyncHandler(async (req, res) => {

    // search database to find and update user record using authenticated user id
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {
                refreshToken: null // remove refresh token from database so it cannot be used again
            }
        },
        {
            new: true // tell mongoose to return the updated user data
        }
    )

    // set cookie options so the browser knows which cookies to delete
    const options = {
        httpOnly: true, // prevents xss by blocking client-side script access
        secure: true    // allow cookie only over https
    }

    // initiate response chain to set status, clear browser cookies, and return confirmation payload
    return res
        .status(200)
        .clearCookie("accessToken", options) // instruct browser to clear access token cookie
        .clearCookie("refreshToken", options) // instruct browser to clear refresh token cookie
        .json(
            new apiResponse(
                200, 
                {}, 
                "user logged out"
            )
        )
})

// define an asynchronous controller to handle refreshing expired access tokens
const refreshAccessToken = asyncHandler ( async (req, res) => {
    
    try {
        // extract incoming refresh token from cookies or request body fallback
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        // throw an error if no refresh token was provided in the request
        if ( !incomingRefreshToken ) {
        throw new apiError(401, "unauthorized request")
        }
    
        // verify the incoming refresh token against our secret key to decode payload data
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        // find the user in the database using the unique id extracted from the decoded token
        const user = await User.findById(decodedToken?._id)
    
        // throw an error if no matching user record exists for this token id
        if ( !user ) {
            throw new apiError(401, "invalid refresh token")
        }
    
        // ensure the incoming token matches the latest valid refresh token stored in the user document
        if ( incomingRefreshToken !== user?.refreshToken ) {
            throw new apiError(401, "refresh token is expired or used")
        }
    
        // define security cookie options ensuring cookies are sent only over https and restricted from client-side scripts
        const options = {
            httpOnly: true,
            secure: true
        }
    
        // generate a brand new pair of access and refresh tokens for the authenticated user session
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        // send a successful JSON response updating both token cookies and returning tokens in the response body
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "access token refreshed"
            )
        )
    } catch (error) {
        // catch any verification or database failures and throw a standardized unauthorized error response
        throw new apiError(401, error?.message || "invalid refresh token")
    }
})

// exports the controller functions so they can be linked inside user routes
export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
