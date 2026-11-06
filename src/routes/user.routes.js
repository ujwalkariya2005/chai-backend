// imports the Router module from express to define modular route handlers
import { Router } from "express";

// imports the registerUser controller function from the user controller file
import { registerUser } from "../controllers/user.controller.js";

// imports the upload middleware function from the multer middleware file
import { upload } from "../middleware/multer.middleware.js";

// initializes a new express router instance for modular route management (or handling user-related endpoints i.e., specific delivery destinations)
const router = Router();

// defines the post route for user registration and links it to the registerUser controller
router.route("/register").post(
    upload.fields([
        { 
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

// router.route("/login").post(loginUser); // placeholder for future login route implementation

// exports the configured router instance as the default export for app linking
export default router;
