// Middleware function to validate request body against a Zod schema
const validateSchema = (schema) => {
    // Return an async middleware function that handles the request, response, and next callback
    return async (req, res, next) => {
        try {
            // Validate the request body asynchronously using the provided Zod schema
            await schema.parseAsync(req.body);
            // If validation succeeds, call the next middleware in the stack
            next();
        }
        catch (error) {
            // If validation fails, respond with a 400 status code and the validation error details
            res.status(400).json(error);
        }
    };
};
export default validateSchema;
