// imports the Router module from express to define modular route handlers
import { Router } from "express";

// imports the registerUser controller function from the user controller file
import { registerUser } from "../controllers/user.controller.js";

// imports the multer upload middleware for handling multipart/form-data file uploads
import { upload } from "../middleware/multer.middleware.js";

// initializes an express router instance for managing user-related endpoints
const router = Router();

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

// exports the configured router instance as the default export for app linking in app.js
export default router;
