import mongoose from "mongoose";
import { CommentDocument, IComment, IReaction, IReply } from "../models/comment.model";
import CommentModel from "../models/comment.model";
import { Console } from "console";

class CommentService {

    public async createComment(commentInput: IComment): Promise<CommentDocument> {
        try {
            const comment = await CommentModel.create(commentInput);
            return comment;
        } catch (error) {
            throw error;
        }
    }

    public async findAll(): Promise<CommentDocument[]> {
        try {
            const comments = await CommentModel.find();
            return comments;
        } catch (error) {
            throw error;
        }
    }

    public async findById(_id: string): Promise<CommentDocument | null> {
        try {
            const comment = await CommentModel.findById(_id);
            return comment;
        } catch (error) {
            throw error;
        }
    }

    public async update(id: string, commentInput: IComment): Promise<CommentDocument | null> {
        try {
            const comment: CommentDocument | null = await CommentModel.findByIdAndUpdate(id, commentInput, { returnOriginal: false });
            return comment;
        } catch (error) {
            throw error;
        }
    }

    public async delete(id: string): Promise<CommentDocument | null> {
        try {
            const comment: CommentDocument | null = await CommentModel.findByIdAndDelete(id);
            return comment;
        } catch (error) {
            throw error;
        }
    }
                                                                                                                                                                                 
    public async addReplyToOne(commentId: string, replyInput: IComment, idUser: string): Promise<CommentDocument | null> {
        try {
            const updatedComment = await CommentModel.findByIdAndUpdate(commentId, {
                $push: {
                    replies: {
                        content: replyInput.content,
                        _id: new mongoose.Types.ObjectId()._id,
                        userId: new mongoose.Types.ObjectId(idUser),
                        replies: [],
                        reactions: []
                    }
                }
            }, { new: true });
            return updatedComment;
        } catch (error) {
            throw error;
        }
    }


    private deleteReplyToComment(comments: CommentDocument[], replyId: string): boolean {
        for (let comment of comments) {
            if (comment.id.toString() === replyId) {
                const index = comments.indexOf(comment);
                if (index > -1) {
                    comments.splice(index, 1);
                    return true;
                }
            }
            if (comment.replies && comment.replies.length > 0) {
                const deleted = this.deleteReplyToComment(comment.replies as CommentDocument[], replyId);
                if (deleted) {
                    return true;
                }
            }
        }
        return false;
    }

    private async updateReplyInComments(comments: CommentDocument[], replyId: string, updatedReply: any): Promise<boolean> {
        for (let comment of comments) {
            // Verificar si el ID del comentario coincide con el ID de respuesta
            if (comment.replies) {
                for (let reply of comment.replies) {
                    if (reply._id.equals(replyId)) {
                        // Actualizar el contenido de la respuesta
                        reply.content = updatedReply.content;
                        return true;
                    }
                }
            }
    
            // Buscar recursivamente en las respuestas anidadas
            if (comment.replies && comment.replies.length > 0) {
                const updated = await this.updateReplyInComments(comment.replies as CommentDocument[], replyId, updatedReply);
                if (updated) {
                    return true;
                }
            }
        }
        return false;
    }
    
    public async updateReply(params: any, body: any): Promise<CommentDocument | null> {
        const comment = await CommentModel.findById(params.commentId);
    
        if (!comment) throw new Error('Comment not found');
    
        const updated = await this.updateReplyInComments(comment.replies as CommentDocument[], params.replyId, { content: body.content });
    
        if (!updated) throw new Error('Failed to update reply');
    
        await comment.save();
        return comment;
    }

    public async deleteReply(params: any): Promise<CommentDocument | null> {
        const comment = await CommentModel.findById(params.commentId);
        if (!comment) throw new Error('Comment not found');
    
        if (!comment.replies) {
            comment.replies = [];
        }
    
        const deleted = this.deleteReplyToComment(comment.replies as CommentDocument[], params.replyId);
    
        if (!deleted) throw new Error('Failed to delete reply');
    
        await comment.save();
        return comment;
    }

    public async addNestedReply(commentId: string, replyId: string, replyInput: IReply, idUser: string): Promise<CommentDocument | null> {
        try {
            const comment = await CommentModel.findById(commentId);
            if (!comment) throw new Error('Comment not found');
        
            const nestedReply: IReply = {
                _id: new mongoose.Types.ObjectId(),
                content: replyInput.content,
                userId: new mongoose.Types.ObjectId(idUser),
                replies: [],
                reactions: []
            };
        
            const added = this.addNestedReplyToComment(comment.replies as CommentDocument[], replyId, nestedReply);
        
            if (!added) throw new Error('Failed to add nested reply');
        
            comment.markModified('replies');

            await comment.save();
        
            return comment;
        } catch (error) {
            console.error('Error adding nested reply:', error);
            throw error;
        }
    }
    

    private addNestedReplyToComment(comments: CommentDocument[], replyId: string, nestedReply: IReply): boolean {
        for (let comment of comments) {
            if ((comment._id as string).toString() === replyId) {
                if (!comment.replies) {
                    comment.replies = [];
                }
                comment.replies.push(nestedReply);
                return true;
            }

            if (comment.replies && comment.replies.length > 0) {
                const added = this.addNestedReplyToComment(comment.replies as CommentDocument[], replyId, nestedReply);
                if (added) {
                    return true;
                }
            }
        }
        return false;
    }
    
    
    async addReactionToComment(commentId: string, reaction: any, idUser: string): Promise<any> {
        try {
            const commentIdParsed = new mongoose.Types.ObjectId(commentId);

            const result = await CommentModel.findOneAndUpdate(
                { _id: commentIdParsed },
                { $push: { reactions: {
                    _id: new mongoose.Types.ObjectId(),
                    content: reaction.content,
                    userId: new mongoose.Types.ObjectId(idUser)
                } } },
                { new: true }
            );

            if (result) {
                return { success: true, data: result };
            } else {
                return { success: false, message: 'Comment not found' };
            }
        } catch (error) {
            throw new Error;
        }
    }

    public async addReactionToReply(commentId: string, replyId: string, reaction: any): Promise<CommentDocument | null> {
        const comment = await CommentModel.findById(commentId);

        if (!comment) throw new Error('Comment not found');

        const added = this.addReactionToReplyRecursive(comment.replies as CommentDocument[], replyId, reaction);

        if (!added) throw new Error('Failed to add reaction to reply');

        comment.markModified('replies');
        await comment.save();
        return comment;
    }

    private addReactionToReplyRecursive(replies: any[], replyId: string, reaction: any): boolean {
        for (let reply of replies) {
            if (reply._id.toString() === replyId) {
                if (!reply.reactions) {
                    reply.reactions = [];
                }
                reply.reactions.push(reaction);
                return true;
            }

            if (reply.replies && reply.replies.length > 0) {
                const added = this.addReactionToReplyRecursive(reply.replies, replyId, reaction);
                if (added) {
                    return true;
                }
            }
        }
        return false;
    }
 
    private deleteReactionRecursive(replies: any[], replyId: string, reactionId: string): boolean {
        for (let reply of replies) {
            if (reply._id.toString() === replyId) {
                const reactionIndex = reply.reactions.findIndex((reaction: any) => reaction._id.toString() === reactionId);
                if (reactionIndex > -1) {
                    reply.reactions.splice(reactionIndex, 1);
                    return true;
                }
            }
            
            if (reply.replies && reply.replies.length > 0) {
                const deleted = this.deleteReactionRecursive(reply.replies, replyId, reactionId);
                if (deleted) {
                    return true;
                }
            }
        }
        return false;
    }
    
    public async deleteReaction(params: any): Promise<CommentDocument | null> {
        const { commentId, replyId, reactionId } = params;
        const comment = await CommentModel.findById(commentId);
        if (!comment) throw new Error('Comment not found');
    
        if (!replyId) {
            const reactionIndex = comment.reactions ? comment.reactions.findIndex((reaction: any) => reaction._id.toString() === reactionId) : -1;
            if (comment.reactions && reactionIndex > -1) {
                comment.reactions.splice(reactionIndex, 1);
            } else {
                throw new Error('Reaction not found');
            }
        } else {
            const deleted = this.deleteReactionRecursive(comment.replies as CommentDocument[], replyId, reactionId);
            if (!deleted) throw new Error('Failed to delete reaction');
        }
    
        await comment.save();
        return comment;
    }
    
    private updateReactionRecursive(replies: any[], replyId: string, reactionId: string, updatedContent: string): boolean {
        for (let reply of replies) {
            if (reply._id.toString() === replyId) {
                // Buscar la reacción dentro del array de reacciones de la respuesta
                const reaction = reply.reactions.find((reaction: any) => reaction._id.toString() === reactionId);
                if (reaction) {
                    reaction.content = updatedContent;
                    return true;
                }
            }
    
            // Recursivamente busca en las respuestas anidadas
            if (reply.replies && reply.replies.length > 0) {
                const updated = this.updateReactionRecursive(reply.replies, replyId, reactionId, updatedContent);
                if (updated) {
                    return true;
                }
            }
        }
        return false;
    }
    
    public async updateReaction(params: any, updatedContent: string): Promise<CommentDocument | null> {
        const { commentId, replyId, reactionId } = params;
        const comment = await CommentModel.findById(commentId);
        if (!comment) throw new Error('Comment not found');
    
        // Si no hay un replyId, actualizamos la reacción del comentario principal
        if (!replyId) {
            const reaction = comment.reactions?.find((reaction: any) => reaction._id.toString() === reactionId);
            if (reaction) {
                reaction.content = updatedContent;
            } else {
                throw new Error('Reaction not found');
            }
        } else {
            // Si hay replyId, actualizamos la reacción en la respuesta anidada
            const updated = this.updateReactionRecursive(comment.replies as CommentDocument[], replyId, reactionId, updatedContent);
            if (!updated) throw new Error('Failed to update reaction');
        }
    
        await comment.save();
        return comment;
    }
    


}

export default new CommentService();