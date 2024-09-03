// Import necessary modules
import exp from "constants"; // This import seems unused and can be removed
import express, { Express, Request, Response } from "express"; // Import Express framework and types

// Import the router and database configuration
import { router } from "./routes/users.router"; // Import the router for user-related routes
import { db } from "./config/db"; // Import the database connection

// Initialize the Express application
const app: Express = express(); // Create an instance of an Express application

// Define the port to listen on, defaulting to 8000 if not specified in environment variables
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Mount the user router at the /api/users endpoint
app.use('/api/users', router);

// Define a route for the root URL ("/") that responds with "Hola mundo"
app.get("/", (req: Request, res: Response) => {
  res.send("Hola mundo");
});

// Connect to the database and start the server once the connection is successful
db.then(() => 
  app.listen(PORT, () => {
    // Log the server URL when the server starts listening
    console.log(`Server running on http://localhost:${PORT}`);
  })
);