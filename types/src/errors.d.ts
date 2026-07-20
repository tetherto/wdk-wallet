export class NotImplementedError extends Error {
    /**
     * Create a new not implemented error.
     *
     * @param {string} methodName - The method's name.
     */
    constructor(methodName: string);
}
export class SignerError extends Error {
    /**
     * Create a new signer error.
     *
     * @param {string} message - The error's message.
     */
    constructor(message: string);
}
export class UnsupportedOperationError extends Error {
    /**
     * Create a new unsupported operation error. Thrown by an optional operation
     * that the concrete implementation deliberately does not support.
     *
     * @param {string} operation - The name of the operation that is not supported.
     */
    constructor(operation: string);
}
export class ValueError extends Error {
    /**
     * Create a new value error. Thrown when an argument fails validation.
     *
     * @param {string} message - The error's message.
     */
    constructor(message: string);
}
export class NoSuchElementError extends Error {
    /**
     * Create a new no such element error. Thrown when a lookup finds no element for
     * the given identifier.
     *
     * @param {string} message - The error's message.
     */
    constructor(message: string);
}
