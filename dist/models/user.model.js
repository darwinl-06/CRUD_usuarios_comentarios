// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose";
// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', required: true, enum: ['superadmin', 'user'] }
}, { timestamps: true, collection: "users" });
// Create and export the User model based on the defined schema
const User = mongoose.model("User", userSchema);
export default User;
