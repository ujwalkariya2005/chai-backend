/*
The "app.js" file is the central configuration hub for your Express server.

While your main entry point (src/index.js) is responsible for starting the server 
and connecting to the database, "app.js" is responsible for setting up how the server 
behaves before it starts listening for requests.
*/

import express from "express"
// imports express framework to build web server

import cors from "cors"
// imports cors middleware to control cross-origin access

import cookieParser from "cookie-parser"
// imports cookie-parser middleware to handle browser cookies

const app = express()
// initializes express application instance

app.use(
  cors({
    // configures (sets up or customizes) cors middleware settings

    origin: process.env.CORS_ORIGIN, // specifies allowed client origin from environment variables
    credentials: true, // allows cookies and authorization headers to be sent across origins
  }),
) // closes cors configuration

app.use(express.json({ limit: "16kb" }))
// configures express to parse incoming json payloads with a size limit (so that the server doesn't crash)

app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// configures express to parse url-encoded form data with extended objects and size limit (so that the server doesn't crash)

app.use(express.static("public"))
// configures express to serve static files like images from the public folder

app.use(cookieParser())
// configures Express to parse and manage cookies on user requests

// imports the user router module for handling user-related endpoints
import userRouter from "./routes/user.routes.js"

// links the user router under the /users prefix (resulting url: http://localhost:8000/users/register)
// app.use("/users", userRouter)

// similarly for login, you would be guided to http://localhost:8000/users/register

app.use("/api/v1/users", userRouter)
// alternative industry-standard pattern using api versioning
// links the router under /api/v1/users prefix resulting in: http://localhost:8000/api/v1/users/register

export { app }
// exports configured express app instance for use elsewhere
