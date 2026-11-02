// import the core mongoose library for schema creation and model management
import mongoose from "mongoose"

// import the pagination plugin to handle aggregation pagination for heavy lists
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

// define the database structure (schema) for the video collection
const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, // stores the secure video file url hosted on cloudinary
        required: true
    },
    thumbnail: {
        type: String, // stores the secure thumbnail image url hosted on cloudinary
        required: true
    },
    title: {
        type: String, 
        trim: true
    },
    description: {
        type: String, // stores the description or details about the video
        required: true,
        trim: true
    },
    duration: {
        type: Number, // stores the length or duration of the video in seconds
        required: true
    },
    views: {
        type: Number, // tracks how many times the video has been viewed, defaults to 0
        default: 0
    },
    isPublished: {
        type: Boolean, // flag to indicate whether the video is public or private, defaults to true
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // stores the object id of the user who uploaded the video
        ref: "User" // references the 'User' collection for population and relationships
    }
}, { 
    timestamps: true // automatically generates and manages 'createdAt' and 'updatedAt' timestamps
})

// apply the aggregate pagination plugin to the video schema to support pagination on complex queries
videoSchema.plugin(mongooseAggregatePaginate)

// compile and export the video model to perform database operations on the 'videos' collection
export const Video = mongoose.model("Video", videoSchema)
