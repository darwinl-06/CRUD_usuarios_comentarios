import exp from "constants";
import express, { Express, Request, Response } from "express";

import { router } from "./routes/users.router";
import {db} from "./config/db"

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', router)

app.get("/", (req: Request, res: Response) => {
  res.send("Hola mundo");
});

db.then(() => 
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  })

)