// Import necessary modules
import express from "express"; // Import Express framework and types
// Import the router and database configuration
import { router } from "./routes/users.router.js"; // Import the router for user-related routes
import { db } from "./config/db.js"; // Import the database connection
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { readFile } from 'node:fs/promises';
import { resolvers } from './graphql/resolvers.js';
import jwt from "jsonwebtoken";
import cors from 'cors';
// Initialize the Express application
const app = express(); // Create an instance of an Express application
// Define the port to listen on, defaulting to 8000 if not specified in environment variables
const PORT = process.env.PORT || 8000;
// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
// Mount the user router at the /api/users endpoint
app.use('/api/users', router);
app.use(cors());
const typeDefs = await readFile('./src/graphql/schema.graphql', 'utf8');
async function getContext({ req }) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    const operationName = req.body.operationName;
    if (operationName === "Login") {
        return {};
    }
    if (!token) {
        throw new Error("Unauthorized");
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret");
        return { user: decodedToken };
    }
    catch (error) {
        throw new Error("Unauthorized or Token expired");
    }
}
const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }));
// Define a route for the root URL ("/") that responds with "Hola mundo"
app.get("/", (req, res) => {
    res.send("Hola mundo");
});
// Connect to the database and start the server once the connection is successful
db.then(() => app.listen(PORT, () => {
    // Log the server URL when the server starts listening
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Graphql running on http://localhost:${PORT}/graphql`);
}));
