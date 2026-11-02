import express from "express" 
// imports express framework to build web server

import cors from "cors" 
// imports cors middleware to control cross-origin access

import cookieParser from "cookie-parser" 
// imports cookie-parser middleware to handle browser cookies

const app = express() 
// initializes express application instance

app.use(cors({ // configures (sets up or customizes) cors middleware settings

    origin: process.env.CORS_ORIGIN, // specifies allowed client origin from environment variables
    credentials: true // allows cookies and authorization headers to be sent across origins

})) // closes cors configuration

app.use(express.json({limit: "16kb"})) 
// configures express to parse incoming json payloads with a size limit (so that the server doesn't crash)

app.use(express.urlencoded({extended: true, limit: "16kb"})) 
// configures express to parse url-encoded form data with extended objects and size limit (so that the server doesn't crash)

app.use(express.static("public")) 
// configures express to serve static files like images from the public folder

app.use(cookieParser()) 
// configures express to parse and manage cookies on user requests

export { app } 
// exports configured express app instance for use elsewhere
