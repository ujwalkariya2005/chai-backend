// exports the application db name for consistent reuse across the project
export const DB_NAME = "videotube"

/*
Note: The `constants.js` file is a centralized storage place for
fixed variables that your application uses across multiple files.

Significance:
1. Prevents Typos: If you need to reference your MongoDB database name
(e.g., "videotube") across 10 different files, typing it manually risks typos. 
Storing it in constants.js means you reference DB_NAME instead.

2. Easy Maintenance: If a constant value ever needs to change
(like changing a database name or a default pagination limit),
you only change it in one place (constants.js) instead of hunting 
through your entire codebase.
*/
