import mongoose from "mongoose"

export interface UserInput{
    name: string;
    email: string;
    password: string;
    role: string; 
}
export interface UserDocument extends UserInput, mongoose.Document {
    createdAt: Date;
    updateAt: Date;
    deleteAt: Date;
}

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, index: true, unique: true },
    password: {type: String, required: true},
    role: {type: String, default: 'user', required: true, enum: ['superadmin', 'user']}  
}, {timestamps: true, collection: "users"});

const User = mongoose.model<UserDocument>("User", userSchema)

export default User;