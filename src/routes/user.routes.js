// imports the Router module from express to define modular route handlers
import { Router } from "express"

// imports the controller functions from the user controller file
import { changeCurrentPassword, 
    getCurrentUser, 
    getUserChannelProfile, 
    getWatchHistory, loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage 
} from "../controllers/user.controllers.js"

// imports the multer upload middleware for handling multipart/form-data file uploads
import { upload } from "../middlewares/multer.middleware.js"

// import jwt verification middleware to protect and secure user routes
import { verifyJWT } from "../middlewares/authentication.middleware.js"

// initializes an express router instance for managing user-related endpoints
const router = Router()

// defines the post route for user registration with multer middleware to handle avatar and cover image files
router.route("/register").post(
    upload.fields([
        { 
            name: "avatar", // field name expected from client form data for the profile picture
            maxCount: 1 // restricts the upload to a single file
        },
        {
            name: "coverImage", // field name expected from client form data for the banner image
            maxCount: 1 // restricts the upload to a single file
        }
    ]),
    registerUser // controller function executed after files are successfully processed and attached to req.files
);

// router.route("/login").post(loginUser); // placeholder for future login route implementation


// define post route for user login and attach login controller function
// upload.none() handles multipart/form-data with text fields only (no file uploads)
router.route("/login").post(upload.none(), loginUser)

// secured routes require authentication middleware to run before the controller
// define post route for user logout protected by verifyjwt middleware
router.route("/logout").post(verifyJWT, logoutUser) 

// define a post route for refreshing user access tokens using an existing refresh token
router.route("/refresh-token").post(refreshAccessToken)

// import and configure routes with authentication middleware (verifyJWT) and file upload handlers (multer)

// define a POST route for changing the user's password, protected by the verifyJWT authentication middleware
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

// define a POST route to fetch the profile data of the currently logged-in user
router.route("/current-user").post(verifyJWT, getCurrentUser)

// define a PATCH route to update general account details (like name and email)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

// define a PATCH route to update the user avatar, using multer middleware to parse a single uploaded file from the 'avatar' field
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

// define a PATCH route to update the user cover image, using multer middleware to parse a single uploaded file from the 'coverImage' field
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

// define a GET route with a dynamic namespace structure to fetch any user's public channel profile by username
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

// define a GET route to retrieve the authenticated user's watch history list (added the missing leading slash)
router.route("/history").get(verifyJWT, getWatchHistory)

// exports the configured router instance as the default export for app linking in app.js
export default router;
