// import the v2 cloudinary sdk (s/w dev kit) for cloud media management
import { v2 as cloudinary } from "cloudinary"

// import the file system core module to manage local server files (for local file handling)
import fs from "fs"

// configure (to set up or customize) cloudinary credentials using environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})

// utility function to upload a file from the local server to cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // return null if the local file path is missing or undefined
        if (!localFilePath) return null

        // assigned the result to a 'response' variable so it can be referenced
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // automatically detect file type (image, video, raw, etc.)
        })

        /* delete the temp local file from the server now that the cloudinary upload has succeeded
        to prevent the server's disk space from filling up */
        fs.unlinkSync(localFilePath)

        // log success message and the secure url returned by cloudinary
        console.log("file is uploaded on cloudinary", response.url)

        // returns the cloudinary response object to the caller
        return response
    }

    catch (error) {
        /* remove the locally saved temp file if the upload operation fails 
        to clean up leftover junk files from the server */
        fs.unlinkSync(localFilePath) 

        // return null if the upload process fails
        return null
    }
}

// exports the function for usage across other modules
export { uploadOnCloudinary }
