/**
 * Enum for swap error reasons.
 */
export type SwapErrorReason = string;
export namespace SwapErrorReason {
    let INSUFFICIENT_BALANCE: string;
    let INSUFFICIENT_TOKEN_BALANCE: string;
    let COULD_NOT_MET_THRESHOLD: string;
}
/**
 * Enum for bridge error reasons.
 */
export type BridgeErrorReason = string;
export namespace BridgeErrorReason {
    let INSUFFICIENT_BALANCE_1: string;
    export { INSUFFICIENT_BALANCE_1 as INSUFFICIENT_BALANCE };
    let INSUFFICIENT_TOKEN_BALANCE_1: string;
    export { INSUFFICIENT_TOKEN_BALANCE_1 as INSUFFICIENT_TOKEN_BALANCE };
}
/**
 * Enum for supply error reasons.
 */
export type SupplyErrorReason = string;
export namespace SupplyErrorReason {
    let INSUFFICIENT_BALANCE_2: string;
    export { INSUFFICIENT_BALANCE_2 as INSUFFICIENT_BALANCE };
    let INSUFFICIENT_TOKEN_BALANCE_2: string;
    export { INSUFFICIENT_TOKEN_BALANCE_2 as INSUFFICIENT_TOKEN_BALANCE };
}
/**
 * Enum for withdraw error reasons.
 */
export type WithdrawErrorReason = string;
export namespace WithdrawErrorReason {
    let INSUFFICIENT_BALANCE_3: string;
    export { INSUFFICIENT_BALANCE_3 as INSUFFICIENT_BALANCE };
    let INSUFFICIENT_TOKEN_BALANCE_3: string;
    export { INSUFFICIENT_TOKEN_BALANCE_3 as INSUFFICIENT_TOKEN_BALANCE };
}
/**
 * Enum for borrow error reasons.
 */
export type BorrowErrorReason = string;
export namespace BorrowErrorReason {
    let INSUFFICIENT_BALANCE_4: string;
    export { INSUFFICIENT_BALANCE_4 as INSUFFICIENT_BALANCE };
    let INSUFFICIENT_TOKEN_BALANCE_4: string;
    export { INSUFFICIENT_TOKEN_BALANCE_4 as INSUFFICIENT_TOKEN_BALANCE };
}
/**
 * Enum for repay error reasons.
 */
export type RepayErrorReason = string;
export namespace RepayErrorReason {
    let INSUFFICIENT_BALANCE_5: string;
    export { INSUFFICIENT_BALANCE_5 as INSUFFICIENT_BALANCE };
    let INSUFFICIENT_TOKEN_BALANCE_5: string;
    export { INSUFFICIENT_TOKEN_BALANCE_5 as INSUFFICIENT_TOKEN_BALANCE };
}
/**
 * Enum for buy error reasons.
 */
export type BuyErrorReason = string;
export namespace BuyErrorReason {
    let INSUFFICIENT_FUNDS: string;
}
/**
 * Enum for sell error reasons.
 */
export type SellErrorReason = string;
export namespace SellErrorReason {
    let INSUFFICIENT_FUNDS_1: string;
    export { INSUFFICIENT_FUNDS_1 as INSUFFICIENT_FUNDS };
}
/**
 * Enum for swidge error reasons.
 */
export type SwidgeErrorReason = string;
export namespace SwidgeErrorReason {
    let INSUFFICIENT_BALANCE_6: string;
    export { INSUFFICIENT_BALANCE_6 as INSUFFICIENT_BALANCE };
    let INSUFFICIENT_TOKEN_BALANCE_6: string;
    export { INSUFFICIENT_TOKEN_BALANCE_6 as INSUFFICIENT_TOKEN_BALANCE };
    let COULD_NOT_MET_THRESHOLD_1: string;
    export { COULD_NOT_MET_THRESHOLD_1 as COULD_NOT_MET_THRESHOLD };
    export let SLIPPAGE_TOO_HIGH: string;
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
 * Thrown when an operation requires a read-only account to be set.
 */
export class ReadOnlyAccountRequiredError extends AccountRequiredError {
    /**
     * Creates a new read-only account required error.
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
/**
 * Thrown when a bridge fails with an error.
 */
export class BridgeError extends WdkError {
    /**
     * Creates a new bridge error.
     *
     * @param {string} message - The error's message.
     * @param {BridgeErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: BridgeErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
/**
 * Thrown when a supply fails with an error.
 */
export class SupplyError extends WdkError {
    /**
     * Creates a new supply error.
     *
     * @param {string} message - The error's message.
     * @param {SupplyErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: SupplyErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
/**
 * Thrown when a withdraw fails with an error.
 */
export class WithdrawError extends WdkError {
    /**
     * Creates a new withdraw error.
     *
     * @param {string} message - The error's message.
     * @param {WithdrawErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: WithdrawErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
/**
 * Thrown when a borrow fails with an error.
 */
export class BorrowError extends WdkError {
    /**
     * Creates a new borrow error.
     *
     * @param {string} message - The error's message.
     * @param {BorrowErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: BorrowErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
/**
 * Thrown when a repay fails with an error.
 */
export class RepayError extends WdkError {
    /**
     * Creates a new repay error.
     *
     * @param {string} message - The error's message.
     * @param {RepayErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: RepayErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
/**
 * Thrown when a purchase fails with an error.
 */
export class BuyError extends WdkError {
    /**
     * Creates a new buy error.
     *
     * @param {string} message - The error's message.
     * @param {BuyErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: BuyErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
/**
 * Thrown when a sale fails with an error.
 */
export class SellError extends WdkError {
    /**
     * Creates a new sell error.
     *
     * @param {string} message - The error's message.
     * @param {SellErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: SellErrorOptions & ErrorOptions);
    /**
     * The error's reason.
     *
     * @type {string}
     */
    reason: string;
}
/**
 * Thrown when a swidge fails with an error.
 */
export class SwidgeError extends WdkError {
    /**
     * Creates a new swidge error.
     *
     * @param {string} message - The error's message.
     * @param {SwidgeErrorOptions & ErrorOptions} options - The error's options.
     */
    constructor(message: string, options: SwidgeErrorOptions & ErrorOptions);
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
export type BridgeErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: BridgeErrorReason;
};
export type SupplyErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: SupplyErrorReason;
};
export type WithdrawErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: WithdrawErrorReason;
};
export type BorrowErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: BorrowErrorReason;
};
export type RepayErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: RepayErrorReason;
};
export type BuyErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: BuyErrorReason;
};
export type SellErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: SellErrorReason;
};
export type SwidgeErrorOptions = {
    /**
     * - The error's reason.
     */
    reason: SwidgeErrorReason;
};
import { InvalidTokenError } from '../errors.js';
import { MaximumFeeExceededError } from '../errors.js';
import { NoSuchElementError } from '../errors.js';
import { NotImplementedError } from '../errors.js';
import { ProviderError } from '../errors.js';
import { ProviderRequiredError } from '../errors.js';
import { UnsupportedOperationError } from '../errors.js';
import { ValueError } from '../errors.js';
import { WdkError } from '../errors.js';
export { InvalidTokenError, MaximumFeeExceededError, NoSuchElementError, NotImplementedError, ProviderError, ProviderRequiredError, UnsupportedOperationError, ValueError, WdkError };
