// import the core mongoose library for schema creation and model management
import mongoose from "mongoose"

//import jsonwebtoken for generating secure session tokens (access and refresh tokens)
import jwt from "jsonwebtoken"

// import bcrypt for securely hashing passwords using salting and cryptography
import bcrypt from "bcrypt"

// define the database structure (schema) for the User collection
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,      // removes whitespace from both ends of the string
        index: true      // optimizes and enables fast searching/indexing for this field in MongoDB
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,    // stores the secure URL of the image hosted on Cloudinary
        required: true,
    },
    coverImage: {
        type: String,    // optional background banner image URL from Cloudinary
    },
    watchHistory: [      // array of ObjectIds linking to the Video model
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video" // references the 'Video' collection for population/joins
        }
    ],
    password: {
        type: String,
        required: [true, "password is required"]
        // hashing and salting ensures their database hashes remain completely unique anyway
    },
    refreshToken: {
        type: String     // stores the long-lived token used to refresh expired access tokens securely
    }
}, { 
    timestamps: true     // automatically generates and manages 'createdAt' and 'updatedAt' timestamps
})

// mongoose pre-save hook: executes right before a document is saved to the database
userSchema.pre("save", async function () {
    
    // if the password hasn't been modified, exit the hook early without hashing
    if (!this.isModified("password")) return;

    // hash the plain-text password securely with bcrypt using a salt round of 10
    this.password = await bcrypt.hash(this.password, 10);
});

// define a custom instance method on the user schema to check if password is correct
userSchema.methods.isPasswordCorrect = async function(password) {
    
    // compare the incoming plain-text password with the hashed password stored in the database
    return await bcrypt.compare(password, this.password);
}

// custom instance method: generates a short-lived access token for secure API request authentication
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            // token payload: core user identification details embedded within the JWT
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET, // secret key used to digitally sign and verify the access token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // token lifespan configuration (e.g., "15m")
        }
    )
}

// custom instance method: generates a long-lived refresh token to keep users logged in securely
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            // token payload: minimal user identification required for refresh verification
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET, // secure secret key reserved only for refresh tokens
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // longer token lifespan configuration (e.g., "7d")
        }
    )
}

// compile and export the User model to perform CRUD operations on the 'users' collection in MongoDB
export const User = mongoose.model("User", userSchema)
