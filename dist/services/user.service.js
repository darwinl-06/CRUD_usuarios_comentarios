// Import necessary modules and types
import UserExistsError from "../exceptions/UserExistsError.js";
import NotAuthorizedError from "../exceptions/NotAuthorized.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
class UserService {
    // Create a new user
    async create(userInput) {
        try {
            // Check if the user already exists by email
            const userExist = await this.findByEmail(userInput.email);
            if (userExist)
                throw new UserExistsError("user already exist");
            userInput.password = await bcrypt.hash(userInput.password, 10);
            const user = await UserModel.create(userInput);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    // Retrieve all users from the database
    async findAll() {
        try {
            const users = await UserModel.find();
            return users;
        }
        catch (error) {
            throw error;
        }
    }
    // Find a user by their ID
    async findById(_id) {
        try {
            const user = await UserModel.findById(_id);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    // Update a user by their ID
    async update(id, userInput) {
        try {
            const user = await UserModel.findByIdAndUpdate(id, userInput, { returnOriginal: false });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    // Delete a user by their ID
    async delete(id) {
        try {
            const user = await UserModel.findByIdAndDelete(id);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    // Find a user by their email address 
    async findByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    // Authenticate a user and log them in
    async login(userInput) {
        try {
            const userExist = await this.findByEmail(userInput.email);
            if (!userExist)
                throw new UserExistsError("This user doesnt exist");
            const isMatch = await bcrypt.compare(userInput.password, userExist.password);
            if (!isMatch)
                throw new NotAuthorizedError("Not authorized");
            const token = this.generateToken(userExist);
            return { email: userExist.email, name: userExist.name, token };
        }
        catch (error) {
            throw error;
        }
    }
    // Generate a JSON Web Token for the user
    generateToken(user) {
        try {
            return jwt.sign({ user_id: user._id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "50m" });
        }
        catch (error) {
            throw error;
        }
    }
}
export default new UserService();
