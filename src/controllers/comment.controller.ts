
import commentService from "../services/comment.service"
import { CommentDocument, IComment,IReaction } from "../models/comment.model";
import { UserInfo } from "os";
import express, { Request, Response} from "express";

class CommentController{

    public async create (req: Request, res: Response) {
        try {
            req.body.userId = req.params.id;
            const comment: CommentDocument = await commentService.createComment(req.body as IComment)
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json(error)
        }
    }

    public async update (req: Request, res: Response) {
        try {
            const comment1 =  await commentService.findById(req.body.id)
            if (req.params.id != comment1?.userId.toString()) {
                res.status(400).json({ message: `Not Your Comment`})
                return;
            }
            const comment: CommentDocument | null = await commentService.update(req.body.id, req.body as IComment);
            if (!comment) {
                res.status(404).json({error: "not found", message: `Comment with id ${req.params.id} not found`})
                return;
            }

            res.json(comment);
        } catch (error) {
            res.status(500).json(error)
        }
    }

    public async addReply(req: Request, res: Response) {
        try {
            req.body.userId = req.params.id;
            const updatedComment = await commentService.addReply(req.body.id, req.body as IComment);
    
            if (!updatedComment) {
                return res.status(404).json({ error: "Comment not found" });
            }
    
            res.status(201).json(updatedComment);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    
    
    public async getComment (req: Request, res: Response) {
        try {

            const comment: CommentDocument | null = await commentService.findById(req.body.id);
            if (!comment) {
                res.status(404).json({error: "not found", message: `Comment with id ${req.params.id} not found`})
                return;
            }
        
            res.json(comment);
        } catch (error) {
            res.status(500).json(error)
        }
    }
    
    public async getAll (req: Request, res: Response) {
        try {
            const comments: CommentDocument[] = await commentService.findAll()
            res.status(201).json(comments);
        } catch (error) {
            res.status(500).json(error)
        }
    }
    
    public async delete (req: Request, res: Response) {
        try {

            const comment =  await commentService.findById(req.body.id)
            if (req.params.id != comment?.userId.toString()) {
                res.status(400).json({ message: `Not Your Comment`})
                return;
            }
            const comments: CommentDocument | null = await commentService.delete(req.body.id)
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json(error)
        }
    }


    public async addReaction(req: Request, res: Response) {
        try {
            req.body.userId = req.params.id;
            const updatedReaction = await commentService.addReaction(req.body.id, req.body as IReaction);
    
            if (!updatedReaction) {
                return res.status(404).json({ error: "Comment not found" });
            }
    
            res.status(201).json(updatedReaction);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public async deleteReaction (req: Request, res: Response) {
        try {
            const reaction =  await commentService.findById(req.body.id_comment)
            console.log(req.body.id_comment)

            if (req.params.id != reaction?.userId.toString()) {
                res.status(400).json({ message: `Not Your Reaction`})
                return;
            }
            const reactions: CommentDocument | null = await commentService.deleteReaction(req.body.id_comment, req.body.id_reaction)
            res.status(200).json(reactions);
        } catch (error) {
            res.status(500).json(error)
        }
    }

}

export default new CommentController();