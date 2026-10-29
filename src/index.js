/*
require("dotenv").config({
    path: "./env"
})

however this breaks the consistency we have maintained using modular js type in package.json
solution: below
*/

// imports dotenv library to load hidden environment variables
import dotenv from "dotenv" // using this won't cause a problem

// configures (or sets up or customizes) dotenv to read variables from a custom file path
dotenv.config({ 
  path: "./env"
}) // note: requires flags like -r dotenv/config in package.json to load properly; discussed below
/* but... in order to use this you need to manipulate experimental/developer features in package.json file 
in dev: after nodemon write `-r dotenv/config --experimental-json-modules` */

// imports db connection func to connect to mongodb
import connectDB from "./db/index.js"

// invokes (or executes or triggers) the function to establish the database connection
connectDB()

// imports mongoose library to connect and interact with mongodb database
import mongoose from "mongoose"

// imports central db name constant for consistent usage across files
import { DB_NAME } from "./db/constants.js"

/* ❗ approach 1: inline execution approach or single-file setup
using iife thus executing the func in the same place only

// imports express framework to build and manage backend server routes and middleware
import express from "express"

// initializes an express application instance to handle incoming http requests and responses
const app = express ()

// iife (immediately invoked function expression)
// always use `;` before writing iife else problems may occur

; ( async () => { // defines and immediately invokes/triggers an async func to handle db connection and server startup safely

    try { // starts a try block to handle any unexpected runtime exceptions without crashing the app

        await mongoose.connect(`${process.env.MONGODB_URI}`) // waits securely for async connection to the remote mongodb database

        app.on("error", (error) => { // sets up an event listener to catch any unexpected errors thrown by the express application itself

            console.log("err: ", error) // logs the specific express error details to the terminal console for debugging

            throw error // throws the error forward to stop operations and catch it safely
        })

        app.listen(process.env.PORT, () => { // starts the express web server listening on the port specified in env variables

            console.log(`app is listening on port ${process.env.PORT}`) // logs a success message confirming the server is up and running
        }) // closes app listen callback function
    } // closes try execution block

    catch (error) { // catches and handles any critical errors thrown during db connection or server startup

        console.error("error: ", error) // logs the caught error object to help trace connection failures

        throw err // throws the error to prevent silent application failures
    } // closes catch block
}) // immediately executes the wrapper async func the moment the file loads

*/

/* ℹ️ approach 2: mdoular separation approach or dedicated db module
take a file separately in any folder (db, connection) and export from there
import it into index.js file and then execute it */
