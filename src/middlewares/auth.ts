import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken"


/**
 * Middleware to authenticate requests using JWT tokens.
 * Extracts the token from the Authorization header, verifies it, and attaches the decoded user info to the request.
 * If the token is missing, expired, or invalid, responds with a 401 Unauthorized status.
 */
const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined = req.headers.authorization;

        if (!token) {
            res.status(401).json({message: "Not Authorized"});
        } else {
            token = token.replace("Bearer ", "") // Remove 'Bearer ' prefix from the token
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret")// Verify the token with a secret key


             // Attach decoded user information to the request object for further use in the request lifecycle
            req.body.loggedUser = decoded;
            req.params.id = decoded.user_id;
            req.params.role = decoded.role;

            next();// Proceed to the next middleware or route handler
        }

        
    } catch (error) {
        if (error instanceof TokenExpiredError)
            res.status(401).json({message: "Token Expired", error})
        else
            res.status(401).json({message: "Token Invalid", error})

    }
}

export default auth;