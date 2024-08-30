import { NotAuthorizedError, UserExistsError } from "../exceptions"
import { UserDocument, UserInput } from "../models/user.model";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

class UserService {

    public async create(userInput: UserInput): Promise<UserDocument> {
        try {
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

    public async findAll(): Promise<UserDocument[]> {
        try {
            const users = await UserModel.find();
            return users;
        } catch (error) {
            throw error;
        }
    }

    public async findById(_id: string): Promise<UserDocument | null> {
        try {
            const user = await UserModel.findById(_id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async update(id: string, userInput: UserInput): Promise<UserDocument | null> {
        try {
            const user: UserDocument | null = await UserModel.findByIdAndUpdate(id,userInput, {returnOriginal:false});
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<UserDocument | null> {
        try {
            const user: UserDocument | null = await UserModel.findByIdAndDelete(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async findByEmail(email: string): Promise<UserDocument | null> {
        try {
            const user: UserDocument | null = await UserModel.findOne({email});
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async login(userInput: any) {
        try {
            const userExist = await this.findByEmail(userInput.email)
            if (!userExist)
                throw new UserExistsError("Not authorized")

            const isMatch: boolean = await bcrypt.compare(userInput.password, userExist.password);

            if (!isMatch)
                throw new NotAuthorizedError("Not authorized");

            const token = this.generateToken(userExist)
            return {email: userExist.email, name: userExist.name, token};

        } catch (error) {
            throw error;
        }
        
    }

    private generateToken(user: UserDocument): string {
        try {
            return jwt.sign({user_id: user._id, email: user.email, name: user.name}, process.env.JWT_SECRET || "secret", {expiresIn: "5m"});
        } catch (error) {
            throw error;
        }

    }


}

export default new UserService();