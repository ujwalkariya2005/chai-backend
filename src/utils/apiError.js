class apiError extends Error { // defines a custom API error class that extends Node.js built-in Error class
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [], // corrected parameter name from 'error' to match assignment below
        stack = ""
    ){
        super(message) // passes the error message up to the parent Error class
        this.statusCode = statusCode // stores the HTTP status code (e.g., 400, 404, 500)
        this.data = null // initializes data property as null for consistency
        this.message = message // sets the descriptive error message
        this.success = false // sets success flag to false for all error responses
        this.errors = errors // stores detailed array of specific error messages or validation issues

        if(stack){ // checks if a custom stack trace was provided
            this.stack = stack // assigns the provided/custom stack trace
        }
        else{
            Error.captureStackTrace(this, this.constructor) // captures clean stack trace excluding constructor call
        }
    }
}

export { apiError } // exports the custom error class for standardized error handling across the project
