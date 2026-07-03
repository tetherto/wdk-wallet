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
     * that the concrete implementation deliberately does not support, so consumers
     * can distinguish "not supported here" from an abstract method left unimplemented.
     *
     * @param {string} operation - The name of the operation that is not supported.
     */
    constructor(operation: string);
}
export class AccountRequiredError extends Error {
    /**
     * Create a new account required error. Thrown when an operation needs a wallet
     * account to run but none was bound at construction.
     *
     * @param {string} operation - The name of the operation that requires a wallet account.
     */
    constructor(operation: string);
}
