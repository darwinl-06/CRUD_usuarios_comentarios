import {object, string} from "zod";

// Define a schema for user input using zod
const userSchema = object ({
    name: string({required_error: "Name is required"}),
    email: string({required_error: "Email is required"})
            .email("Not a valid email address"),
    password: string({required_error: "Password is required"})
            .min(8, "Password must be at least 8 characters long")


})

// Export the schema for use in other parts of the application
export default userSchema;