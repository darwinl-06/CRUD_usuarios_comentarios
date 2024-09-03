"use strict"; // Enforces strict mode, which catches common coding errors and prevents certain actions.

// Helper function to manage module imports, ensuring compatibility with CommonJS modules.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

// Defines the module as an ECMAScript module.
Object.defineProperty(exports, "__esModule", { value: true });

// Importing the Express framework for building web applications.
const express_1 = __importDefault(require("express"));

// Initializing the Express application.
const app = (0, express_1.default)();

// Defining the port number for the server to listen on.
const PORT = 8000;

// Middleware to parse incoming JSON requests.
app.use(express_1.default.json());

// Middleware to parse URL-encoded data with the option to handle nested objects.
app.use(express_1.default.urlencoded({ extended: true }));

// Setting up a route to respond with 'Hello World' on the root URL.
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Starting the server and logging the URL where it's running.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
