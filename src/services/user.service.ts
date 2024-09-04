// Import necessary modules and types
import { NotAuthorizedError, UserExistsError } from "../exceptions"
import { UserDocument, UserInput } from "../models/user.model";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

class UserService {

      // Create a new user
    public async create(userInput: UserInput): Promise<UserDocument> {
        try {
            // Check if the user already exists by email
            const userExist = await this.findByEmail(userInput.email)
            if (userExist)
                throw new UserExistsError("user already exist")
            userInput.password = await bcrypt.hash(userInput.password, 10);

            const user = await UserModel.create(userInput);
            return user;
        } catch (error) {
            throw error;
        }
        
    }

    // Retrieve all users from the database
    public async findAll(): Promise<UserDocument[]> {
        try {
            const users = await UserModel.find();
            return users;
        } catch (error) {
            throw error;
        }
    }

    
    // Find a user by their ID
    public async findById(_id: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findById(_id);
            return user;
        } catch (error) {
            throw error;
        }
    }
     // Update a user by their ID
    public async update(id: string, userInput: UserInput): Promise<UserDocument | null> {
        try {
            const user: UserDocument | null = await UserModel.findByIdAndUpdate(id, userInput, {returnOriginal:false});
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Delete a user by their ID
    public async delete(id: string): Promise<UserDocument | null> {
        try {
            const user: UserDocument | null = await UserModel.findByIdAndDelete(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Find a user by their email address 

    public async findByEmail(email: string): Promise<UserDocument | null> {
        try {
            const user: UserDocument | null = await UserModel.findOne({email});
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Authenticate a user and log them in

    public async login(userInput: any) {
        try {
            const userExist = await this.findByEmail(userInput.email)
            if (!userExist)
                throw new UserExistsError("This user doesnt exist")

            const isMatch: boolean = await bcrypt.compare(userInput.password, userExist.password);

            if (!isMatch)
                throw new NotAuthorizedError("Not authorized");

            const token = this.generateToken(userExist)
            return {email: userExist.email, name: userExist.name, token};

        } catch (error) {
            throw error;
        }
        
    }

     // Generate a JSON Web Token for the user
    private generateToken(user: UserDocument): string {
        try {
            return jwt.sign({user_id: user._id, email: user.email, name: user.name, role: user.role}, process.env.JWT_SECRET || "secret", {expiresIn: "50m"});
        } catch (error) {
            throw error;
        }

    }


}

export default new UserService();