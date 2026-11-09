// imports the asynchronous error handling wrapper to catch unhandled promise rejections automatically
import { asyncHandler } from "../utils/asyncHandler.js";

// imports the custom error constructor to throw structured http errors with status codes and messages
import { apiError } from "../utils/apiError.js";

// imports the mongoose user model interface for querying and creating user records in mongodb
import { User } from "../model/user.model.js";

// imports the multer middleware configuration for handling multipart form-data file uploads
import { upload } from "../middleware/multer.middleware.js";

// imports the cloudinary helper utility to stream local files to cloud storage
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// imports the standardized api response formatter for uniform json output structures
import { apiResponse } from "../utils/apiResponse.js";

// defines the asynchronous user registration controller wrapped in error handling logic
const registerUser = asyncHandler(async (req, res) => {
    
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

// exports the registerUser controller function so it can be mounted inside user routes
export{
    registerUser,
    loginUser
}
