// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose"

// Define an interface for the input data required to create or update a user
export interface UserInput{
    name: string;
    email: string;
    password: string;
    role: string; 

}
// Define an interface that extends UserInput with additional mongoose document properties
export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updateAt: Date;
    deleteAt: Date;
}

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, index: true, unique: true },
    password: {type: String, required: true},
    role: {type: String, default: 'user', required: true, enum: ['superadmin', 'user']}  
}, {timestamps: true, collection: "users"});

// Create and export the User model based on the defined schema
const User = mongoose.model<UserDocument>("User", userSchema)

export default User;