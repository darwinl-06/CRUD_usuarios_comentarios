import { Request, Response, NextFunction } from "express";

const authRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const loggedUser = req.body.loggedUser;

        if (!loggedUser || !roles.includes(loggedUser.role)) {
            return res.status(403).json({ message: "Access Denied: You do not have the right role." });
        }

        next();
    };
};

export default authRole;
