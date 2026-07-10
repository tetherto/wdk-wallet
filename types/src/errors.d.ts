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
export class ValueError extends Error {
    /**
     * Create a new value error. Thrown when an argument has the correct type but
     * violates a validation rule.
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
