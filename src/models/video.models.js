import mongoose from "mongoose"

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, // cloudinary url to be used
        required: true
    },
    thumbnail: {
        type: String, // cloudinary url to be used
        required: true
    },
    title: {
        type: String, // cloudinary url to be used
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const video = mongoose.model("video", videoSchema)
