import userService from "../services/user.service.js";
import commentService from "../services/comment.service.js";
import { GraphQLError } from "graphql";
// Verifies if the user's role matches one of the required roles for the action
const checkRole = (requiredRoles, role) => {
    if (!requiredRoles.includes(role)) {
        throw new GraphQLError("Acceso denegado", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};
// Ensures the user is the owner of the specified comment   
const validateCommentOwnership = async (commentId, userId) => {
    const comment = await commentService.findById(commentId);
    if ((comment === null || comment === void 0 ? void 0 : comment.userId.toString()) !== userId) {
        throw new GraphQLError("Not Your Comment", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};
// Ensures the user is the owner of the specified reply
const validateReplyOwnership = async (commentId, replyId, userId) => {
    const reply = await commentService.findReplyById(commentId, replyId);
    if ((reply === null || reply === void 0 ? void 0 : reply.userId.toString()) !== userId) {
        throw new GraphQLError("Not Your Comment", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};
// Ensures the user is the owner of the specified reaction
const validateReactionOwnership = async (commentId, reactionId, userId) => {
    const reaction = await commentService.findReactionById(commentId, reactionId);
    if ((reaction === null || reaction === void 0 ? void 0 : reaction.userId.toString()) !== userId) {
        throw new GraphQLError("Not Your Comment", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};
export const resolvers = {
    Query: {
        // Fetches a user by their ID
        user: async (_root, params) => {
            try {
                const user = await userService.findById(params.id);
                if (!user)
                    throw new GraphQLError("Usuario no encontrado", { extensions: { code: "NOT_FOUND" } });
                return user;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Fetches all users
        users: async () => {
            try {
                const users = await userService.findAll();
                return users;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener los usuarios: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Fetches a user by their email
        userByEmail: async (_root, params) => {
            try {
                const user = await userService.findByEmail(params.email);
                if (!user)
                    throw new GraphQLError("Usuario no encontrado con el correo proporcionado", { extensions: { code: "NOT_FOUND" } });
                return user;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener el usuario por correo: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Fetches a comment by its ID
        comment: async (_root, params) => {
            try {
                const comment = await commentService.findById(params.id);
                if (!comment)
                    throw new GraphQLError("Comentario no encontrado", { extensions: { code: "NOT_FOUND" } });
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Fetches all comments
        comments: async () => {
            try {
                const comments = await commentService.findAll();
                return comments;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener los comentarios: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
    },
    Mutation: {
        // Handles user login
        login: async (_root, params) => {
            try {
                const userOutput = await userService.login(params.input);
                console.log(userOutput);
                return userOutput;
            }
            catch (error) {
                throw new GraphQLError(`Error en el inicio de sesión: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Creates a new user
        createUser: async (_root, params, context) => {
            try {
                checkRole(['superadmin'], context.user.role);
                const userOutput = await userService.create(params.input);
                return userOutput;
            }
            catch (error) {
                throw new GraphQLError(`Error al crear el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Updates an existing user
        updateUser: async (_root, params, context) => {
            try {
                checkRole(['superadmin'], context.user.role);
                const user = await userService.update(params.id, params.input);
                if (!user)
                    throw new GraphQLError("Usuario no encontrado para actualizar", { extensions: { code: "NOT_FOUND" } });
                return user;
            }
            catch (error) {
                throw new GraphQLError(`Error al actualizar el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Deletes an existing user
        deleteUser: async (_root, params, context) => {
            try {
                checkRole(['superadmin'], context.user.role);
                const user = await userService.delete(params.id);
                if (!user)
                    throw new GraphQLError("Usuario no encontrado para eliminar", { extensions: { code: "NOT_FOUND" } });
                return user;
            }
            catch (error) {
                throw new GraphQLError(`Error al eliminar el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Creates a new comment
        createComment: async (_root, params, context) => {
            try {
                params.input.userId = context.user.user_id;
                const comment = await commentService.createComment(params.input);
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al crear el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Updates an existing comment
        updateComment: async (_root, params, context) => {
            try {
                await validateCommentOwnership(params.id, context.user.user_id);
                const comment = await commentService.update(params.id, params.content);
                if (!comment)
                    throw new GraphQLError("Comentario no encontrado para actualizar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al actualizar el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Deletes an existing comment
        deleteComment: async (_root, params, context) => {
            try {
                await validateCommentOwnership(params.id, context.user.user_id);
                const comment = await commentService.delete(params.id);
                if (!comment)
                    throw new GraphQLError("Comentario no encontrado para eliminar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al eliminar el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Adds a reply to a comment
        addReply: async (_root, params, context) => {
            try {
                params.userId = context.user.user_id;
                const comment = await commentService.addReplyToOne(params.commentId, params.reply, params.userId);
                console.log(comment);
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al agregar la respuesta: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Adds a nested reply to another reply
        addReplyToReply: async (_root, params, context) => {
            try {
                params.userId = context.user.user_id;
                const comment = await commentService.addNestedReply(params.commentId, params.replyId, params.reply, params.userId);
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al agregar respuesta anidada: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Deletes a reply
        deleteReply: async (_root, params, context) => {
            try {
                await validateReplyOwnership(params.body.commentId, params.body.replyId, context.user.user_id);
                const comment = await commentService.deleteReply(params.body);
                if (!comment)
                    throw new GraphQLError("Respuesta no encontrada para eliminar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al eliminar la respuesta: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Updates a reply
        updateReply: async (_root, params, context) => {
            try {
                console.log(params.body.replyId);
                console.log(context.user.user_id);
                await validateReplyOwnership(params.body.commentId, params.body.replyId, context.user.user_id);
                const comment = await commentService.updateReply(params.body, params.content);
                if (!comment)
                    throw new GraphQLError("Respuesta no encontrada para actualizar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al actualizar la respuesta: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Adds a reaction to a comment
        addReaction: async (_root, params, context) => {
            try {
                params.userId = context.user.user_id;
                const comment = await commentService.addReactionToComment(params.commentId, params.reaction, params.userId);
                console.log(comment);
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al agregar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Adds a reaction to a reply
        addReactionToReply: async (_root, params, context) => {
            try {
                params.userId = context.user.user_id;
                const comment = await commentService.addReactionToReply(params.commentId, params.replyId, params.reaction, params.userId);
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al agregar la reacción a la respuesta: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Deletes a reaction
        deleteReaction: async (_root, params, context) => {
            try {
                await validateReactionOwnership(params.body.commentId, params.body.reactionId, context.user.user_id);
                const comment = await commentService.deleteReaction(params.body);
                if (!comment)
                    throw new GraphQLError("Reacción no encontrada para eliminar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al eliminar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
        // Updates a reaction
        updateReaction: async (_root, params, context) => {
            try {
                await validateReactionOwnership(params.reaction.commentId, params.reaction.reactionId, context.user.user_id);
                const comment = await commentService.updateReaction(params.reaction, params.content);
                if (!comment)
                    throw new GraphQLError("Reacción no encontrada para actualizar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            }
            catch (error) {
                throw new GraphQLError(`Error al actualizar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        }
    }
};
