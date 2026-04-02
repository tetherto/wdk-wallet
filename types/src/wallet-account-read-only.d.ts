/** @interface */
export interface IWalletAccountReadOnly {
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
     * @throws {Error} If the read-only wallet account class is not able to provide an implementation for the method.
     */
    verify(message: string, signature: string): Promise<boolean>;
    /**
     * Returns the account's native token balance.
     *
     * @returns {Promise<bigint>} The native token balance.
     */
    getBalance(): Promise<bigint>;
    /**
     * Returns the account balance for a specific token.
     *
     * @param {string} tokenAddress - The smart contract address of the token.
     * @returns {Promise<bigint>} The token balance.
     */
    getTokenBalance(tokenAddress: string): Promise<bigint>;
    /**
     * Quotes the costs of a send transaction operation.
     *
     * @param {Transaction} tx - The transaction.
     * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
     */
    quoteSendTransaction(tx: Transaction): Promise<Omit<TransactionResult, "hash">>;
    /**
     * Quotes the costs of a transfer operation.
     *
     * @param {TransferOptions} options - The transfer's options.
     * @returns {Promise<Omit<TransferResult, 'hash'>>} The transfer's quotes.
     */
    quoteTransfer(options: TransferOptions): Promise<Omit<TransferResult, "hash">>;
    /**
     * Returns a transaction's receipt.
     *
     * @param {string} hash - The transaction's hash.
     * @returns {Promise<unknown | null>} The receipt, or null if the transaction has not been included in a block yet.
     */
    getTransactionReceipt(hash: string): Promise<unknown | null>;
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
     * @abstract
     * @param {string} message - The original message.
     * @param {string} signature - The signature to verify.
     * @returns {Promise<boolean>} True if the signature is valid.
     * @throws {Error} If the read-only wallet account class is not able to provide an implementation for the method.
     */
    abstract verify(message: string, signature: string): Promise<boolean>;
    /**
     * Returns the account's native token balance.
     *
     * @abstract
     * @returns {Promise<bigint>} The native token balance.
     */
    abstract getBalance(): Promise<bigint>;
    /**
     * Returns the account balance for a specific token.
     *
     * @abstract
     * @param {string} tokenAddress - The smart contract address of the token.
     * @returns {Promise<bigint>} The token balance.
     */
    abstract getTokenBalance(tokenAddress: string): Promise<bigint>;
    /**
     * Quotes the costs of a send transaction operation.
     *
     * @abstract
     * @param {Transaction} tx - The transaction.
     * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
     */
    abstract quoteSendTransaction(tx: Transaction): Promise<Omit<TransactionResult, "hash">>;
    /**
     * Quotes the costs of a transfer operation.
     *
     * @abstract
     * @param {TransferOptions} options - The transfer's options.
     * @returns {Promise<Omit<TransferResult, 'hash'>>} The transfer's quotes.
     */
    abstract quoteTransfer(options: TransferOptions): Promise<Omit<TransferResult, "hash">>;
    /**
     * Returns a transaction's receipt.
     *
     * @abstract
     * @param {string} hash - The transaction's hash.
     * @returns {Promise<unknown | null>} The receipt, or null if the transaction has not been included in a block yet.
     */
    abstract getTransactionReceipt(hash: string): Promise<unknown | null>;
}
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
