we used `"type": "module"` in `package.json file` in order to maintain consistency while importing libraries

> dependency vs. dev dependency:
`dependency`:
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
What is a `Database`?
- Simple Analogy: Think of a database like a massive, highly organized filing cabinet or a digital warehouse. Instead of keeping your important files scattered all over your desk (or losing them when your app restarts), you store them neatly in labeled drawers so you can find, update, or delete them instantly.
- Simple Definition: A `database` is an organized electronic system that allows applications to securely store, retrieve, and manage persistent data (data stored on a permanent storage like hard drive) so information is never lost when the app restarts.

What is `MongoDB`?
- Simple Analogy: Think of `MongoDB` like a filing cabinet full of flexible folders (documents) instead of rigid, old-fashioned spreadsheet tables with strict rows and columns. If one note needs a title and description, and another note needs a title, description, and a color tag, MongoDB accepts them without complaining.
Simply, it easily adapts to store whatever custom data fields your app throws at it.
- Simple Definition: `MongoDB` is a popular `NoSQL` (`Not Only SQL`) database that stores data in flexible, JSON-like documents (called *BSON*) rather than traditional tables and rows.

Key Points to Remember:
1. Persistence: Unlike your in-memory array (`const notes = []`), which wipes clean every time your server restarts, a database saves data permanently on your disk.
2. NoSQL Flexibility: MongoDB doesn't force you to follow a rigid table structure, making it very fast and easy to change data fields as your app grows.

What is a `Cluster`?
- Simple Analogy: Think of a single-lane checkout counter at a grocery store vs. multiple cashiers working at different counters behind the exact same entrance door. Instead of one cashier getting overwhelmed by a long line of customers, multiple cashiers handle people in parallel.
- Simple Definition: A `cluster` is a group of multiple running instances of your Node.js server (called *workers*) that all share a single server port to handle incoming traffic together.

> Note: `Instance`
- Simple Analogy: Think of a popular restaurant that gets too busy for just one front door. Instead of opening a new location across town, they open three identical copies of the restaurant right next to each other, sharing the exact same street address and front door. Each copy is an `instance`.
- Simple Definition: An `instance` is an independent, running copy of your Node.js application running in computer memory.

In the Context of *Clustering*:
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
4. `/`: The specific database name at the end (currently empty, meaning it connects to the default root). (we won't use it though since it can cause problems in the future, for more info check *.env folder*)

> Practices for Database Connection
- The Database is Remote (Use `async/await`)
Explanation: "Our database usually lives on a remote cloud server in another location, so connecting to it takes time. Because it doesn't happen instantly, we use `async/await` to wait for the connection safely without blocking our app."
- Things Can Go Wrong (Use `try...catch` or `Promises`)
Explanation: "Network issues, bad passwords, or server drops can cause failures. We always wrap our connection code in a `try...catch` block to handle errors gracefully and prevent our app from crashing."

Meaning of Key Terms:
1. `async` (Asynchronous): Tells JS that a function will handle tasks that take time (like talking to a database) so it doesn't freeze/block the rest of the app. 
2. `await`: Pauses the execution inside an *async function* until the slow task (like a database response) finishes.
3. `try`: A block of code where you *attempt* to run risky operations (like connecting to a remote database).
4. `catch`: A backup block that catches the error immediately if something goes wrong inside the `try` block, preventing a server crash.
5. `resolve`: A promise method used to say: *"The task was successful, here is the data."*
6. `reject`: A promise method used to say: *"The task failed, here is the error."*

`an IIFE (Immediately Invoked Function Expression)`:
It is a function that runs the exact moment it is defined, without needing to be called manually. In backend development, it is often used to connect to the database as soon as the application starts.

Key Things to Remember about `IIFEs`:
1. Semicolon `;` at the start: Prevents JavaScript parsing errors (Automatic Semicolon Insertion bugs) if the previous line lacks a semicolon.
2. Execution parentheses `()` at the end: Immediately invokes/triggers the function upon definition.

