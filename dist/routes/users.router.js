import express from "express";
import userController from "../controllers/user.controller.js";
import commentController from "../controllers/comment.controller.js";
import validateSchema from "../middlewares/validateSchema.js";
import userSchema from "../schemas/user.schemas.js";
import auth from "../middlewares/auth.js";
import authRole from "../middlewares/authRole.js";
export const router = express.Router();
router.post("/", validateSchema(userSchema), auth, authRole(['superadmin']), userController.create); // Create user
router.post("/login", userController.login); // Login user
router.post("/comments", auth, commentController.create); // Create comment
router.get("/", auth, userController.getAll); // Get all users
router.get("/comments", auth, commentController.getAll); // Get all comments
router.put("/comments", auth, commentController.update); // Update comments
router.delete("/comments", auth, commentController.delete); // Delete comments
router.get("/profile", auth, userController.getUser); // Confirm User
router.get("/:id", auth, userController.getUser); // Get user
router.get("/:id/group/:groupId", (req, res) => {
    res.send(`get user with id ${req.params.id} y group ID: ${req.params.groupId}`);
}); // Get user and group id
router.put("/:id", auth, authRole(['superadmin']), userController.update); // Update user
router.delete("/:id", auth, authRole(['superadmin']), userController.delete); // Delete User
router.post("/comments/:commentId/replies/:replyId", auth, commentController.addReplyToReply); // Add reply to reply
router.post("/comments/:commentId/replies/", auth, commentController.addReplyToOne); // Add reply to comment
router.delete("/comments/:commentId/replies/:replyId", auth, commentController.deleteReply); // Delete reply
router.put('/comments/:commentId/replies/:replyId', auth, commentController.editReply); // Edit reply
router.post("/comments/:commentId/reaction", auth, commentController.addReactionToComment); // Add reaction to comment
router.post("/comments/:commentId/reaction/:replyId", auth, commentController.addReactionToReply); // Add reaction to reply
router.delete('/comments/:commentId/reaction/:reactionId/:replyId?', auth, commentController.removeReaction); // Remove Reaction
router.put('/comments/:commentId/reaction/:reactionId/:replyId?', auth, commentController.editReaction); //Edit Reaction
