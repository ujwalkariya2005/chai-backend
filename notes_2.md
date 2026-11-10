we used `"type": "module"` in `package.json file` in order to maintain consistency while importing libraries

> dependency vs. dev dependency:
> `dependency`:
- Definition: An external software package, library, or module that a project requires to function properly.
- Analogy: Like needing a specific ingredient from the store to complete a recipe; without it, the project cannot run.
- how to install? : `npm i <package-name>/<dependency-name>`
  e.g.: `npm i mongoose express dotenv`

`dev dependency`:
- Definition: An external package required exclusively during the development, testing, or building phases (e.g., testing frameworks, linters, build tools) and excluded from the production environment.
- Analogy: Like construction tools used to build a house that are removed before occupants move in.
- how to install? : `npm i -D <package-name>/<dependency-name>`
  e.g.: `npm i -D nodemon`

➡️ "scripts": {
"dev": "nodemon src/index.js"
}"
- Purpose: Automates server restarts and provides a short command (`npm run dev`) to launch the application from `src/index.js`.

➡️ commands:
- `ls`: Lists files and directories in the current location.
- `cd`: Changes the current working directory.
- `mkdir`: Creates a new directory.

> database
> What is a `Database`?
- Simple Analogy: Think of a database like a massive, highly organized filing cabinet or a digital warehouse. Instead of keeping your important files scattered all over your desk (or losing them when your app restarts), you store them neatly in labeled drawers so you can find, update, or delete them instantly.
- Simple Definition: A `database` is an organized electronic system that allows applications to securely store, retrieve, and manage persistent data (data stored on a permanent storage like hard drive) so information is never lost when the app restarts.

What is `MongoDB`?
- Simple Analogy: Think of `MongoDB` like a filing cabinet full of flexible folders (documents) instead of rigid, old-fashioned spreadsheet tables with strict rows and columns. If one note needs a title and description, and another note needs a title, description, and a color tag, MongoDB accepts them without complaining.
  Simply, it easily adapts to store whatever custom data fields your app throws at it.
- Simple Definition: `MongoDB` is a popular `NoSQL` (`Not Only SQL`) database that stores data in flexible, JSON-like documents (called _BSON_) rather than traditional tables and rows.

Key Points to Remember:
1. Persistence: Unlike your in-memory array (`const notes = []`), which wipes clean every time your server restarts, a database saves data permanently on your disk.
2. NoSQL Flexibility: MongoDB doesn't force you to follow a rigid table structure, making it very fast and easy to change data fields as your app grows.

What is a `Cluster`?
- Simple Analogy: Think of a single-lane checkout counter at a grocery store vs. multiple cashiers working at different counters behind the exact same entrance door. Instead of one cashier getting overwhelmed by a long line of customers, multiple cashiers handle people in parallel.
- Simple Definition: A `cluster` is a group of multiple running instances of your Node.js server (called _workers_) that all share a single server port to handle incoming traffic together.

> Note: `Instance`
- Simple Analogy: Think of a popular restaurant that gets too busy for just one front door. Instead of opening a new location across town, they open three identical copies of the restaurant right next to each other, sharing the exact same street address and front door. Each copy is an `instance`.
- Simple Definition: An `instance` is an independent, running copy of your Node.js application running in computer memory.

In the Context of _Clustering_:
When we say a cluster runs "multiple instances (workers)" of your server:
1. Your computer spins up `Copy #1` of your Node app.
2. It spins up `Copy #2`, `Copy #3`, and `Copy #4` right alongside it.
3. Even though there are 4 separate copies running in the background, all of them listen to port 4000 together, sharing the workload so your app can handle heavy traffic without slowing down.

Key Points to Remember:
1. Multi-Core Utilization: Modern computers have multiple CPU cores (e.g., 4, 8, or 16 cores). Clustering lets your Node app use all of them instead of overloading just one core.
2. Traffic Control: The built-in cluster module automatically distributes incoming requests among the different worker processes so no single one gets overwhelmed.
3. Crash Protection: If one worker process crashes or fails, a fresh replacement starts up instantly so your app stays online.

What is a `MongoDB Connection String/URI (Uniform Resource Identifier)`?
- Simple Analogy: It acts like a complete address and set of login credentials for your database. It tells your Node.js application where the database lives, how to connect to it, and who is trying to log in.
- Simple Definition: A Connection String/URI (Uniform Resource Identifier) is a standardized URL that contains all the necessary credentials and network details for your application to securely connect to a MongoDB database.

Breaking Down The Connection String:
> mongodb+srv://ujwal:ujwal123@cluster0.nnpq6bq.mongodb.net/
1. `mongodb+srv://`: The secure protocol used to connect to a cloud-based MongoDB cluster.
2. `ujwal:ujwal123`: Your database username and password (separated by a colon).
3. `cluster0.nnpq6bq.mongodb.net`: The unique domain address of your cloud database server hosted on MongoDB Atlas.
4. `/`: The specific database name at the end (currently empty, meaning it connects to the default root). (we won't use it though since it can cause problems in the future, for more info check _.env folder_)

> Practices for Database Connection
- The Database is Remote (Use `async/await`)
  Explanation: "Our database usually lives on a remote cloud server in another location, so connecting to it takes time. Because it doesn't happen instantly, we use `async/await` to wait for the connection safely without blocking our app."
- Things Can Go Wrong (Use `try...catch` or `Promises`)
  Explanation: "Network issues, bad passwords, or server drops can cause failures. We always wrap our connection code in a `try...catch` block to handle errors gracefully and prevent our app from crashing."

Meaning of Key Terms:
1. `async` (Asynchronous): Tells JS that a function will handle tasks that take time (like talking to a database) so it doesn't freeze/block the rest of the app.
2. `await`: Pauses the execution inside an _async function_ until the slow task (like a database response) finishes.
3. `try`: A block of code where you _attempt_ to run risky operations (like connecting to a remote database).
4. `catch`: A backup block that catches the error immediately if something goes wrong inside the `try` block, preventing a server crash.
5. `resolve`: A promise method used to say: _"The task was successful, here is the data."_
6. `reject`: A promise method used to say: _"The task failed, here is the error."_

`IIFE (Immediately Invoked Function Expression)`:
It is a function that runs the exact moment it is defined, without needing to be called manually. In backend development, it is often used to connect to the database as soon as the application starts.

Key Things to Remember about `IIFEs`:
1. Semicolon `;` at the start: Prevents JavaScript parsing errors (Automatic Semicolon Insertion bugs) if the previous line lacks a semicolon.
2. Execution parentheses `()` at the end: Immediately invokes/triggers the function upon definition.

`Note`:
- Whenever you are setting middleware or config settings, you are supposed to use `app.use()`.
- `multer`: A third-part package used to configure file uploading.

> What is `Express Middleware`?
ℹ️ Convention: Call `Express Middleware` -> `Middleware` ONLY
- _Simple Analogy_: Think of middleware like a security checkpoint or airport customs guard. When you want to enter a building or country (the route handler), you first have to pass through security. Security checks your bag, takes away anything dangerous, and only lets you through if everything looks good.
- _Simple Definition_: `Express Middleware` is a function that sits in the middle of the request-response cycle. It intercepts incoming client requests before they reach your route code, allowing you to inspect, modify, or block them.
Operates at the HTTP layer. It sits between the client request and your route controller.

e.g.: `app.use(express.json());`

- Why you need it: We put `app.use()` at the top of our `app.js` because it runs for every single request coming into your server (e.g., parsing JSON, logging requests, enabling CORS).
  Express cannot read raw JSON strings by default. `express.json()` is a built-in middleware that intercepts the request, parses that raw JSON string into a usable JavaScript object, and attaches it to `req.body` so your controllers can actually read it.

> What are `Mongoose Middlewares (Hooks)`?
ℹ️ Convention: Call `Mongoose Middlewares` -> `Hooks` ONLY
- Calling Mongoose hooks "middleware" is technically correct because they intercept the database operation lifecycle, but calling them "hooks" helps developers instantly know you are talking about Mongoose schemas rather than Express servers.

`Mongoose Middlewares (Hooks)` are functions that allow you to run custom code automatically before or after a specific database operation happens (such as saving, updating, or deleting a document).
Operates at the Database layer. It sits right before or after a database action (like saving a user model).

The Two Main Types of Hooks in Mongoose:
1. `pre` hooks: Run before an action executes (e.g., _before_ a user document is saved to the database).
2. `post` hooks: Run after an action finishes executing (e.g., _after_ a user is successfully deleted, you might want to log it or delete their uploaded files).

- `next` keyword importance:
  It tells Express to pass control to the next middleware function in the request-response stack.
  If you call next(): Express moves forward to the next middleware, route handler, or error handler.
  e.g.: `next` is a callback function passed as the third argument to middleware functions `((req, res, next) => {})`. We performed this in `asyncHandler.js` file, check it.

> Note:
> `Intercept` - To stop something while it is on its way from one place to another, before it reaches its final destination.

> what is `cors`?

- `cors` stands for `cross-origin resource sharing`. it is a security feature implemented by web browsers that controls how different websites or servers can request resources from each other.
- `CORS (Cross-Origin Resource Sharing)` is a browser security mechanism that allows a server to specify which external domains are permitted to access its resources and APIs.

- why is it needed?
  ans: by default, web browsers use a rule called the "same-origin policy". this rule blocks a frontend application running on one port or domain (like `http://localhost:3000`) from making api requests to a backend server running on a different port or domain (like `http://localhost:8000`).

- how `cors` works?
  ans: `cors` acts like an official permission slip. when you configure cors on your express backend, you give the browser a list of trusted frontend origins. it tells the browser:
  "hey, i trust this specific website or client, so it is safe to let them access my server data."

> What is a `Higher-Order Function`?
> A `higher-order function` is a function that does at least one of the following:

1. Takes one or more functions as arguments (parameters).
2. Returns a function as its result.
   In JavaScript, functions are treated as "first-class citizens," meaning they can be treated like regular variables-passed around, stored, and returned.

ex 1:
const runTask = (taskFunction) => { // higher-order function that accepts a function
console.log("starting task...")
taskFunction() // executes the passed function
}
const printHello = () => { // simple function to print text
console.log("hello!")
}
runTask(printHello) // passes printHello into runTask

ex 2:
const createPrinter = () => { // higher-order function that returns a function
return () => {
console.log("printing from inside!")
}
}
const myPrinter = createPrinter() // calls outer function, stores returned function in a variable
myPrinter() // executes the returned inner function

> What is a `Constructor`?
A `constructor` is a special method inside a class that automatically runs the exact moment a new object is created from that class.
e.g.:
class Car {
  constructor(brand, color) { // runs automatically when _new Car()_ is called
    this.brand = brand // sets the object's brand property
    this.color = color // sets the object's color property
  }
}

const myCar = new Car("toyota", "red") // constructor runs here
console.log(myCar.brand) // output: toyota
console.log(myCar.color) // output: red

`Note`: We have created the following files in `utils folder` of our project because it standardizes and professionalizes the backend development process.
*asynchronous* (programming which allows tasks to run in the background without blocking the rest of the application; instead of waiting for a long-running process like db query to finish, the program continues to execute other codes and handles the reuslts once it's ready)

1. `asyncHandler.js`: Database operations are _asynchronous_ and require `try-catch` blocks to handle errors. This utility acts as a wrapper function (a higher-order function). Instead of writing repetitive `try-catch` logic in every controller, you simply wrap your function in this utility. It makes your code cleaner and prevents bugs.
2. `apiError.js`: This defines a custom class that extends the standard JavaScript Error class. It allows you to create structured error objects. By using this, every error sent to the client includes essential information like a statusCode, message, and a success: false flag in a uniform format.
3. `apiResponse.js`: Similar to the error handler, this class ensures that every successful response follows the exact same structure. It bundles the `statusCode`, `data`, and `message` into a consistent format with a `success: true` flag. This makes it much easier for the frontend to reliably consume data from your API.

`Note`:
> mongoose-aggregate-paginate-v2
- `Aggregate (Aggregation)`
  ➡️ What it means: Asking MongoDB to process your data through a pipeline of multiple steps (like a factory assembly line).
  ➡️ Example: Instead of just grabbing a raw list of users, an aggregation query might:

1. `$match` (filter out inactive users)
2. `$lookup` (join the user collection with their uploaded videos)
3. `$sort` (order them by subscriber count)

- `Paginate (Pagination)`:
  ➡️ What it means: Splitting a massive list of results into numbered pages (or chunks) so your app doesn't crash trying to load millions of records at once.
  ➡️ Example: Instead of showing all 5,000 videos on a single screen, you split them into pages of 10 videos per page (page: 1, limit: 10).

Putting Them Together:
`Aggregate pagination` splits the results of a complex MongoDB aggregation pipeline (multi-stage queries involving filtering, joining collections, or computing stats) into manageable, numbered pages (e.g., page 1, page 2) while automatically calculating total document counts and page navigation metadata.

> bcrypt (Password Hashing Library)
- What it is: A library designed to securely _hash_ (transform input data like a password into a fixed length, unreadbale string that can't be reversed back to the original text) and compare passwords before saving them to your database.
- Why it’s used: It converts plaintext passwords into unreadable strings with a random "salt" (random string of data added to a password before it is hashed) to protect against brute-force attacks.

> jwt / jsonwebtoken (Authentication Token)
- What it is: A standard (JSON Web Token) used to securely transmit information between the client and the server as a compact, signed object.
- Why it’s used: HTTP is a "stateless" protocol, meaning the server forgets who a user is after every request. When a user successfully logs in, your server creates a JWT (signed with a secret key) and sends it back to the client. For all future requests (like uploading a video or viewing a profile), the client sends that token back, proving they are logged in without needing to send their username and password over and over again.

> Note:
- `Cloudinary`: A cloud-based service for uploading, storing, managing, and optimizing media assets like images and videos.

- `Multer`: an Express Middleware
1. _What it is_: A popular Node.js middleware designed specifically for handling multipart/form-data (the format used when users upload files through a form).
2. _Why it’s used_: Express cannot handle file uploads by default (`express.json()` only handles text/JSON). When a user uploads an avatar or a video, Multer intercepts the request, grabs the file, temporarily stores it on your server's disk (or in memory), and makes it accessible via `req.file` or `req.files` so your controller can process or forward it to Cloudinary.

- `express-fileupload`: an Express Middleware
1. _What it is_: An alternative Express middleware used for handling file uploads, serving the exact same core purpose as Multer.
2. _Why it’s used_: Like Multer, it parses uploaded files from incoming requests and attaches them to `req.files`. Some developers prefer it because its configuration and syntax are often considered simpler and more "plug-and-play" than Multer, though Multer offers more advanced control over storage destinations and file filtering.

> IMP NOTE:
1. `parsing`: `Parsing` is the process of taking raw, unstructured data (like a raw string of text coming over the internet) and converting it into a structured, usable format (like a JavaScript object) that your code can easily read and manipulate.
   In Express, when a browser sends JSON text like `{"email":"test@test.com"}`, parsing turns that text into an actual JavaScript object (`{ email: "test@test.com" }`) so you can type `req.body.email`.

2. `req.file` vs `req.files`
   When working with file upload middleware (like Multer), uploaded files are attached directly to the `request` object so your controller can access them:

- `req.file` (Singular):
  - Used when a user uploads a single file.
  - It returns a single JavaScript object containing all details about that file (e.g., `req.file.path`, `req.file.originalname`, `req.file.size`).
  - Example: Changing a profile picture (avatar).
- `req.files` (Plural):
  - Used when a user uploads multiple files at once.
  - It returns either an array of file objects or an object containing arrays grouped by field name.
  - Example: Uploading both an avatar and a cover image in the same form, or uploading an album of photos.

3. What `express.json()` handling text/JSON means: It reads incoming HTTP requests with a `Content-Type` header of `application/JSON` (containing text strings formatted as JSON) and converts them into JavaScript objects on `req.body`. It cannot process binary data, non-JSON text, or multipart form-data (file uploads).

4. `fs` (File System):
- A built-in Node.js core module that allows your application to interact with your operating system's file system (allowing you to read, write, update, and delete files directly on your server's disk).
- Why it matters in your project:
  When using a tool like `multer` to handle uploads, files are often saved to a temporary local folder on your server first. Once your server successfully uploads that file to Cloudinary, you use the `fs` module to delete the temporary file from your local machine so your server's storage doesn't fill up with junk data.
- Delete files (`fs.unlink` or `fs.unlinkSync`).

> Note:
1. `Disk Storage` vs. `Memory Storage`
- Memory Storage (`memoryStorage`): Stores files as raw buffers inside your server's RAM (main memory). It is fast, but handling large files (like videos) will quickly exhaust your RAM and crash your server.
- Disk Storage (`diskStorage`): Saves files temporarily to your server's hard drive/SSD (e.g., ./`public/temp`). It is safe for large files, protects server RAM, and lets you easily upload to Cloudinary before cleaning up.

2. `fieldname` vs. `originalname`
- `fieldname`:
  - The name of the HTML form input field specified on the frontend (e.g., <input type="file" name="avatar" /> has a fieldname of "avatar").
  - It tells your backend code which input field the file came from. This is crucial when a form handles multiple different files at once (e.g., one field named `avatar` and another named `coverImage`).

- `originalname`:
  - The actual name of the file as it existed on the user's local computer (e.g., `my_vacation_video.mp4` or `profile-pic.png`).
  - It tells you what the user called the file.
  - Note: In production code, using `file.originalname` directly can sometimes cause issues if two different users upload a file with the exact same name (e.g., `image.png`), leading to overwrites. Often, developers modify this or append a timestamp/random string, but keeping it helps you inspect the file type or extension.

The Difference Between the Two:
1. `file.fieldname`:
- Tells you which HTML form field the file came from (e.g., if your frontend form has <input type="file" name="avatar" />, fieldname will be `"avatar"`).
- Use case: Useful when your backend route handles multiple different files at once (like an avatar and a cover image) and you need to check which field is currently being processed.

2. `file.originalname`:
- Tells you the actual name of the file on the user's computer (e.g., `my_vacation_video`.mp4 or `profile-pic.png`).
- Use case: Useful if you want to log what the user named their file, display their original filename in the UI, or use it for reference before uploading it to the cloud.

What Your Instructor Meant?
When building controllers in a MERN project, instructors sometimes temporarily log or reference `file.fieldname` during early debugging (e.g., `console.log(file.fieldname)` to verify the form input name matches).
Later, when they want to inspect or reference the actual file name the user uploaded, they switch to `file.originalname`.
Because both properties live on the same file object (`req.file`), swapping one for the other in a console log or debug statement causes zero functional issues—especially since your temporary local file gets deleted immediately afterward using `fs.unlinkSync()`.

What You Actually Need for Cloudinary?
Neither `fieldname` nor `originalname` is what actually gets uploaded to Cloudinary.
To upload a file to Cloudinary, your controller passes `file.path` (which points to the temporary disk location created by Multer, like `./public/temp/my_vacation_video.mp4`) into your `uploadOnCloudinary` function (*check cloudinary.js in utils*).

Summary:
- Use `file.path` to send the file to Cloudinary.
- Use `file.originalname` if you need to know or log the user's original file name.
- Use `file.fieldname` if you need to check which form input field submitted the file.

> Note: 
1. *`HTTPS`* is always preferred over HTTP for any modern application or website.
While `HTTP` is the *underlying protocol* for text transfer, the "S" in HTTPS stands for "Secure." It adds a *layer of encryption* that is non-negotiable for protecting user privacy and maintaining professional standards.
  - *Underlying Protocol*: The foundational set of rules and standards that governs how data is transmitted between a client (browser) and a server.
  Simply, think of it as a shared language (or rulebook) that allows client and server to exchange data reliably and consistently over the internet.
  - *Encryption*: The process of converting readable data into an unreadable, secure code using mathematical algorithms so that only authorized parties can decode and read it using the correct 'key'.
  In short, it is the act of turning your data into a secret code.

2. *`HTTP headers`* act as *metadata* (data describing the content in an HTTP request or response). They use key-value pairs to provide essential context for how messages are processed.

Key Characteristics:
- Structure: Organized as key-value pairs (e.g., Name: Value).
- Scope: Used in both client requests and server responses.
- Functionality: Vital for caching, authentication, state management, and defining data representation (encoding/compression).

Commonly Used Headers:
- `Accept`: Defines expected data formats.
- `User-Agent`: Identifies the client/browser.
- `Authorization`: Transmits security credentials (e.g., Bearer (JWT) tokens).
- `Content-Type`: Specifies resource media type (JSON, images, etc.).
- `Cookie`: Maintains state between client and server.
- `Cache-Control`: Manages data expiration rules.

3. *`HTTP methods`* define basic set of operations that can be used to interact with the server *or* actions a client performs on a server:
- `GET`: Retrieves/fetches data from the server.
- `POST`: Sends data to create a new resource.
- `PUT`: Replaces an existing resource entirely.
- `PATCH`: Updates only specific parts of an existing resource.
- `DELETE`: Removes a specific resource.
- `HEAD`: Requests only the headers, excluding the response body.
- `OPTIONS`: Lists the methods supported by a specific endpoint.
- `TRACE`: Performs a loop-back test for debugging network paths.

4. *`HTTP status codes`* indicate the result of a client's request to a server, categorized by the first digit:
  - `1xx (Informational)`: The request was received and the process is continuing.
  - `2xx (Success)`: The request was successfully received, understood, and accepted.
    - `200`: Standard success (OK).
    - `201`: A resource was successfully created.
    - `202`: The request was accepted for processing, but not yet completed.
  - `3xx (Redirection)`: Further action needs to be taken to complete the request, such as moving a resource to a new location.
    - `307/308`: Used for temporary or permanent redirection.
  - `4xx (Client Error)`: The request contains bad syntax or cannot be fulfilled due to client-side issues.
    - `400`: Bad request (general client error).
    - `401`: Unauthorized (authentication is required or failed).
    - `402`: Payment required.
    - `404`: Not found (the requested resource does not exist).
  - `5xx (Server Error)`: The server failed to fulfill an apparently valid request.
    - `500`: Internal server error.
    - `503/504`: Issues like server overload or gateway timeouts.

> Identifying, Understanding and Resolving Errors in Backend:
The 3-Step Reading Strategy:
When your terminal explodes with red text, don't panic. Follow these three steps:
1. Find your file first:
    Ignore the internal Node.js core files at the top of the trace (like node:internal/modules/...). Scan down until you see your project file path (e.g., src/routes/user.routes.js). That is where your code triggered the crash.
2. Look at the line number:
    Most traces include a line number (e.g., :272 or on line 14). Open your code editor, jump straight to that file and line, and look at what you wrote.
3. Match the symptom:
    - `ERR_MODULE_NOT_FOUND` ➡️ You misspelled a file path, forgot a `../`, or left off the `.js` extension.
    - `TypeError`: *X is not a function* ➡️ You tried to call something as a function that wasn't exported correctly or is `undefined`.
    You tried to perform an operation on the wrong data type (like calling a function that doesn't exist).
    - `MongoServerError` ➡️ Your database connection string is wrong, or your MongoDB cluster is rejecting your IP/credentials.
    - `ReferenceError` ➡️ You tried to access a variable, constant, or function name that has not been declared, is out of scope, or has not been initialized yet in the current execution context (such as misspelling a variable name or trying to use an identifier before it exists). 

> Note: 
1️⃣ `The Symbols Explained`:
1. **`./ (Current Directory)`**:
  - Tells Node.js to look inside the exact same folder where your current file is sitting.
  - Example: If you are writing your main entry point inside `src/index.js` and you want to import your Express app configuration from `src/app.js` (which sits right next to it in the exact same `src/` folder), you start with **`./`** to look in the current folder. Looks like: `import { app } from "./app.js"`.
2. **`../ (Parent Directory / Stepping Up)`**:
  - Tells Node.js to step one level up out of the current folder into its parent directory.
  - Example: If you are inside `src/routes/user.routes.js` and your controller is in `src/controllers/user.controller.js`, you need to use **`../`** to exit the routes folder first, and then go into `controllers/`. That gives you `../controllers/user.controller.js`.

2️⃣ **`Named vs. Default Exports`**:
1. *`Default Export`* (`import express from "express"`): You can do this directly because express itself is the main default thing exported.
2. *`Named Export`* (`import { Router } from "express"`): `Router` is a specific tool inside Express. Because a file can have many named tools, you must wrap them in curly braces `{}` and use their exact name.

Another scenario:
`export default connectDB` vs. `export { connectDB }`
Yes, you can write it as `export { connectDB }`, but it changes how you must import it later.
The difference comes down to `Default` vs. `Named Exports`:
1. *Current Way* (`export default connectDB`):
This is a *`Default Export`*.
How you import it: `import connectDB from "./db/index.js"` (NO Curly Braces, and you can actually name it whatever you want).
2. *Alternative Way* (`export { connectDB }`):
This is a *`Named Export`*.
How you must import it: `import { connectDB } from "./db/index.js"` (Must Use Curly Braces `{}` and The Exact Name).

*Best Practice*: Since `src/db/index.js` only exports one main database connection function, sticking to `export default connectDB is` standard and keeps your import clean.

3️⃣ Decoding Import Paths and Curly Braces `{}`
Why `import bcrypt from "bcrypt"` has no path?
When you import an external package installed via npm, Node.js automatically looks inside your project's *node_modules* folder. You don't need `./` or paths because Node knows where to find installed packages by name.

> Note: 
`API versioning` is the practice of managing changes to an Application Programming Interface by releasing distinct versions (e.g., `/api/v1/` vs `/api/v2/`). This allows developers to introduce updates, modifications, or breaking changes without disrupting existing client applications that rely on older versions.

- *data integrity* (data remains accurate, consistent, and reliable by preventing duplicate entries and verifying that only valid information is saved to the database)

> Note: Register Controller
This process focuses on the logic required to onboard a new user into the application. 
1. *`Data Collection`*: Retrieve/Fetch/Get user details from the *request body* to obtain the information needed for account creation. 
2. *`Input Validation`*: Ensure all required fields are present and valid to prevent corrupt or incomplete data from reaching the database. This ensures only clean, complete data reaches your backend, preventing processing errors. 
3. *`Duplicate Check`*: Search the database to verify if the user already exists (by email or username) to maintain *data integrity* and prevent multiple accounts for the same identity. 
4. *`File Handling`*: If the registration includes profile images, use middleware (such as *Multer*) to temporarily save files locally on the server. This creates a stable, local file path required to stream and transfer the files to external cloud storage (like *Cloudinary*). 
5. *`Cloud Upload`*: Transfer image files to a cloud service like *Cloudinary* to obtain secure, accessible URLs for user profiles. After this, the local copies should be deleted to free up server space. 
To delete temporary files after they have been successfully uploaded to Cloudinary, you need to use the *Node.js fs (file system) module*. After the upload process completes, you can use the `fs.unlinkSync` method to remove the local file from your server. 
6. *`Database Entry`*: Create a new user object (record) using the collected input data and the cloud-hosted image URLs, then save it to the database to finalize the record for account registration. 
7. *`Sanitize Response`*: Once the user is successfully created, remove sensitive information like passwords and refresh tokens, before sending the response back to the client. This is a critical security practice to prevent data leakage. 
8. *`Error Handling`*: Wrap the process in centralized error handling (here *apiError*). Return clear error messages for failed steps or database issues to ensure the user/client receives clear and helpful feedback. 

> Note:
1. Optional Chaining `(?.)` and Array Access Approach:
If a client sends a request without a cover image (`req.files.coverImage` is *undefined*), standard dot notation like `req.files.coverImage[0].path` would instantly throw a fatal server crash: *TypeError: Cannot read properties of undefined (reading '0')*. The `?.` operator gracefully stops evaluation, returns *undefined* instead of crashing, and safely assigns it to `coverImageLocalPath`.
- *e.g.*: 
// retrieves the temporary local file path for the mandatory avatar upload from multer
const avatarLocalPath = req.files?.avatar?.[0]?.path

2. Regular Programming Approach:
It explicitly validates every layer of the nested object structure using an `if` condition and `Array.isArray()`. This is an older, bulletproof enterprise pattern commonly used when working with unpredictable third-party middleware payloads to guarantee zero runtime exceptions.
- *e.g.*:
// explicitly checks if req.files exists, ensures coverImage is an array, and confirms at least one file element exists before extracting its path
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
}

> Note:
A `payload` is the actual data transmitted within a network packet, API request, or file, separate from metadata and like protocol rules.
Separating core data (`payload`) from metadata and protocol rules ensures that routing, security, and delivery rules can be processed uniformly without needing to inspect or alter the underlying application data.
- In API Requests (e.g., POST/PUT): The data sent from the client to the server (e.g., JSON objects containing user registration fields like `username` and `password`).
- In JSON Web Tokens (JWT): The claims payload containing user data (`_id`, `email`, `username`) embedded inside the token.

> Some cybersecurity terms:
1. `Intercepted` means a hacker secretly catches or copies your data while it is traveling across the network.
2. `Compromised` means security is broken; an unauthorized person now possesses your token, no matter how they got it. 
3. `Cross-Site Scripting (XSS)` is a security flaw where attackers inject malicious code into trusted websites to steal user data or hijack active sessions.

> Access Tokens vs. Refresh Tokens
"We use a dual-token authentication strategy to balance security and user experience."
1. `Access Token`:
- What it is: A short-lived credential (e.g., 15 minutes) sent with every API request to authorize access to protected routes.
- Why it matters for security: If an access token is intercepted, the attacker's window of opportunity is extremely small before it expires.
2. `Refresh Token`:
- What it is: A long-lived credential securely stored in the database.
- Its purpose: It does not grant direct API access; its sole job is to allow the client to request a new access token when the old one expires, preventing the user from having to log in repeatedly.
- How? *Short-lived*, `access tokens` minimize the exposure window if a token is intercepted, while `httpOnly cookies` and `database validation` protect the *long-lived*, `refresh token` from attackers—giving us maximum security without forcing the user to constantly retype their password. 

> Note: Login Controller
This process focuses on validating credentials and issuing security tokens.
1. *`Data Collection & Validation`*: Extract the necessary credentials (email or username and password) from the request body (`req.body`). If these fields are missing, return a client-side error to prevent invalid attempts. 
2. *`User Retrieval`*: Search the database for the user using their email or username. Utilizing a database operator like `$or` allows for flexible login methods. If no user is found, return an error indicating the user does not exist.
3. *`Credential Verification`*: Compare the submitted password against the user's stored hashed password using a custom method (e.g., `isPasswordCorrect`). If the password is incorrect, terminate the process and return an unauthorized error.
4. *`Token Generation`*: Once the user is authenticated, use utility methods to generate both an Access Token (short-lived) and a Refresh Token (long-lived). These tokens facilitate secure API interactions. 
5. *`Database & Session Management`*: Save the newly generated Refresh Token directly into the user document in the database to track sessions. When updating, ensure `validateBeforeSave` is set to `false` to avoid unnecessary schema checks.
6. *`Secure Cookie Configuration`*: Send the tokens to the client as `HTTP-only`, secure cookies. This prevents client-side scripts from accessing them, significantly boosting security. 
7. *`Response Sanitization`*: Return a success response to the client. Ensure the user object sent back is clean, meaning it excludes sensitive data like the password and the refresh token to enhance security and privacy.

> Note: Logout Controller
This process ensures the user session is securely terminated by clearing database references and client-side cookies.
1. *`Authentication Middleware`*: Ensure the route is protected by an authentication middleware. This middleware verifies the user's access token and injects the user's details (such as the `_id`) into the `req.user` object, making it accessible for the logout process.
2. *`Database Session Cleanup`*: Access the user document using the `_id` obtained from the request. Update the user's record in the database by setting the `refreshToken` field to `null` or an empty string, effectively invalidating the session on the server side.
3. *`Cookie Configuration`*: Define the cookie options (matching the ones used during login) to target the specific cookies stored on the client. These include `httpOnly: true` and `secure: true` to ensure the server correctly identifies and clears the stored tokens.
4. *`Token Revocation`*: Execute the `clearCookie` method on the response object for both the `accessToken` and `refreshToken` keys. This instructs the client's browser to remove these cookies, preventing further use of the session.
5. *`Response Finalization`*: Return a success response to the client confirming that the user has been logged out successfully. This completes the request-response cycle and ensures no lingering session data remains accessible. 

> Note: `User` vs. `user`
- `User` (Uppercase): Refers to the Mongoose Model. 
Use it to talk directly to the database collection (e.g., `User.findOne`, `User.findById`).
- `user` (Lowercase): Refers to an individual document instance. 
Use it after you have found a specific user in the database and want to run methods on that specific user (e.g., `user.isPasswordValid`, `user.generateAccessToken`).


> Note: `{ new: true }` vs. `{ returnDocument: 'after' }`
Recent versions of Mongoose have deprecated the traditional `{ new: true }` option inside methods like `findOneAndUpdate()` and `findOneAndReplace()` in favor of the MongoDB driver's standard nomenclature: `returnDocument`.

Old Syntax (Deprecated) ➡️ { new: true }
New Modern Syntax ➡️ { returnDocument: 'after' }
Returns the document *after* the update is applied

Old Syntax (Deprecated) ➡️ { new: false }
New Modern Syntax ➡️ { returnDocument: 'before' }
Returns the original document *before* the update

> Subscription Schema Design Overview
Why using a separate database model for subscriptions is better than storing them in an array within a User model? 
- Why avoid arrays: Storing millions of subscriber IDs in one user document is inefficient. When a user has many subscribers, modifying that large list forces the database to do extra work, which slows things down.
- `The Subscription model`: The system uses a dedicated model with two fields: Subscriber and Channel. Every time someone subscribes, a new document is created. This keeps each record small and ensures the system works well as it grows.
- How data is found:
1. To count a channel's subscribers, the system searches the Channel field and counts every document where that channel appears.
2. To see which channels a user follows, the system searches the Subscriber field.
- Simplicity: By treating both subscribers and channels as references to User IDs, the structure remains flexible and easy to query.

