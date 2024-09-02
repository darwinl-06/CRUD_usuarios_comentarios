import { CommentDocument, IComment, IReaction } from "../models/comment.model";
import CommentModel from "../models/comment.model";

class CommentService{

    public async createComment(commentInput: IComment): Promise<CommentDocument> {
        try {
            const comment = await CommentModel.create(commentInput);
            return comment;
        } catch (error) {
            throw error;
        } 
    }

    public async addReply(commentId: string, replyInput: IComment): Promise<CommentDocument | null> {
        try {
            const updatedComment = await CommentModel.findByIdAndUpdate( commentId,{ $push: { replies: replyInput } }, { new: true });
            return updatedComment;
        } catch (error) {
            throw error;
        }
    }

    public async addReaction(commentId: string, reaction: IReaction): Promise<CommentDocument | null> {
        try {
            const comment = await CommentModel.findByIdAndUpdate(
                commentId,
                { $push: { reactions: reaction } },
                { new: true }
            );
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
            const comment: CommentDocument | null = await CommentModel.findByIdAndUpdate(id, commentInput, {returnOriginal:false});
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

    public async deleteReaction(idComment: string, idReaction: string): Promise<CommentDocument | null> {
        try {
            const comment = await CommentModel.findById(idComment);
            if (!comment) {
                throw new Error('Comentario no encontrado');
            }
            const deletedReaction = comment?.reactions?.filter(r => r.userId.toString() !== idReaction);
            comment.reactions = deletedReaction;
            await comment?.save();
            return comment;
        } catch (error) {
            throw error;
        }
    }

}

export default new CommentService();