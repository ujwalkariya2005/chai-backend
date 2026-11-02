class apiResponse { // creates standard apiResponse class for consistent success responses
    constructor(statusCode, data, message = "Success"){ // initializes response with status code, data payload, and default success message

        this.statusCode = statusCode // sets the HTTP status code (e.g., 200, 201)
        this.data = data // attaches the response payload or data object
        this.message = message // sets the response message string
        this.success = statusCode < 400 // sets success flag to true if status code is under 400 (indicating success)

    } // closes constructor
} // closes apiResponse class

export { apiResponse } // exports the standard apiResponse class for use across controllers and routes
