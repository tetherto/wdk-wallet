/**
 * Enum that assigns a comparable ordinal to each finality level, used to check
 * whether an observed finality satisfies a requested target.
 */
export type FINALITY = number;
export namespace FINALITY {
    let pending: number;
    let dropped: number;
    let confirmed: number;
    let final: number;
}
/** @interface */
export interface IWalletAccountReadOnly extends IWalletAccountReadOnlySimple {
    /**
     * Quotes the costs of a send transaction operation.
     *
     * @param {Transaction} tx - The transaction.
     * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
     * @throws {ValueError} If the transaction is not valid.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to estimate the costs of the transaction.
     * @throws {TransactionError} If the transaction fails with an error.
     */
    quoteSendTransaction(tx: Transaction): Promise<Omit<TransactionResult, "hash">>;
    /**
     * Quotes the costs of a transfer operation.
     *
     * @param {TransferOptions} options - The transfer's options.
     * @returns {Promise<Omit<TransferResult, 'hash'>>} The transfer's quotes.
     * @throws {ValueError} If the transfer options are not valid.
     * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to estimate the costs of the transfer.
     * @throws {TransferError} If the transfer fails with an error.
     */
    quoteTransfer(options: TransferOptions): Promise<Omit<TransferResult, "hash">>;
}
/**
 * @abstract
 * @implements {IWalletAccountReadOnly}
 */
export default abstract class WalletAccountReadOnly implements IWalletAccountReadOnly {
    /**
     * Creates a new read-only wallet account.
     *
     * @param {string} [address] - The account's address.
     */
    constructor(address?: string);
    /**
     * The default poll cadence for {@link waitForTransaction}, in milliseconds,
     * applied when the caller doesn't provide an `interval`. Subclasses override
     * it to match their chain's block time.
     *
     * @type {number}
     */
    get defaultWaitInterval(): number;
    /**
     * The default time budget for {@link waitForTransaction}, in milliseconds,
     * applied when the caller doesn't provide a `timeout`. Subclasses override it
     * to match their chain's finality expectations.
     *
     * @type {number}
     */
    get defaultWaitTimeout(): number;
    /** @private */
    private __address;
    /**
     * The account's address.
     *
     * @protected
     * @type {string | undefined}
     */
    protected get _address(): string | undefined;
    /**
     * Returns the account's address.
     *
     * @returns {Promise<string>} The account's address.
     */
    getAddress(): Promise<string>;
    /**
     * Verifies a message's signature.
     *
     * @param {string} message - The original message.
     * @param {string} signature - The signature to verify.
     * @returns {Promise<boolean>} True if the signature is valid.
     * @throws {UnsupportedOperationError} If the read-only wallet account class is not able to provide an implementation for the method.
     */
    verify(message: string, signature: string): Promise<boolean>;
    /**
     * Returns the account's native token balance.
     *
     * @abstract
     * @returns {Promise<bigint>} The native token balance.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the account's balance.
     */
    abstract getBalance(): Promise<bigint>;
    /**
     * Returns the account balance for a specific token.
     *
     * @abstract
     * @param {string} tokenAddress - The smart contract address of the token.
     * @returns {Promise<bigint>} The token balance.
     * @throws {ValueError} If the token's address is not valid.
     * @throws {InvalidTokenError} If the token's address doesn't match an existing ERC 20 token.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the account's token balance.
     */
    abstract getTokenBalance(tokenAddress: string): Promise<bigint>;
    /**
     * Quotes the costs of a send transaction operation.
     *
     * @abstract
     * @param {Transaction} tx - The transaction.
     * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
     * @throws {ValueError} If the transaction is not valid.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to estimate the costs of the transaction.
     * @throws {TransactionError} If the transaction fails with an error.
     */
    abstract quoteSendTransaction(tx: Transaction): Promise<Omit<TransactionResult, "hash">>;
    /**
     * Quotes the costs of a transfer operation.
     *
     * @abstract
     * @param {TransferOptions} options - The transfer's options.
     * @returns {Promise<Omit<TransferResult, 'hash'>>} The transfer's quotes.
     * @throws {ValueError} If the transfer options are not valid.
     * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to estimate the costs of the transfer.
     * @throws {TransferError} If the transfer fails with an error.
     */
    abstract quoteTransfer(options: TransferOptions): Promise<Omit<TransferResult, "hash">>;
    /**
     * Returns a transaction's receipt.
     *
     * @deprecated Use {@link getTransaction} instead, which returns a normalized, finality-based receipt. The native receipt fields remain available on each module's extended return type.
     * @abstract
     * @param {string} hash - The transaction's hash.
     * @returns {Promise<unknown | null>} The receipt, or null if the transaction has not been included in a block yet.
     * @throws {ValueError} If the hash is not valid.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the transaction's receipt.
     */
    abstract getTransactionReceipt(hash: string): Promise<unknown | null>;
    /**
     * Returns a normalized, finality-based receipt for a transaction.
     *
     * @abstract
     * @param {string} hash - The transaction's identifier (hash / signature / lt:hash).
     * @returns {Promise<TransactionReceipt>} The normalized receipt.
     * @throws {ValueError} If the hash is not a valid identifier.
     * @throws {NoSuchElementError} If no transaction has been found for the given hash.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the transaction.
     */
    abstract getTransaction(hash: string): Promise<TransactionReceipt>;
    /**
     * Blocks until a transaction reaches a terminal state (the requested finality
     * target or `dropped`), or times out.
     *
     * The polling loop and target resolution are chain-agnostic: this method only
     * interprets the normalized receipt returned by {@link getTransaction}. A
     * {@link NoSuchElementError} is treated as a transient not-found, so the loop
     * keeps polling until the timeout.
     *
     * @param {string} hash - The transaction's identifier.
     * @param {WaitForTransactionOptions} [options] - The wait options.
     * @returns {Promise<TransactionReceipt>} The terminal receipt: the finality target reached (inspect `success` to tell success from revert), or `dropped`.
     * @throws {ValueError} If the hash is not a valid identifier.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the transaction.
     * @throws {TimeoutError} If the operation times out.
     */
    waitForTransaction(hash: string, options?: WaitForTransactionOptions): Promise<TransactionReceipt>;
}
export type Finality = import("./wallet-account-read-only-simple.js").Finality;
export type TransactionReceipt = import("./wallet-account-read-only-simple.js").TransactionReceipt;
export type WaitForTransactionOptions = import("./wallet-account-read-only-simple.js").WaitForTransactionOptions;
export type InvalidTokenError = import("./errors.js").InvalidTokenError;
export type ProviderRequiredError = import("./errors.js").ProviderRequiredError;
export type TransactionError = import("./errors.js").TransactionError;
export type TransferError = import("./errors.js").TransferError;
export type ValueError = import("./errors.js").ValueError;
export type Transaction = {
    /**
     * - The transaction's recipient.
     */
    to: string;
    /**
     * - The amount of native tokens to send to the recipient (in base unit).
     */
    value: number | bigint;
};
export type TransactionResult = {
    /**
     * - The transaction's hash.
     */
    hash: string;
    /**
     * - The gas cost.
     */
    fee: bigint;
};
export type TransferOptions = {
    /**
     * - The address of the token to transfer.
     */
    token: string;
    /**
     * - The address of the recipient.
     */
    recipient: string;
    /**
     * - The amount of tokens to transfer to the recipient (in base units).
     */
    amount: number | bigint;
};
export type TransferResult = {
    /**
     * - The hash of the transfer operation.
     */
    hash: string;
    /**
     * - The gas cost.
     */
    fee: bigint;
};
import { IWalletAccountReadOnlySimple } from './wallet-account-read-only-simple.js';
