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

// Interface that extends IComment with Mongoose's Document interface to include Mongoose document properties
export interface CommentDocument extends IComment, mongoose.Document {
    createdAt: Date;
    updateAt?: Date;
    deleteAt?: Date;
}

// Schema for the Reaction model, representing a user's reaction to a comment or reply
const reactionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true }
});

// Schema for the Reply model, representing a reply to a comment or another reply
const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    replies: [this], 
    reactions: [reactionSchema]
});

// Schema for the Comment model, representing a user's comment on a post
const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    replies: [replySchema], 
    reactions: [reactionSchema]
}, { timestamps: true, collection: "comments" });


// Create a Mongoose model for comments using the CommentDocument interface
const Comment = mongoose.model<CommentDocument>('Comment', commentSchema);

export default Comment;
