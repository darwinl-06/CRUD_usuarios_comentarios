import express, { Request, Response} from "express";
import { UserDocument, UserInput } from "../models/user.model.js";
import { UserInfo } from "os";
import userService from "../services/user.service.js";
import UserExistsError from "../exceptions/UserExistsError.js";
import NotAuthorizedError from "../exceptions/NotAuthorized.js";

class UserController {
    

    /**
     * Creates a new user.
     * Responds with the created user object or an error if the user already exists or the operation fails.
     */
    public async create (req: Request, res: Response) {
        try {
            const user: UserDocument = await userService.create(req.body as UserInput)

            res.status(201).json(user);
        } catch (error) {
            if (error instanceof UserExistsError) {
                res.status(404).json({ message: `User already exists`})
                return;
            }
            res.status(500).json(error)
        }
    }
    

    /**
     * Updates an existing user by ID.
     * Responds with the updated user object or an error if the user is not found or the operation fails.
     */
    public async update (req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.update(req.params.id, req.body as UserInput);
            if (!user) {
                res.status(404).json({error: "not found", message: `User with id ${req.params.id} not found`})
                return;
            }

            res.json(user);
        } catch (error) {
            res.status(500).json(error)
        }
    }
    

    /**
     * Retrieves a user by ID.
     * Responds with the user object or an error if the user is not found or the operation fails.
     */
    public async getUser (req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.findById(req.params.id);
            if (!user) {
                res.status(404).json({error: "not found", message: `User with id ${req.params.id} not found`})
                return;
            }
        
            res.json(user);
        } catch (error) {
            res.status(500).json(error)
        }
    }
    

    /**
     * Retrieves all users.
     * Responds with an array of user objects or an error if the operation fails.
     */
    public async getAll (req: Request, res: Response) {
        try {
            const users: UserDocument[] = await userService.findAll()
            res.status(201).json(users);
        } catch (error) {
            res.status(500).json(error)
        }
    
    }
    
 /**
     * Deletes a user by ID.
     * Responds with the deleted user object or an error if the operation fails.
     */
    public async delete (req: Request, res: Response) {
        try {
            const users: UserDocument | null = await userService.delete(req.params.id)
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error)
        }
    }


    /**
     * Logs in a user with provided credentials.
     * Responds with the user object or an error if the credentials are invalid or the operation fails.
     */
    public async login (req: Request, res: Response) {
        try {
            const userObj = await userService.login(req.body);
            res.status(200).json(userObj);
        } catch (error) {
            if (error instanceof NotAuthorizedError) {
                res.status(400).json({ message: `Not Authorized`})
                return;
            }
            res.status(500).json(error)
        }
    }

}

export default new UserController();