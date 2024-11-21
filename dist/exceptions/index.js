// Exporting custom error classes from their respective files.
// These errors can be used throughout the application for consistent error handling.
export { default as UserExistsError } from "./UserExistsError"; // Error thrown when attempting to create a user that already exists.
export { default as NotAuthorizedError } from "./NotAuthorized"; // Error thrown when a user is not authorized to perform an action.
