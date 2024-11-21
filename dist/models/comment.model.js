import mongoose from 'mongoose';
// Schema for the Reaction model, representing a user's reaction to a comment or reply
const reactionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true }
});
// Schema for the Reply model, representing a reply to a comment or another reply
const replySchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    replies: [],
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
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
