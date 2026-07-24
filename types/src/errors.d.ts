/**
 * Enum for provider error reasons.
 */
export type ProviderErrorReason = number;
export namespace ProviderErrorReason {
    let NETWORK_ERROR: number;
    let UNAUTHORIZED: number;
    let FORBIDDEN: number;
    let REQUEST_TIMEOUT: number;
    let INTERNAL_SERVER_ERROR: number;
}
/**
 * Enum for transaction error reasons.
 */
export type TransactionErrorReason = string;
export namespace TransactionErrorReason {
    let INSUFFICIENT_BALANCE: string;
}
/**
 * Enum for transfer error reasons.
 */
export type TransferErrorReason = string;
export namespace TransferErrorReason {
    let INSUFFICIENT_BALANCE_1: string;
    export { INSUFFICIENT_BALANCE_1 as INSUFFICIENT_BALANCE };
    export let INSUFFICIENT_TOKEN_BALANCE: string;
}
/**
 * Super-class for errors thrown by wallet development kit's wallet and protocol modules.
 */
export class WdkError extends Error {
    /**
     * Creates a new wallet development kit error.
     *
     * @param {string} message - The error's message.
     * @param {ErrorOptions} [options] - The error's options.
     */
    constructor(message: string, options?: ErrorOptions);
}
/**
 * Thrown when an abstract method is lacking implementation in the sub-class.
 */
export class NotImplementedError extends WdkError {
    /**
     * Creates a new not implemented error.
     *
     * @param {string} methodName - The method's name.
     */
    constructor(methodName: string);
}
/**
 * Thrown when an assertion fails.
 */
export class AssertionError extends WdkError {
    /**
     * Creates a new assertion error.
     *
     * @param {string} message - The error's message.
     */
    constructor(message: string);
}
/**
 * Thrown when an operation is not supported in the implementation of an interface or abstract class.
 */
export class UnsupportedOperationError extends WdkError {
    /**
     * Creates a new unsupported operation error.
     *
     * @param {string} method - The method's name.
     */
    constructor(method: string);
}
/**
 * Thrown when a method's argument holds an invalid value.
 */
export class ValueError extends WdkError {
    /**
     * Creates a new value error.
     *
     * @param {string} message - The error's message.
     * @param {ErrorOptions} [options] - The error's options.
     */
    constructor(message: string, options?: ErrorOptions);
}
/**
 * Thrown when no element is found for the given identifier.
 */
export class NoSuchElementError extends WdkError {
    /**
     * Creates a new no such element error.
     *
     * @param {string} message - The error's message.
     * @param {ErrorOptions} [options] - The error's options.
     */
    constructor(message: string, options?: ErrorOptions);
}
/**
 * Thrown when an operation rejects to use the given signer.
 */
export class InvalidSignerError extends WdkError {
    /**
     * Creates a new invalid signer error.
     *
     * @param {string} message - The error's message.
     * @param {ErrorOptions} [options] - The error's options.
     */
    constructor(message: string, options?: ErrorOptions);
}
/**
 * Thrown when an address doesn't match an existing token.
 */
export class InvalidTokenError extends WdkError {
    /**
     * Creates a new invalid token error.
     *
     * @param {string} message - The error's message.
     * @param {ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: ErrorOptions);
}
/**
 * Thrown when an operation requires a provider.
 */
export class ProviderRequiredError extends WdkError {
    /**
     * Creates a new provider required error.
     *
     * @param {string} message - The error's message.
     */
    constructor(message: string);
}
/**
 * Thrown when a provider fails to perform an operation.
 */
export class ProviderError extends WdkError {
    /**
     * Creates a new provider error.
     *
     * @param {string} message - The error's message.
     * @param {ProviderErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: ProviderErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {number}
     */
    reason: number;
}
/**
 * Thrown when a transaction fails with an error.
 */
export class TransactionError extends WdkError {
    /**
     * Creates a new transaction error.
     *
     * @param {string} message - The error's message.
     * @param {TransactionErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: TransactionErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
/**
 * Thrown when a transfer fails with an error.
 */
export class TransferError extends WdkError {
    /**
     * Creates a new transaction error.
     *
     * @param {string} message - The error's message.
     * @param {TransferErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: TransferErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
/**
 * Thrown when an operation exceeds its maximum fee threshold.
 */
export class MaximumFeeExceededError extends WdkError {
    /**
     * Creates a new maximum fee exceeded error.
     *
     * @param {string} message - The error's message.
     * @param {ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: ErrorOptions);
}
export type ProviderErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: ProviderErrorReason;
};
export type TransactionErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: TransactionErrorReason;
};
export type TransferErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: TransferErrorReason;
};
