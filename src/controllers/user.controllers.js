// imports the asynchronous error handling wrapper to catch unhandled promise rejections automatically
import { asyncHandler } from "../utils/asyncHandler.js";

// imports the custom error constructor to throw structured http errors with status codes and messages
import { apiError } from "../utils/apiError.js";

// imports the mongoose user model interface for querying and creating user records in mongodb
import { User } from "../models/user.model.js";

// imports the cloudinary helper utility to stream local files to cloud storage
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// imports the standardized api response formatter for uniform json output structures
import { apiResponse } from "../utils/apiResponse.js";

import jwt from "jsonwebtoken"
import mongoose from "mongoose";

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
    const { fullName, email, username, password } = req.body;
    
    // prints the user email to the console for tracking and debugging
    console.log("email: ", email);

    // checks if any required text field is missing, empty, or contains only whitespace
    if ( [fullName, email, username, password].some((field) => field?.trim() === "") ) {
        
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
        fullName, // assigns the user's full name matching schema requirements
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

    // compare entered password with hashed db password
    const isPasswordCorrect = await user.isPasswordCorrect (password) 

    if (!isPasswordCorrect) { // check if password validation failed
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

// wrap controller with asynchandler to catch errors and manage asynchronous execution safely
const logoutUser = asyncHandler(async (req, res) => {

    // search database to find and update user record using authenticated user id
    await User.findByIdAndUpdate(
        // pass the unique identifier of the currently logged-in user from the verified request object
        req.user._id, 
        {
            // use MongoDB $set operator to target the refreshToken field
            $set: { /* keeps the fields defined in the document, 
                    preventing validation or query issues if mongoose schema expects the fields to exist */
                refreshToken: null // remove refresh token from database so it cannot be used again
            }
            /* OR use $unset to completely delete the field from the MongoDB document 
            $unset: {
            refreshToken: 1 // '1' is a required flag value telling MongoDB to drop the property entirely from the document
            }
            */
        },
        {
            // use modern returnDocument configuration to return the updated user data
            returnDocument: 'after' // before { new: true } but old

            /* `{ new: true }` vs. `{ returnDocument: 'after' }`

            Old Syntax (Deprecated) ➡️ { new: true }
            New Modern Syntax ➡️ { returnDocument: 'after' }
            Returns the document *after* the update is applied

            Note: recent versions of Mongoose have deprecated the traditional 
            { new: true } option inside methods like findOneAndUpdate() and findOneAndReplace() 
            in favor of the MongoDB driver's standard nomenclature: returnDocument

            Old Syntax (Deprecated) ➡️ { new: false }
            New Modern Syntax ➡️ { returnDocument: 'before' }
            Returns the original document *before* the update
            */
        }
    )

    // set cookie options so the browser knows which cookies to delete
    const options = {
        httpOnly: true, // prevents xss by blocking client-side script access
        secure: true    // allow cookie only over https
    }

    // initiate response chain to set status, clear browser cookies, and return confirmation payload
    return res
    // set the HTTP response status code explicitly to 200 OK
    .status(200)
    // instruct browser to clear access token cookie using the defined security options
    .clearCookie("accessToken", options) 
    // instruct browser to clear refresh token cookie using the defined security options
    .clearCookie("refreshToken", options) 
    // send a standardized JSON response using the custom apiResponse wrapper
    .json(
        new apiResponse(
            200, // set the status code metadata inside the custom apiResponse object
            {}, // pass an empty data object since no user payload is needed upon logout
            "user logged out" // provide a clear success message indicating the logout completed successfully
        )
    )
})

// define an asynchronous controller to handle refreshing expired access tokens
const refreshAccessToken = asyncHandler ( async (req, res) => {
    
    // try block to catch any exceptions during token verification, database lookup, or token generation
    try {
        // extract incoming refresh token from cookies or request body fallback
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        // check if the incoming refresh token is missing; throw a 401 unauthorized error if not found
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
    
        // check if no matching user record exists for this token id; throw a 401 unauthorized error if missing
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
    
        // initialize the HTTP response chain with a success status
        return res
        // set the HTTP response status code explicitly to 200 OK
        .status(200)
        // set the access token cookie using the defined security options
        .cookie("accessToken", accessToken, options)
        // set the new refresh token cookie using the defined security options
        .cookie("refreshToken", newRefreshToken, options)
        // send a successful JSON response using the custom apiResponse wrapper
        .json(
            new apiResponse(
                200, // set the status code metadata inside the custom apiResponse object
                {
                    accessToken, refreshToken: newRefreshToken // pass the newly generated tokens as the response data payload
                },
                "access token refreshed" // provide a clear success message indicating the token refresh completed
            )
        )
    } catch (error) {
        // catch any verification or database failures and throw a standardized unauthorized error response
        throw new apiError(401, error?.message || "invalid refresh token")
    }
})

// define an asynchronous controller wrapped with asyncHandler to handle changing the user's password
const changeCurrentPassword = asyncHandler ( async (req, res) => {
    
    // extract the old password and new password fields from the incoming request body
    const { oldPassword, newPassword } = req.body

    // fetch the user document from the database using the authenticated user's unique ID
    const user = await User.findById(req.user?._id)

    // invoke the custom schema method to verify if the provided old password matches the stored hash
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    // check if the password verification failed; throw a 400 bad request error if the old password is incorrect
    if ( !isPasswordCorrect ) {
        throw new apiError(400, "invalid old password")
    }

    // assign the new plain-text password to the user document (which will trigger the pre-save hook to hash it securely)
    user.password = newPassword

    // save the updated user document to the database while bypassing schema validation checks
    await user.save({ validateBeforeSave: false })

    // initialize the HTTP response chain with a 200 OK status code
    return res
    // set the HTTP response status code explicitly to 200 OK
    .status(200)
    // send a standardized JSON response using the custom apiResponse wrapper
    .json(
        new apiResponse(
            200, // set the status code metadata inside the custom apiResponse object
            {}, // pass an empty data object since no user payload is needed upon password change
            "password changed successfully" // provide a clear success message indicating the password update completed
        )
    )
})

// define an asynchronous controller wrapped with asyncHandler to fetch the currently authenticated user details
const getCurrentUser = asyncHandler ( async (req, res) => {
    
    // initialize the HTTP response chain with a 200 OK status code
    return res
    // set the HTTP response status code explicitly
    .status(200)
    // send a standardized JSON response using the custom apiResponse wrapper containing the attached user data and success message
    .json(
        new apiResponse(
            200,
            req.user,
            "current user fetched successfully"
        )
    )
})

// define an asynchronous controller wrapped with asyncHandler to handle updating user account details
const updateAccountDetails = asyncHandler ( async (req, res) => {
    
    // extract fullName and email fields from the incoming request body
    const { fullName, email } = req.body

    // check if either fullName or email is missing; throw a 400 bad request error if any field is empty
    if ( !fullName || !email ) {
        throw new apiError(400, "all fields are required")
    }

    // query the database using the authenticated user's ID to find and update their account details
    const user = await User.findByIdAndUpdate(
        // pass the unique identifier of the currently logged-in user from the verified request object
        req.user?._id,
        {
            // use MongoDB $set operator to update specific fields with the new values provided in the request body
            $set: {
                fullName,
                email: email
            }
        },
        // use modern returnDocument configuration to return the newly updated user document after modification
        { returnDocument: 'after' }
    // chain a mongoose query modifier to exclude the sensitive password field from the returned user object
    ).select(" -password ")

    // initialize the HTTP response chain with a 200 OK status code
    return res
    // set the HTTP response status code explicitly
    .status(200)
    // send a standardized JSON response using the custom apiResponse wrapper containing user data and success message
    .json(
        new apiResponse(
            200,
            user,
            "account details updated successfully"
        )
    )
})

// define an asynchronous controller wrapped with asyncHandler to manage user avatar updates
const updateUserAvatar = asyncHandler( async (req, res) => {

    // extract the local file path of the uploaded avatar image from the request object populated by multer
    const avatarLocalPath = req.file?.path

    // check if the avatar local path exists; throw a 400 bad request error if it is missing
    if ( !avatarLocalPath ) {
        throw new apiError(400, "avatar file is missing")
    }

    // call the cloudinary utility helper to upload the local file and retrieve the response object
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    // check if the uploaded cloudinary response contains a valid secure URL; throw an error if it failed
    if ( !avatar.url ) {
        throw new apiError(400, "error while uploading avatar")
    }

    // query the database using the authenticated user's ID to find and update their avatar record
    const user = await User.findByIdAndUpdate(
        // pass the unique identifier of the currently logged-in user from the verified request object
        req.user?._id,
        {
            // use MongoDB $set operator to target and replace the existing avatar field value
            $set: {
                avatar: avatar.url
            }
        },
        // use modern returnDocument configuration to return the newly updated user document after modification
        { returnDocument: 'after' }
    // chain a mongoose query modifier to exclude the sensitive password field from the returned user object
    ).select(" -password ")

    // initialize the HTTP response chain with a 200 OK status code
    return res
    // set the HTTP response status code explicitly
    .status(200)
    // send a standardized JSON response using the custom apiResponse wrapper containing user data and success message
    .json(
        new apiResponse(
            200,
            user,
            "avatar updated successfully"
        )
    )
})

// define an asynchronous controller wrapped with asyncHandler to manage user cover image updates
const updateUserCoverImage = asyncHandler( async (req, res) => {

    // extract the local file path of the uploaded cover image from the request object populated by multer
    const coverImageLocalPath = req.file?.path

    // check if the cover image local path exists; throw a 400 bad request error if it is missing
    if ( !coverImageLocalPath ) {
        throw new apiError(400, "cover image file is missing")
    }

    // call the cloudinary utility helper to upload the local file and retrieve the response object
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // check if the uploaded cloudinary response contains a valid secure URL; throw an error if it failed
    if ( !coverImage.url ) {
        throw new apiError(400, "error while uploading cover image")
    }

    // query the database using the authenticated user's ID to find and update their cover image record
    const user = await User.findByIdAndUpdate(
        // pass the unique identifier of the currently logged-in user from the verified request object
        req.user?._id,
        {
            // use MongoDB $set operator to target and replace the existing coverImage field value
            $set: {
                coverImage: coverImage.url
            }
        },
        // use modern returnDocument configuration to return the newly updated user document after modification
        { returnDocument: 'after' } // before: { new: true } but it's old now
    // chain a mongoose query modifier to exclude the sensitive password field from the returned user object
    ).select(" -password ")

    // initialize the HTTP response chain with a 200 OK status code
    return res
    .status(200)
    // send a standardized JSON response using the custom apiResponse wrapper containing user data and success message
    .json(
        new apiResponse(
            200,
            user,
            "cover image updated successfully"
        )
    )
})

// define an asynchronous controller wrapped with asyncHandler to fetch a user channel profile using aggregation
const getUserChannelProfile = asyncHandler(async (req, res) => {
    
    // extract the username parameter from the incoming request URL path
    const { username } = req.params

    // validate that the username parameter exists and is not just empty whitespace
    if (!username?.trim()) {
        // throw a 400 bad request error if the username is missing or empty
        throw new apiError(400, "username is missing")
    }

    // execute an aggregation pipeline on the User model to fetch profile stats and subscription metrics
    const channel = await User.aggregate([
        {
            // stage 1: filter documents to find the specific user account matching the provided lowercase username
            // $match: filters documents based on specific criteria (similar to a find query)
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            // stage 2: perform a left outer join with the subscriptions collection to fetch all subscribers for this channel
            /* $lookup operator: it performs a left outer join with another collection 
            OR say, it combines data from another collection (like joining tables in SQL) */
            /* `left outer join`: (keeps all documents from the primary collection and attaches matching records from the target collection, 
            or returns an empty array if no match is found) */
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            // stage 3: perform a second left outer join with the subscriptions collection to fetch all channels this user is subscribed to
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            // stage 4: introduce computed fields to calculate counts and check if the current user is subscribed
            // $addFields operator to introduce new properties into the documents passing through the pipeline
            $addFields: {
                // calculate the total number of subscribers by getting the size of the subscribers array
                subscribersCount: {
                    $size: "$subscribers"
                },
                // calculate the total number of subscribed channels by getting the size of the subscribedTo array
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                // determine if the currently logged-in user is actively subscribed to this channel using a conditional expression
                isSubscribed: {
                    $cond: {
                        // check if the current user's ID exists inside the subscriber field array of the subscribers lookup results
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        // return true if the user is found in the subscriber array
                        then: true,
                        // otherwise return false if the user is not subscribed
                        else: false
                    }
                }
            }
        },
        {
            // stage 5: shapes the final output document by including or excluding specific fields for the client response
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    // check if the aggregation result array is empty or undefined, meaning no matching user channel was found
    if (!channel?.length) {
        // throw a 404 not found error if the channel does not exist in the database
        throw new apiError(404, "channel does not exist")
    }

    // initiate/start the HTTP response chain with a 200 OK status code
    return res
    // set the HTTP response status code explicitly to 200 OK
    .status(200)
    // send a standardized JSON response using the custom apiResponse wrapper containing the first profile object from the aggregation array
    .json(
        new apiResponse(
            200, // set the status code metadata inside the custom apiResponse object
            channel[0], // pass the aggregated user channel profile document
            "user channel fetched successfully" // provide a clear success message indicating the channel data was retrieved
        )
    )
})

// define an asynchronous controller wrapped with asyncHandler to automatically catch and handle errors for fetching watch history
const getWatchHistory = asyncHandler(async (req, res) => {

    // execute a MongoDB aggregation pipeline on the User model to fetch the authenticated user and their watch history
    const user = await User.aggregate([
        {
            // match the user document using the authenticated user's ID converted to a Mongoose ObjectId
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            // perform a left outer join with the videos collection using the user's watchHistory array of video IDs
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                // define a nested pipeline inside the lookup stage to further process each video document
                pipeline: [
                    {
                        // perform a nested left outer join with the users collection to fetch the owner details of each video
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            // project only specific safe fields from the owner user document
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        // add or overwrite fields in the video document to transform the owner array into a single object
                        $addFields: {
                            owner: {
                                // extract the first element from the owner array using the $first accumulator operator
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    // check if the aggregation result array is empty, meaning the user does not exist
    if (!user?.length) {
        // throw a 404 not found error if the user record could not be found
        throw new apiError(404, "user does not exist")
    }

    // initiate the response chain to return the fetched watch history array
    return res
    // set the HTTP response status code explicitly to 200 OK
    .status(200)
    // send a standardized JSON response using the custom apiResponse wrapper
    .json(
        new apiResponse(
            200,
            // access the first element of the aggregation result and extract the populated watchHistory array
            user[0].watchHistory,
            "watch history fetched successfully"
        )
    )
})

// exports the controller functions so they can be linked inside user routes
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}
