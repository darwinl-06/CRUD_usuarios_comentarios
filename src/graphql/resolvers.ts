import { UserDocument, UserInput } from "../models/user.model";
import { CommentDocument } from "../models/comment.model";
import userService from "../services/user.service";
import commentService from "../services/comment.service";
import { GraphQLError } from "graphql";
import { Console } from "node:console";

const checkRole = (requiredRoles: string[], role: string) => {
    if (!requiredRoles.includes(role)) {
        throw new GraphQLError("Acceso denegado", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};

const validateCommentOwnership = async (commentId: string, userId: string) => {
    const comment = await commentService.findById(commentId);
    if (comment?.userId.toString() !== userId) {
        throw new GraphQLError("Not Your Comment", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};

const validateReplyOwnership = async (commentId: string, replyId: string, userId: string) => {
    const reply = await commentService.findReplyById(commentId, replyId);
    if (reply?.userId.toString() !== userId) {
        throw new GraphQLError("Not Your Comment", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};

const validateReactionOwnership = async (commentId: string, reactionId: string, userId: string) => {
    const reaction = await commentService.findReactionById(commentId, reactionId);
    if (reaction?.userId.toString() !== userId) {
        throw new GraphQLError("Not Your Comment", {
            extensions: { code: "FORBIDDEN" }
        });
    }
};


export const resolvers = {
    Query: {
        user: async (_root: any, params: any) => {
            try {
                const user: UserDocument | null = await userService.findById(params.id);
                if (!user) throw new GraphQLError("Usuario no encontrado", { extensions: { code: "NOT_FOUND" } });
                return user;
            } catch (error) {
                throw new GraphQLError(`Error al obtener el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        users: async () => {
            try {
                const users: UserDocument[] = await userService.findAll();
                return users;
            } catch (error) {
                throw new GraphQLError(`Error al obtener los usuarios: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        userByEmail: async (_root: any, params: any) => {
            try {
                const user: UserDocument | null = await userService.findByEmail(params.email);
                if (!user) throw new GraphQLError("Usuario no encontrado con el correo proporcionado", { extensions: { code: "NOT_FOUND" } });
                return user;
            } catch (error) {
                throw new GraphQLError(`Error al obtener el usuario por correo: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        comment: async (_root: any, params: any) => {
            try {
                const comment: CommentDocument | null = await commentService.findById(params.id);
                if (!comment) throw new GraphQLError("Comentario no encontrado", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al obtener el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        comments: async () => {
            try {
                const comments: CommentDocument[] = await commentService.findAll();
                return comments;
            } catch (error) {
                throw new GraphQLError(`Error al obtener los comentarios: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },
    },

    Mutation: {
        login: async (_root: any, params: any) => {
            try {
                const userOutput = await userService.login(params.input);
                console.log(userOutput);
                return userOutput;
            } catch (error) {
                throw new GraphQLError(`Error en el inicio de sesión: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        createUser: async (_root: any, params: any, context: any) => {
            try {
                checkRole(['superadmin'], context.user.role);
                const userOutput: UserDocument = await userService.create(params.input as UserInput);
                return userOutput;
            } catch (error) {
                throw new GraphQLError(`Error al crear el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        updateUser: async (_root: any, params: any, context: any) => {
            try {
                checkRole(['superadmin'], context.user.role);
                const user: UserDocument | null = await userService.update(params.id, params.input as UserInput);
                if (!user) throw new GraphQLError("Usuario no encontrado para actualizar", { extensions: { code: "NOT_FOUND" } });
                return user;
            } catch (error) {
                throw new GraphQLError(`Error al actualizar el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        deleteUser: async (_root: any, params: any, context: any) => {
            try {
                checkRole(['superadmin'], context.user.role);
                const user: UserDocument | null = await userService.delete(params.id);
                if (!user) throw new GraphQLError("Usuario no encontrado para eliminar", { extensions: { code: "NOT_FOUND" } });
                return user;
            } catch (error) {
                throw new GraphQLError(`Error al eliminar el usuario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        createComment: async (_root: any, params: any, context: any) => {
            try {
                params.input.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.createComment(params.input);
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al crear el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        updateComment: async (_root: any, params: any, context: any) => {
            try {
                await validateCommentOwnership(params.id, context.user.user_id);
                const comment: CommentDocument | null = await commentService.update(params.id, params.content);
                if (!comment) throw new GraphQLError("Comentario no encontrado para actualizar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al actualizar el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        deleteComment: async (_root: any, params: any, context: any) => {
            try {
                await validateCommentOwnership(params.input.commentId, context.user.user_id);
                const comment: CommentDocument | null = await commentService.delete(params.id);
                if (!comment) throw new GraphQLError("Comentario no encontrado para eliminar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al eliminar el comentario: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        addReply: async (_root: any, params: any, context: any) => {
            try {
                params.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.addReplyToOne(params.commentId, params.reply, params.userId);

                console.log(comment);
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al agregar la respuesta: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        addReplyToReply: async (_root: any, params: any, context: any) => {
            try {
                params.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.addNestedReply(params.commentId, params.replyId, params.reply, params.userId);
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al agregar respuesta anidada: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        deleteReply: async (_root: any, params: any, context: any) => {
            try {
                await validateReplyOwnership(params.body.commentId, params.body.replyId , context.user.user_id);
                const comment: CommentDocument | null = await commentService.deleteReply(params.body);
                if (!comment) throw new GraphQLError("Respuesta no encontrada para eliminar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al eliminar la respuesta: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        updateReply: async (_root: any, params: any, context: any) => {
            try {
                console.log(params.body.replyId);
                console.log(context.user.user_id);
                await validateReplyOwnership(params.body.commentId, params.body.replyId , context.user.user_id);

                const comment: CommentDocument | null = await commentService.updateReply(params.body, params.content);
                if (!comment) throw new GraphQLError("Respuesta no encontrada para actualizar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al actualizar la respuesta: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        addReaction: async (_root: any, params: any, context: any) => {
            try {
                params.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.addReactionToComment(params.commentId, params.reaction, params.userId);
                console.log(comment);
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al agregar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        addReactionToReply: async (_root: any, params: any, context: any) => {
            try {
                params.userId = context.user.user_id;
                const comment: CommentDocument | null = await commentService.addReactionToReply(params.commentId, params.replyId, params.reaction, params.userId);
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al agregar la reacción a la respuesta: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        deleteReaction: async (_root: any, params: any, context: any) => {
            try {
                await validateReactionOwnership(params.body.commentId, params.body.reactionId , context.user.user_id);
                const comment: CommentDocument | null = await commentService.deleteReaction(params.body);
                if (!comment) throw new GraphQLError("Reacción no encontrada para eliminar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al eliminar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        },

        updateReaction: async (_root: any, params: any, context: any) => {
            try {
                await validateReactionOwnership(params.reaction.commentId, params.reaction.reactionId , context.user.user_id);
                const comment: CommentDocument | null = await commentService.updateReaction(params.reaction, params.content);
                if (!comment) throw new GraphQLError("Reacción no encontrada para actualizar", { extensions: { code: "NOT_FOUND" } });
                return comment;
            } catch (error) {
                throw new GraphQLError(`Error al actualizar la reacción: ${error}`, { extensions: { code: "INTERNAL_SERVER_ERROR" } });
            }
        }
    }
}; 
