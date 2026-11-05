// imports the asynchronous error handling utility wrapper, asyncHandler from utils folder
import { asyncHandler } from "../utils/asyncHandler.js"

// defines the asynchronous user registration controller wrapped in asyncHandler for error handling
const registerUser = asyncHandler ( async (req, res) => {

    // sends a success status and json response back to the client to verify route connectivity
    res.status(200).json({
        message: "he was never there"
    });
});

// exports the registerUser controller function for use in user routes
export { registerUser }
