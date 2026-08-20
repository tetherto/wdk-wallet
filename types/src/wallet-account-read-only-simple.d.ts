/**
 * The read-only members shared by every wallet account, single-signer or multisig.
 *
 * This is an internal base interface: it is not exported from the package entry point.
 * Consumers use {@link IWalletAccountReadOnly} or {@link IWalletAccountReadOnlyMultisig},
 * which both extend it.
 *
 * @interface
 */
export interface IWalletAccountReadOnlySimple {
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
     * @returns {Promise<bigint>} The native token balance.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the account's balance.
     */
    getBalance(): Promise<bigint>;
    /**
     * Returns the account balance for a specific token.
     *
     * @param {string} tokenAddress - The smart contract address of the token.
     * @returns {Promise<bigint>} The token balance.
     * @throws {ValueError} If the token's address is not valid.
     * @throws {InvalidTokenError} If the token's address doesn't match an existing ERC 20 token.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the account's token balance.
     */
    getTokenBalance(tokenAddress: string): Promise<bigint>;
    /**
     * Returns a transaction's receipt.
     *
     * @deprecated Use {@link getTransaction} instead, which returns a normalized, finality-based receipt. The native receipt fields remain available on each module's extended return type.
     * @param {string} hash - The transaction's hash.
     * @returns {Promise<unknown | null>} The receipt, or null if the transaction has not been included in a block yet.
     * @throws {ValueError} If the hash is not valid.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the transaction's receipt.
     */
    getTransactionReceipt(hash: string): Promise<unknown | null>;
    /**
     * Returns a normalized, finality-based receipt for a transaction.
     *
     * @param {string} hash - The transaction's identifier (hash / signature / lt:hash).
     * @returns {Promise<TransactionReceipt>} The normalized receipt.
     * @throws {ValueError} If the hash is not a valid identifier.
     * @throws {NoSuchElementError} If no transaction has been found for the given hash.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the transaction.
     */
    getTransaction(hash: string): Promise<TransactionReceipt>;
    /**
     * Blocks until a transaction reaches a terminal state (the requested finality target or `dropped`), or times out.
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
export type InvalidTokenError = import("./errors.js").InvalidTokenError;
export type NoSuchElementError = import("./errors.js").NoSuchElementError;
export type ProviderError = import("./errors.js").ProviderError;
export type ProviderRequiredError = import("./errors.js").ProviderRequiredError;
export type TimeoutError = import("./errors.js").TimeoutError;
export type ValueError = import("./errors.js").ValueError;
export type UnsupportedOperationError = import("./errors.js").UnsupportedOperationError;
/**
 * A normalized, cross-chain transaction finality level.
 *
 * - `pending`: seen, not settled (mempool / processed / in-flight).
 * - `confirmed`: settled, reversible only under extreme conditions.
 * - `final`: irreversible per the chain's own guarantees.
 * - `dropped`: evicted / replaced, never landed.
 */
export type Finality = "pending" | "confirmed" | "final" | "dropped";
/**
 * A normalized, cross-chain transaction receipt. Blockchain modules extend this
 * type with their own native receipt fields (e.g. `confirmations`, the raw
 * transaction and receipt objects, etc.).
 */
export type TransactionReceipt = {
    /**
     * - The transaction's identifier (hash / signature / lt:hash).
     */
    hash: string;
    /**
     * - The transaction's finality level.
     */
    finality: Finality;
    /**
     * - The execution's result (not set if the transaction is still pending or it has been dropped).
     */
    success?: boolean;
    /**
     * - A reference to the including block (block number / height / slot / masterchain seqno).
     */
    block?: number;
    /**
     * - The fee paid, when known.
     */
    fee?: bigint;
};
/**
 * The finality level to wait for.
 */
export type WaitForTransactionTarget = "confirmed" | "final";
export type WaitForTransactionOptions = {
    /**
     * - The finality target to wait for (default: 'confirmed').
     */
    target?: WaitForTransactionTarget;
    /**
     * - The total time budget in milliseconds before giving up. If omitted, the account's `defaultWaitTimeout` is used.
     */
    timeout?: number;
    /**
     * - The poll cadence in milliseconds. If omitted, the account's `defaultWaitInterval` is used.
     */
    interval?: number;
    /**
     * - How many consecutive getTransaction() failures to tolerate before rethrowing (default: 3).
     */
    maxPollErrors?: number;
};
