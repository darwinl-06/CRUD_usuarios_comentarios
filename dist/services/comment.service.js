import mongoose from "mongoose"; // Import Mongoose library for MongoDB operations
import CommentModel from "../models/comment.model.js"; // Import the Comment model
// Define the CommentService class
class CommentService {
    // Method to create a new comment
    async createComment(commentInput) {
        try {
            const comment = await CommentModel.create(commentInput); // Create a comment using the CommentModel
            return comment; // Return the created comment
        }
        catch (error) {
            throw error; // Propagate any errors
        }
    }
    // Method to retrieve all comments
    async findAll() {
        try {
            const comments = await CommentModel.find(); // Retrieve all comments
            return comments; // Return the list of comments
        }
        catch (error) {
            throw error; // Propagate any errors
        }
    }
    // Method to find a comment by its ID
    async findById(_id) {
        try {
            const comment = await CommentModel.findById(_id); // Find comment by ID
            return comment; // Return the found comment or null if not found
        }
        catch (error) {
            throw error; // Propagate any errors
        }
    }
    // Method to update an existing comment by its ID
    async update(id, commentInput) {
        try {
            const comment = await CommentModel.findByIdAndUpdate(id, commentInput, { returnOriginal: false }); // Update the comment
            return comment; // Return the updated comment or null if not found
        }
        catch (error) {
            throw error; // Propagate any errors
        }
    }
    // Method to delete a comment by its ID
    async delete(id) {
        try {
            const comment = await CommentModel.findByIdAndDelete(id); // Delete the comment
            return comment; // Return the deleted comment or null if not found
        }
        catch (error) {
            throw error; // Propagate any errors
        }
    }
    // Method to find a reply by its ID
    async findReplyById(commentId, replyId) {
        try {
            const comment = await CommentModel.findById(commentId); // Find the comment by ID
            if (!comment)
                throw new Error('Comment not found'); // Throw an error if the comment is not found
            const reply = this.findReplyByIdRecursive(comment.replies, replyId); // Find the reply by ID
            return reply; // Return the found reply or null if not found
        }
        catch (error) {
            throw error; // Propagate any errors
        }
    }
    // Private method to recursively find a reply by its ID
    findReplyByIdRecursive(replies, replyId) {
        for (let reply of replies) {
            if (reply._id.toString() === replyId) { // Check if the reply ID matches
                return reply; // Return the found reply
            }
            if (reply.replies && reply.replies.length > 0) { // Recursively check nested replies
                const foundReply = this.findReplyByIdRecursive(reply.replies, replyId);
                if (foundReply) {
                    return foundReply; // Return the found reply
                }
            }
        }
        return null; // Indicate failure to find
    }
    // Method to add a reply to a specific comment
    async addReplyToOne(commentId, replyInput, idUser) {
        try {
            const updatedComment = await CommentModel.findByIdAndUpdate(commentId, {
                $push: {
                    replies: {
                        content: replyInput.content,
                        _id: new mongoose.Types.ObjectId()._id, // Generate a new ObjectId for the reply
                        userId: new mongoose.Types.ObjectId(idUser), // Convert userId to ObjectId
                        replies: [], // Initialize an empty replies array
                        reactions: [] // Initialize an empty reactions array
                    }
                }
            }, { new: true }); // Return the updated document
            return updatedComment; // Return the updated comment
        }
        catch (error) {
            throw error; // Propagate any errors
        }
    }
    // Private method to delete a reply from a list of comments
    deleteReplyToComment(comments, replyId) {
        for (let comment of comments) {
            if (comment._id.toString() === replyId) { // Check if the comment ID matches the reply ID
                const index = comments.indexOf(comment); // Find the index of the comment
                if (index > -1) {
                    comments.splice(index, 1); // Remove the comment from the array
                    return true; // Indicate successful deletion
                }
            }
            if (comment.replies && comment.replies.length > 0) { // Recursively check replies
                const deleted = this.deleteReplyToComment(comment.replies, replyId);
                if (deleted) {
                    return true; // Indicate successful deletion
                }
            }
        }
        return false; // Indicate failure to delete
    }
    // Method to update a reply within comments
    async updateReplyInComments(comments, replyId, updatedReply) {
        for (let comment of comments) {
            if (comment.replies) {
                for (let reply of comment.replies) {
                    if (reply._id.toString() === replyId) { // Check if the reply ID matches
                        reply.content = updatedReply.content; // Update the reply content
                        return true; // Indicate successful update
                    }
                }
            }
            if (comment.id.toString() === replyId) { // Check if the comment ID matches the reply ID
                comment.content = updatedReply.content; // Update the comment content
                return true; // Indicate successful update
            }
            if (comment.replies && comment.replies.length > 0) { // Recursively check replies
                const updated = await this.updateReplyInComments(comment.replies, replyId, updatedReply);
                if (updated) {
                    return true; // Indicate successful update
                }
            }
        }
        return false; // Indicate failure to update
    }
    // Method to update a reply in a comment
    async updateReply(params, body) {
        const comment = await CommentModel.findById(params.commentId); // Find the comment by ID
        if (!comment)
            throw new Error('Comment not found'); // Throw an error if the comment is not found
        const updated = await this.updateReplyInComments(comment.replies, params.replyId, { content: body.content }); // Update the reply
        if (!updated)
            throw new Error('Failed to update reply'); // Throw an error if updating fails
        comment.markModified('replies'); // Mark the replies field as modified
        await comment.save(); // Save the updated comment
        return comment; // Return the updated comment
    }
    // Method to delete a reply from a comment
    async deleteReply(params) {
        const comment = await CommentModel.findById(params.commentId); // Find the comment by ID
        if (!comment)
            throw new Error('Comment not found'); // Throw an error if the comment is not found
        if (!comment.replies) {
            comment.replies = []; // Initialize replies array if it is undefined
        }
        const deleted = this.deleteReplyToComment(comment.replies, params.replyId); // Delete the reply
        if (!deleted)
            throw new Error('Failed to delete reply'); // Throw an error if deletion fails
        comment.markModified('replies'); // Mark the replies field as modified
        await comment.save(); // Save the updated comment
        return comment; // Return the updated comment
    }
    // Method to add a nested reply to a specific reply
    async addNestedReply(commentId, replyId, replyInput, idUser) {
        try {
            const comment = await CommentModel.findById(commentId); // Find the comment by ID
            if (!comment)
                throw new Error('Comment not found'); // Throw an error if the comment is not found
            const nestedReply = {
                _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the nested reply
                content: replyInput.content,
                userId: new mongoose.Types.ObjectId(idUser), // Convert userId to ObjectId
                replies: [], // Initialize an empty replies array
                reactions: [] // Initialize an empty reactions array
            };
            const added = this.addNestedReplyToComment(comment.replies, replyId, nestedReply); // Add the nested reply
            if (!added)
                throw new Error('Failed to add nested reply'); // Throw an error if adding fails
            comment.markModified('replies'); // Mark the replies field as modified
            await comment.save(); // Save the updated comment
            return comment; // Return the updated comment
        }
        catch (error) {
            console.error('Error adding nested reply:', error); // Log any errors
            throw error; // Propagate the error
        }
    }
    // Private method to add a nested reply to a specific reply
    addNestedReplyToComment(comments, replyId, nestedReply) {
        for (let comment of comments) {
            if (comment._id.toString() === replyId) { // Check if the comment ID matches the reply ID
                if (!comment.replies) {
                    comment.replies = []; // Initialize replies array if it is undefined
                }
                comment.replies.push(nestedReply); // Add the nested reply
                return true; // Indicate successful addition
            }
            if (comment.replies && comment.replies.length > 0) { // Recursively check replies
                const added = this.addNestedReplyToComment(comment.replies, replyId, nestedReply);
                if (added) {
                    return true; // Indicate successful addition
                }
            }
        }
        return false; // Indicate failure to add
    }
    // Method to find a reaction by its ID
    async findReactionById(commentId, reactionId) {
        var _a;
        try {
            const comment = await CommentModel.findById(commentId); // Find the comment by ID
            if (!comment)
                throw new Error('Comment not found'); // Throw an error if the comment is not found
            const reaction = (_a = comment.reactions) === null || _a === void 0 ? void 0 : _a.find((reaction) => reaction._id.toString() === reactionId); // Find the reaction by ID
            if (reaction) {
                return reaction; // Return the found reaction
            }
            const foundReaction = this.findReactionByIdRecursive(comment.replies, reactionId); // Recursively find the reaction in replies
            return foundReaction; // Return the found reaction or null if not found
        }
        catch (error) {
            throw error; // Propagate any errors
        }
    }
    // Private method to recursively find a reaction by its ID
    findReactionByIdRecursive(replies, reactionId) {
        var _a;
        for (let reply of replies) {
            const reaction = (_a = reply.reactions) === null || _a === void 0 ? void 0 : _a.find((reaction) => reaction._id.toString() === reactionId); // Find the reaction by ID
            if (reaction) {
                return reaction; // Return the found reaction
            }
            if (reply.replies && reply.replies.length > 0) { // Recursively check nested replies
                const foundReaction = this.findReactionByIdRecursive(reply.replies, reactionId);
                if (foundReaction) {
                    return foundReaction; // Return the found reaction
                }
            }
        }
        return null; // Indicate failure to find
    }
    // Method to add a reaction to a comment
    async addReactionToComment(commentId, reaction, idUser) {
        try {
            const commentIdParsed = new mongoose.Types.ObjectId(commentId); // Convert commentId to ObjectId
            const result = await CommentModel.findOneAndUpdate({ _id: commentIdParsed }, { $push: { reactions: {
                        _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the reaction
                        content: reaction.content,
                        userId: new mongoose.Types.ObjectId(idUser) // Convert userId to ObjectId
                    } } }, { new: true } // Return the updated document
            );
            if (result) {
                return result; // Return success result
            }
            else {
                return { success: false, message: 'Comment not found' }; // Return failure result if comment not found
            }
        }
        catch (error) {
            throw new Error; // Throw a generic error
        }
    }
    // Method to add a reaction to a reply
    async addReactionToReply(commentId, replyId, reaction, idUser) {
        const comment = await CommentModel.findById(commentId); // Find the comment by ID
        reaction.userId = idUser;
        if (!comment)
            throw new Error('Comment not found'); // Throw an error if the comment is not found
        const added = this.addReactionToReplyRecursive(comment.replies, replyId, reaction); // Add the reaction to the reply
        if (!added)
            throw new Error('Failed to add reaction to reply'); // Throw an error if adding fails
        comment.markModified('replies'); // Mark the replies field as modified
        await comment.save(); // Save the updated comment
        return comment; // Return the updated comment
    }
    // Private method to recursively add a reaction to a specific reply
    addReactionToReplyRecursive(replies, replyId, reaction) {
        for (let reply of replies) {
            if (reply._id.toString() === replyId) { // Check if the reply ID matches
                if (!reply.reactions) {
                    reply.reactions = []; // Initialize reactions array if it is undefined
                }
                reply.reactions.push(reaction); // Add the reaction
                return true; // Indicate successful addition
            }
            if (reply.replies && reply.replies.length > 0) { // Recursively check nested replies
                const added = this.addReactionToReplyRecursive(reply.replies, replyId, reaction);
                if (added) {
                    return true; // Indicate successful addition
                }
            }
        }
        return false; // Indicate failure to add
    }
    // Private method to recursively delete a reaction
    deleteReactionRecursive(replies, replyId, reactionId) {
        for (let reply of replies) {
            if (reply._id.toString() === replyId) { // Check if the reply ID matches
                const reactionIndex = reply.reactions.findIndex((reaction) => reaction._id.toString() === reactionId); // Find the index of the reaction
                if (reactionIndex > -1) {
                    reply.reactions.splice(reactionIndex, 1); // Remove the reaction from the array
                    return true; // Indicate successful deletion
                }
            }
            if (reply.replies && reply.replies.length > 0) { // Recursively check nested replies
                const deleted = this.deleteReactionRecursive(reply.replies, replyId, reactionId);
                if (deleted) {
                    return true; // Indicate successful deletion
                }
            }
        }
        return false; // Indicate failure to delete
    }
    // Method to delete a reaction from a comment or reply
    async deleteReaction(params) {
        const { commentId, replyId, reactionId } = params; // Extract parameters
        const comment = await CommentModel.findById(commentId); // Find the comment by ID
        if (!comment)
            throw new Error('Comment not found'); // Throw an error if the comment is not found
        if (!replyId) { // If no replyId, delete the reaction from the comment itself
            const reactionIndex = comment.reactions ? comment.reactions.findIndex((reaction) => reaction._id.toString() === reactionId) : -1; // Find the reaction index
            if (comment.reactions && reactionIndex > -1) {
                comment.reactions.splice(reactionIndex, 1); // Remove the reaction from the array
            }
            else {
                throw new Error('Reaction not found'); // Throw an error if the reaction is not found
            }
        }
        else { // If replyId is provided, delete the reaction from a reply
            const deleted = this.deleteReactionRecursive(comment.replies, replyId, reactionId); // Delete the reaction
            if (!deleted)
                throw new Error('Failed to delete reaction'); // Throw an error if deletion fails
        }
        comment.markModified('replies'); // Mark the replies field as modified
        await comment.save(); // Save the updated comment
        return comment; // Return the updated comment
    }
    // Private method to recursively update a reaction
    updateReactionRecursive(replies, replyId, reactionId, updatedContent) {
        for (let reply of replies) {
            if (reply._id.toString() === replyId) { // Check if the reply ID matches
                const reaction = reply.reactions.find((reaction) => reaction._id.toString() === reactionId); // Find the reaction
                if (reactionId) {
                    reaction.content = updatedContent; // Update the reaction content
                    return true; // Indicate successful update
                }
            }
            if (reply.replies && reply.replies.length > 0) { // Recursively check nested replies
                const updated = this.updateReactionRecursive(reply.replies, replyId, reactionId, updatedContent);
                if (updated) {
                    return true; // Indicate successful update
                }
            }
        }
        return false; // Indicate failure to update
    }
    // Method to update a reaction in a comment or reply
    async updateReaction(params, updatedContent) {
        var _a;
        const { commentId, replyId, reactionId } = params; // Extract parameters
        const comment = await CommentModel.findById(commentId); // Find the comment by ID
        if (!comment)
            throw new Error('Comment not found'); // Throw an error if the comment is not found
        if (!replyId) { // If no replyId, update the reaction in the comment itself
            const reaction = (_a = comment.reactions) === null || _a === void 0 ? void 0 : _a.find((reaction) => reaction._id.toString() === reactionId); // Find the reaction
            if (reaction) {
                reaction.content = updatedContent; // Update the reaction content
            }
            else {
                throw new Error('Reaction not found'); // Throw an error if the reaction is not found
            }
        }
        else { // If replyId is provided, update the reaction in a reply
            const updated = this.updateReactionRecursive(comment.replies, replyId, reactionId, updatedContent); // Update the reaction
            if (!updated)
                throw new Error('Failed to update reaction'); // Throw an error if updating fails
        }
        comment.markModified('replies'); // Mark the replies field as modified
        await comment.save(); // Save the updated comment
        return comment; // Return the updated comment
    }
}
// Export an instance of the CommentService
export default new CommentService();
