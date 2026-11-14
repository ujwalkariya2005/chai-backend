// import the mongoose library to handle MongoDB object modeling and database schemas
import mongoose from "mongoose"

// import the pagination plugin designed specifically to handle and paginate MongoDB aggregation pipelines in Mongoose
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

// define a new Mongoose schema for the Comment collection, structuring comment content, video reference, and author
const commentSchema = new mongoose.Schema({
    content: {
        // define the content field type as a text string for the comment text
        type: String,
        // mark content as mandatory so empty comments cannot be created
        required: true
    },
    video: {
        // define the video field type as a MongoDB ObjectId to reference the video being commented on
        type: mongoose.Schema.Types.ObjectId,
        // establish a relational reference to the "Video" model
        ref: "Video"
    },
    owner: {
        // define the owner field type as a MongoDB ObjectId to reference the user who wrote the comment
        type: mongoose.Schema.Types.ObjectId,
        // establish a relational reference to the "User" model
        ref: "User"
    }
}, {
    // enable automatic generation of createdAt and updatedAt timestamps for lifecycle and sorting tracking
    timestamps: true
})

// register the aggregate paginate plugin to the schema, enabling clean pagination methods for aggregation queries (essential for features like infinite scrolling or paginated video comments)
commentSchema.plugin(mongooseAggregatePaginate)

// compile the schema into a Mongoose model named "Comment" and export it for database operations
export const Comment = mongoose.model("Comment", commentSchema)
