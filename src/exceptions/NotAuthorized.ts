export default class NotAuthorizedError extends Error {

     /**
     * Constructs a new NotAuthorizedError.
     * @param message - The error message to be displayed, which will be prefixed to the stack trace.
     */
    constructor(message:string){
        super('');
        this.name = this.constructor.name;
        this.stack = message + ":" + this.stack;
    }
}