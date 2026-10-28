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

