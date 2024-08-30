import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString: string = process.env.MONGO_URL || "mongodb://localhost:27017/ClusterDemoTS" 

export const db = mongoose.connect(connectionString).then(
                                () => console.log("connected to mongoDB")
                            ).catch(
                                (err) => console.log(err)
                            )