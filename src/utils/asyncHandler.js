// approach 1: using promise (reject, resolve)

const asyncHandler = (requestHandler) => { // higher-order function that accepts a request handler function

    // defines inner middleware function taking express request, response, and next objects
    (req, res, next) => { 
        // executes request handler inside a promise and forwards any errors to express next middleware
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)) 
    } // closes inner function
} // closes asyncHandler wrapper

// exports the utility function for use across project routes
export { asyncHandler }

/* approach 2: using try-catch

// higher-order function that accepts an async function and returns a new wrapper function
const asyncHandler = (func) => async (req, res, next) => {

    try { // starts try block for safe asynchronous execution

        // waits for the passed route function to execute with express request, response, and next objects
        await func(req, res, next)
    }

    catch (error) { // catches any errors thrown during execution

        // sends error response with custom code or fallback 500 server error
        res.status(error.code || 500).json({

            success: false, // sets success flag to false
            message: error.message // sends the error description message back to the client

        }) // closes json object and response
    } // closes catch block
} // closes returned wrapper function

// exports the utility function for use across project routes
export { asyncHandler }
*/