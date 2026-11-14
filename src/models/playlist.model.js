// import the mongoose library to handle MongoDB object modeling and database schemas
import mongoose from "mongoose"

// define a new Mongoose schema for the Playlist collection, structuring playlist details and relationships
const playlistSchema = new mongoose.Schema({
    name: {
        // define the name field type as a text string for the playlist title
        type: String,
        // mark this field as mandatory so a playlist cannot be created without a name
        required: true
    },
    description: {
        // define the description field type as a text string
        type: String, 
        // mark description as mandatory
        required: true
    },
    videos: [
        {
            // define an array containing MongoDB ObjectIds to store multiple video references per playlist
            type: mongoose.Schema.Types.ObjectId,
            // establish a relational reference to the "Video" model
            ref: "Video"
        }
    ],
    owner: {
        // define the owner field type as a MongoDB ObjectId to store a reference to the creator
        type: mongoose.Schema.Types.ObjectId,
        // establish a relational reference to the "User" model
        ref: "User"
    },
}, {
    // enable automatic generation of createdAt and updatedAt timestamps for document lifecycle tracking
    timestamps: true
})

// compile the schema into a Mongoose model named "Playlist" and export it for database operations
export const Playlist = mongoose.model("Playlist", playlistSchema)
