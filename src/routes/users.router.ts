import express, { Request, Response } from "express";
import userController from "../controllers/user.controller";
import commentController from "../controllers/comment.controller";
import validateSchema from "../middlewares/validateSchema";
import userSchema from "../schemas/user.schemas";
import auth from "../middlewares/auth";
import authRole from "../middlewares/authRole";

export const router = express.Router();

router.post("/", validateSchema(userSchema),authRole(['superadmin']), userController.create);

router.post("/login", userController.login);

router.post("/comments", auth, commentController.create);

router.get("/", userController.getAll);

router.get("/comments", auth, commentController.getAll);

router.put("/comments", auth, commentController.update);

router.delete("/comments", auth, commentController.delete);

router.get("/profile", auth, userController.getUser);

router.get("/:id", userController.getUser);

router.get("/:id/group/:groupId", (req: Request, res: Response) => {
    res.send(`get user with id ${req.params.id} y group ID: ${req.params.groupId}`);
});

router.put("/:id", auth, authRole(['superadmin']), userController.update);

router.delete("/:id", auth, authRole(['superadmin']), userController.delete);

router.post("/comments/:commentId/replies/:replyId", auth, commentController.addReplyToReply);

router.post("/comments/:commentId/replies/", auth, commentController.addReplyToOne);

router.delete("/comments/:commentId/replies/:replyId", commentController.deleteReply);

router.put('/comments/:commentId/replies/:replyId', commentController.editReply);

router.post("/comments/:commentId/reaction", auth, commentController.addReactionToComment);

router.post("/comments/:commentId/reaction/:replyId", auth, commentController.addReactionToReply);

router.delete('/comments/:commentId/reaction/:reactionId/:replyId?', commentController.removeReaction);

router.put('/comments/:commentId/reaction/:reactionId/:replyId?', commentController.editReaction);

