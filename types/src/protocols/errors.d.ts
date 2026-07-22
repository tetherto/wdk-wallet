/**
 * Enum for swap error reasons.
 */
export type SwapErrorReason = string;
export namespace SwapErrorReason {
    let INSUFFICIENT_BALANCE: string;
    let INSUFFICIENT_TOKEN_BALANCE: string;
    let LOWER_THAN_EXPECTED_OUTPUT: string;
}
/**
 * @typedef {Object} SwapErrorOptions
 * @property {SwapErrorReason} reason - The error's reason.
 */
/**
 * Thrown when an operation requires a read-only account to be set.
 */
export class ReadOnlyAccountRequiredError extends WdkError {
    /**
     * Creates a new read-only account required error.
     *
     * @param {string} message - The error's message.
     */
    constructor(message: string);
}
/**
 * Thrown when an operation requires an account to be set.
 */
export class AccountRequiredError extends WdkError {
    /**
     * Creates a new account required error.
     *
     * @param {string} message - The error's message.
     */
    constructor(message: string);
}
/**
 * Thrown when a swap fails with an error.
 */
export class SwapError extends WdkError {
    /**
     * Creates a new swap error.
     *
     * @param {string} message - The error's message.
     * @param {SwapErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: SwapErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
export type SwapErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: SwapErrorReason;
};
export { InvalidTokenError, MaximumFeeExceededError, ProviderError, ProviderRequiredError, ValueError, WdkError };
import { InvalidTokenError, MaximumFeeExceededError, ProviderError, ProviderRequiredError, ValueError, WdkError } from '../errors.js';
