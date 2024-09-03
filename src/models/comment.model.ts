import mongoose, { Schema, model, Document } from 'mongoose';

// Interfaces
export interface IReaction {
    _id: any;
    content: string;
    userId: mongoose.Types.ObjectId; 
}

export interface IComment {
    content: string;
    userId: mongoose.Types.ObjectId;
    replies?: IReply[]; 
    reactions?: IReaction[];
}

export interface IReply {
    _id: any;
    content: string;
    userId: mongoose.Types.ObjectId;
    replies?: IReply[]; 
    reactions?: IReaction[];
}

export interface CommentDocument extends IComment, mongoose.Document {
    createdAt: Date;
    updateAt?: Date;
    deleteAt?: Date;
}

const reactionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true }
});

const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    replies: [this], 
    reactions: [reactionSchema]
});

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    replies: [replySchema], 
    reactions: [reactionSchema]
}, { timestamps: true, collection: "comments" });

const Comment = mongoose.model<CommentDocument>('Comment', commentSchema);

export default Comment;
