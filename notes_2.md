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

