/* ℹ️ approach 2: mdoular separation approach or dedicated db module
take a file separately in any folder (db, connection) and export from there
import it into index.js file and then execute it */

// imports mongoose library to connect and interact with mongodb database
import mongoose from "mongoose"

// imports central db name constant for consistent usage across files
import { DB_NAME } from "./constants.js"

/* ℹ️ approach 2: mdoular separation approach or dedicated db module
take a file separately in any folder (db, connection) and export from there
import it into index.js file and then execute it */

const connectDB = async () => { // defines an async func to handle the database connection

    try { // / starts a try block to handle connection errors safely

    // waits for mongodb connection and captures the response instance
    const connectionInstance = await mongoose.connect(
        // builds the full connection string/uri using env variables and db name
        `${process.env.MONGODB_URI}/${DB_NAME}`
    )

        console.log( // logs successful connection details
            // prints the specific host address connected to mongodb server cluster (in our case, cloud db instance hosted on mongodb atlas)
          `\n mongodb connected ! db host: ${connectionInstance.connection.host}`
        )
    }

    catch (error) { // catches any errors during the connection attempt

        // logs the connection error message
        console.log("mongodb connection error: ", error) 

        // stops the node process immediately with a failure code
        process.exit(1)
    } // closes catch block
} // closes connectDB function

// exports the connection function to be used elsewhere
export default connectDB 
