/**
 * Middleware for role-based authorization.
 *
 * This middleware checks if the user has one of the allowed roles
 * before granting access to a protected route.
 *
 * returns A middleware function that verifies the user's role.
 */
const authRole = (roles) => {
    return (req, res, next) => {
        const loggedUser = req.body.loggedUser;
        // Check if the logged-in user exists and if their role is included
        if (!loggedUser || !roles.includes(loggedUser.role)) {
            return res.status(403).json({ message: "Access Denied: You do not have the right role." });
        }
        // If the role is valid, proceed to the next middleware or route handler.
        next();
    };
};
export default authRole;
