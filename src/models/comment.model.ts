import mongoose, { Schema, model, Document } from 'mongoose';

export interface IReaction {
    content: string;
    userId: mongoose.Schema.Types.ObjectId; 
}

export interface CommentDocument extends IComment, mongoose.Document {
    createdAt: Date;
    updateAt?: Date;
    deleteAt?: Date;
}

export interface IComment {
    content: string;
    userId: mongoose.Types.ObjectId;
    replies?: CommentDocument[];
    reactions?: IReaction[];
} 

const reactionSchema = new mongoose.Schema({
    content: { type: String, required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, required: true}
});

const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    replies: [this], 
    reactions: [reactionSchema]
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    replies: [ replySchema ], 
    reactions: [ reactionSchema ]
}, { timestamps: true, collection: "comments" });
const Comment = mongoose.model<CommentDocument>('Comment', commentSchema);

export default Comment;
