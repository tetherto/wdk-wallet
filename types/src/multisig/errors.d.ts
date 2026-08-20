/**
 * Thrown when the account is not an owner of the multisig wallet.
 */
export class AccountNotOwnerError extends WdkError {
    /**
     * Creates a new account not owner error.
     *
     * @param {string} message - The error's message.
     */
    constructor(message: string);
}
/**
 * Thrown when the account attempts to execute a proposal but its threshold has not been met yet.
 */
export class ThresholdNotMetError extends WdkError {
    /**
     * Creates a new threshold not met error.
     *
     * @param {string} message - The error's message.
     */
    constructor(message: string);
}
export type TransactionErrorOptions = import("../errors.js").TransactionErrorOptions;
import { MaximumFeeExceededError } from '../errors.js';
import { NoSuchElementError } from '../errors.js';
import { NotImplementedError } from '../errors.js';
import { ProviderError } from '../errors.js';
import { ProviderRequiredError } from '../errors.js';
import { TransactionError } from '../errors.js';
import { TransactionErrorReason } from '../errors.js';
import { ValueError } from '../errors.js';
import { WdkError } from '../errors.js';
export { MaximumFeeExceededError, NoSuchElementError, NotImplementedError, ProviderError, ProviderRequiredError, TransactionError, TransactionErrorReason, ValueError, WdkError };
