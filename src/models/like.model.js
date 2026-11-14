// import the mongoose library to handle MongoDB object modeling and database schemas
import mongoose from "mongoose"

// define a new Mongoose schema for the Like collection, supporting polymorphic liking across videos, comments, and tweets
const likeSchema = new mongoose.Schema({
    video: {
        // define the video field type as a MongoDB ObjectId for referencing a video document
        type: mongoose.Schema.Types.ObjectId,
        // establish a relational reference to the "Video" model (populated if the like is on a video)
        ref: "Video"
    },
    comment: {
        // define the comment field type as a MongoDB ObjectId for referencing a comment document
        type: mongoose.Schema.Types.ObjectId,
        // establish a relational reference to the "Comment" model (populated if the like is on a comment)
        ref: "Comment"
    },
    tweet: {
        // define the tweet field type as a MongoDB ObjectId for referencing a tweet document
        type: mongoose.Schema.Types.ObjectId,
        // establish a relational reference to the "Tweet" model (populated if the like is on a tweet)
        ref: "Tweet"
    },
    likedBy: {
        // define the likedBy field type as a MongoDB ObjectId to track which user performed the like action
        type: mongoose.Schema.Types.ObjectId,
        // establish a relational reference to the "User" model
        ref: "User"
    }
}, {
    // enable automatic generation of createdAt and updatedAt timestamps for tracking when the like occurred
    timestamps: true
})

// compile the schema into a Mongoose model named "Like" and export it for database operations
export const Like = mongoose.model("Like", likeSchema)
