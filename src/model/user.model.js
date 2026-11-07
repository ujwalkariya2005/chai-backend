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
    fullname: {
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

// custom instance method: compares an incoming login password with the database's hashed password
userSchema.methods.isPasswordCorrect = async function (password) {

    // bcrypt.compare returns true if the plaintext password matches the stored hash, otherwise false
    return await bcrypt.compare(password, this.password)
}

// custom instance method: generates a short-lived access token for authenticating api requests
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            // payload: data embedded inside the token payload
            id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET, // secret key used to digitally sign the token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // token lifespan (e.g., "15m")
        }
    )
}

// custom instance method: generates a long-lived refresh token to maintain persistent login sessions
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            id: this._id // refresh tokens typically contain minimal payload data for security
        },
        process.env.REFRESH_TOKEN_SECRET, // separate secret key for refresh tokens
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // longer lifespan (e.g., "7d")
        }
    )
}

// compile and export the User model to perform CRUD operations on the 'users' collection in MongoDB
export const User = mongoose.model("User", userSchema)
