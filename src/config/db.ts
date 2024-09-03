import mongoose from "mongoose"; // Importing Mongoose for MongoDB object modeling.
import dotenv from "dotenv"; // Importing dotenv to load environment variables from a .env file.

dotenv.config(); // Loading environment variables from the .env file into process.env.

const connectionString: string = process.env.MONGO_URL || "mongodb://localhost:27017/ClusterDemoTS"; 
// Defining the MongoDB connection string. Uses an environment variable if available; otherwise, defaults to a local MongoDB instance.

export const db = mongoose.connect(connectionString)
    .then(() => console.log("connected to mongoDB")) // Logging successful connection to MongoDB.
    .catch((err) => console.log(err)); // Logging any errors that occur during connection.
