
import commentService from "../services/comment.service"
import { CommentDocument, IComment, IReaction, IReply } from "../models/comment.model";
import { UserInfo } from "os";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

class CommentController {


    /**
     * Creates a new comment associated with the user specified in the request params.
     * Responds with the created comment object or an error if the operation fails.
     */
    public async create(req: Request, res: Response) {
        try {
            req.body.userId = req.params.id;
            const comment: CommentDocument = await commentService.createComment(req.body as IComment)
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json(error)
        }
    }


    /**
     * Updates an existing comment if the comment belongs to the user making the request.
     * Responds with the updated comment object or an error if the operation fails.
     */
    public async update(req: Request, res: Response) {
        try {
            const comment1 = await commentService.findById(req.body.id)
            if (req.params.id != comment1?.userId.toString()) {
                res.status(400).json({ message: `Not Your Comment` })
                return;
            }
            const comment: CommentDocument | null = await commentService.update(req.body.id, req.body as IComment);
            if (!comment) {
                res.status(404).json({ error: "not found", message: `Comment with id ${req.params.id} not found` })
                return;
            }

            res.json(comment);
        } catch (error) {
            res.status(500).json(error)
        }
    }



     /**
     * Retrieves a specific comment by its ID.
     * Responds with the comment object or an error if the comment is not found or the operation fails.
     */
    public async getComment(req: Request, res: Response) {
        try {

            const comment: CommentDocument | null = await commentService.findById(req.body.id);
            if (!comment) {
                res.status(404).json({ error: "not found", message: `Comment with id ${req.params.id} not found` })
                return;
            }

            res.json(comment);
        } catch (error) {
            res.status(500).json(error)
        }
    }


     /**
     * Retrieves all comments.
     * Responds with an array of comments or an error if the operation fails.
     */
    public async getAll(req: Request, res: Response) {
        try {
            const comments: CommentDocument[] = await commentService.findAll()
            res.status(201).json(comments);
        } catch (error) {
            res.status(500).json(error)
        }
    }


    /**
     * Deletes a specific comment if it belongs to the user making the request.
     * Responds with the deleted comment object or an error if the operation fails.
     */
    public async delete(req: Request, res: Response) {
        try {
            const comment = await commentService.findById(req.body.id)
            if (req.params.id != comment?.userId.toString()) {
                res.status(400).json({ message: `Not Your Comment` })
                return;
            }
            const comments: CommentDocument | null = await commentService.delete(req.body.id)
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json(error)
        }
    }


     /**
     * Adds a reply to an existing reply in a comment thread.
     * Responds with the updated reply object or an error if the operation fails.
     */
    async addReplyToReply(req: Request, res: Response) {
        try {
            const reply = await commentService.addNestedReply(req.params.commentId, req.params.replyId, req.body, req.params.id);

            return res.status(201).json(reply);
        } catch (error) {
            return res.status(500).json(error);
        }
    }


    /**
     * Adds a reply to a specific comment.
     * Responds with the updated comment object containing the reply or an error if the operation fails.
     */
    public async addReplyToOne(req: Request, res: Response) {
        try {
            req.body.userId = req.params.id;
            console.log(req);
            const updatedComment = await commentService.addReplyToOne(req.params.commentId, req.body as IComment, req.params.id);
            if (!updatedComment) {
                return res.status(404).json({ error: "Comment not found" });
            }
            res.status(201).json(updatedComment);
        } catch (error) {
            res.status(500).json(error);
        }
    }


     /**
     * Edits a specific reply in a comment thread.
     * Responds with the updated reply object or an error if the operation fails.
     */
    public async editReply(req: Request, res: Response) {
        try {

            const result = await commentService.updateReply(req.params, req.body);
            
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(500).json({ success: false, message: error });
        }
    }
    


    /**
     * Deletes a specific reply from a comment thread.
     * Responds with the updated comment object or an error if the operation fails.
     */
    public async deleteReply(req: Request, res: Response) {
        try {
            const comment = await commentService.findById(req.params.commentId)
            if (req.params.id != comment?.userId.toString()) {
                res.status(400).json({ message: `Not Your Comment` })
                return;
            }
            const { commentId, replyId } = req.params;
            const updatedComment = await commentService.deleteReply({ commentId, replyId });
            return res.status(200).json({
                message: "Reply deleted successfully",
                data: updatedComment
            });
        } catch (error) {
            res.status(500).json(error);
        };
    }



      /**
     * Adds a reaction to a specific comment.
     * Responds with the updated comment object containing the reaction or an error if the operation fails.
     */
    async addReactionToComment(req: Request, res: Response) {
        try {
            const reaction = req.body;

            // Llamar al servicio para agregar la reacción
            const result = await commentService.addReactionToComment(req.params.commentId, reaction, req.params.id);

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    /**
     * Adds a reaction to a specific reply within a comment thread.
     * Responds with the updated reply object containing the reaction or an error if the operation fails.
     */
    async addReactionToReply(req: Request, res: Response) {
        try {
            const { replyId } = req.params;
            const reaction = {
                _id: new mongoose.Types.ObjectId(),
                content: req.body.content,
                userId: req.params.id
            };

            const result = await commentService.addReactionToReply(req.params.commentId, req.params.replyId, reaction, req.params.id);

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }
    }


     /**
     * Removes a reaction from a comment or reply, if the reaction belongs to the user making the request.
     * Responds with the updated comment or reply object or an error if the operation fails.
     */
    public async removeReaction(req: Request, res: Response){
        try {
            const comment = await commentService.findById(req.params.commentId)
            if (req.params.id != comment?.userId.toString()) {
                res.status(400).json({ message: `Not Your Comment` })
                return;
            }
            const { commentId, replyId, reactionId } = req.params;
            const result = await commentService.deleteReaction({ commentId, replyId, reactionId });

            return res.status(200).json({ success: true, data: result });

        } catch (error) {

            return res.status(500).json({ success: false, error });
        }
    }


    /**
     * Edits a reaction in a comment or reply.
     * Responds with the updated reaction object or an error if the operation fails.
     */
    public async editReaction(req: Request, res: Response): Promise<Response> {
        try {
            const { commentId, replyId, reactionId } = req.params;
            const { content } = req.body; // Se espera que el contenido actualizado esté en el cuerpo de la solicitud
    
            const result = await commentService.updateReaction({ commentId, replyId, reactionId }, content);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(500).json({ success: false, error });
        }
    }
    

    
}


export default new CommentController();