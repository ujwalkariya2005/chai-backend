// imports the multer middleware library for handling multipart/form-data file uploads
// multipart/form-data (the format used when users upload files through a form)
import multer from "multer"

// configures disk storage settings for multer to save files temporarily on the server
const storage = multer.diskStorage({
    // defines where the uploaded file should be temporarily stored on the server disk
    destination: function (req, file, cb) {
        // cb (callback) takes an error (null here) and the destination folder path string
        cb(null, "./public/temp")
    },
    // defines what name the file should be saved with on the server
    filename: function (req, file, cb) {
        // cb takes an error (null here) and sets the saved filename to the user's original filename
        cb(null, file.originalname)
    }
// closes the diskStorage config object
})

// creates the multer upload middleware instance using our custom disk storage config
const upload = multer({ 
    storage: storage 
})

// exports the 'upload' middleware so it can be imported and used inside routes
export { upload }
