export default class UserExistsError extends Error {
    /**
    * Constructs a new UserExistsError.
    * @param message - The error message to be displayed, which will be prefixed to the stack trace.
    */
    constructor(message) {
        super('');
        this.name = this.constructor.name;
        this.stack = message + ":" + this.stack;
    }
}
