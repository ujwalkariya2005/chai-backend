// import the mongoose library to handle MongoDB object modeling and database schemas
import mongoose, { Schema } from "mongoose"

// define a new Mongoose schema structure for managing user channel subscriptions
const subscriptionSchema = new Schema({

    // define the subscriber field representing the user who is initiating the subscription
    subscriber: {
        // set the data type to a MongoDB ObjectId referencing another collection document
        type: mongoose.Schema.Types.ObjectId, // one who is subscribing
        // establish a relationship reference linking this field to the User model
        ref: "User"
    },

    // define the channel field representing the target creator/user being subscribed to
    channel: {
        // set the data type to a MongoDB ObjectId referencing another collection document
        type: mongoose.Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
        // establish a relationship reference linking this field to the User model
        ref: "User"
    }
}, 
// pass schema options to automatically generate createdAt and updatedAt timestamps
{ timestamps: true } 
)

// compile and export the Mongoose model named "Subscription" using the defined subscription schema
export const Subscription = mongoose.model("Subscription", subscriptionSchema)
