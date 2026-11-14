// import the mongoose library to handle MongoDB object modeling and database schemas
import mongoose from "mongoose"

// define a new Mongoose schema that outlines the structure, data types, and rules for tweet documents
const tweetSchema = new mongoose.Schema({
    // define the content field to hold the text of the tweet
    content: {
        type: String, // enforce that the content must be stored as a string
        required: true // make the content field mandatory for every tweet document
    },
    // define the owner field to establish a relational link to the user who created the tweet
    owner: {
        type: mongoose.Schema.Types.ObjectId, // store the reference as a MongoDB ObjectId
        ref: "User" // create a Mongoose reference (foreign key) linking this ObjectId to the User model/collection
    }
}, {
    // enable automatic createdAt and updatedAt timestamps for tracking document creation and modification times
    timestamps: true
})

// compile the schema into a Mongoose model named "Tweet" and export it for database operations
export const Tweet = mongoose.model("Tweet", tweetSchema)
