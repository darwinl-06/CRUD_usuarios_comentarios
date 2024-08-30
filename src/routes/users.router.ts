import express, { Request, Response } from "express";
import userController from "../controllers/user.controller"
import validateSchema from "../middlewares/validateSchema";
import userSchema from "../schemas/user.schemas";
import auth from "../middlewares/auth";

export const router = express.Router();

router.post("/", validateSchema(userSchema), userController.create);

router.post("/login", userController.login);

router.get("/", userController.getAll)

router.get("/:id/group/:groupId", (req: Request, res: Response) => {
    res.send(`get user with id ${req.params.id} y group ID: ${req.params.groupId}`);
})

router.get("/profile", auth, userController.getUser)

router.get("/:id", userController.getUser)

router.put("/:id", userController.update)

router.delete("/:id", userController.delete)
