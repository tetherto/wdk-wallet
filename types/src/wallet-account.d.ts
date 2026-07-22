/**
 * @interface
 * @template [TSignedTransaction=unknown]
 */
export interface IWalletAccount<TSignedTransaction = unknown> extends IWalletAccountReadOnly {
    /**
     * The derivation path's index of this account.
     *
     * @type {number}
     */
    get index(): number;
    /**
     * The derivation path of this account (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
     *
     * @type {string}
     */
    get path(): string;
    /**
     * The account's key pair.
     *
     * @type {KeyPair}
     */
    get keyPair(): KeyPair;
    /**
     * Signs a message.
     *
     * @param {string} message - The message to sign.
     * @returns {Promise<string>} The message's signature.
     */
    sign(message: string): Promise<string>;
    /**
     * Signs a transaction.
     *
     * @param {Transaction} tx - The transaction to sign.
     * @returns {Promise<TSignedTransaction>} The signed transaction.
     * @throws {ValueError} If the transaction is not valid.
     */
    signTransaction(tx: Transaction): Promise<TSignedTransaction>;
    /**
     * Verifies a message's signature.
     *
     * @param {string} message - The original message.
     * @param {string} signature - The signature to verify.
     * @returns {Promise<boolean>} True if the signature is valid.
     */
    verify(message: string, signature: string): Promise<boolean>;
    /**
     * Sends a transaction.
     *
     * @param {Transaction | TSignedTransaction} tx - The transaction.
     * @returns {Promise<TransactionResult>} The transaction's result.
     * @throws {ValueError} If the transaction is not valid.
     * @throws {ProviderRequiredError} If the method requires a provider and none is set.
     * @throws {ProviderError} If the provider fails to perform the transaction.
     * @throws {TransactionError} If the transaction fails with an error.
     * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the transaction max. fee option.
     */
    sendTransaction(tx: Transaction | TSignedTransaction): Promise<TransactionResult>;
    /**
     * Quotes the costs of a send transaction operation.
     *
     * @param {Transaction | TSignedTransaction} tx - The transaction.
     * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
     * @throws {ValueError} If the transaction is not valid.
     * @throws {ProviderRequiredError} If the method requires a provider and none is set.
     * @throws {ProviderError} If the provider fails to estimate the costs of the transaction.
     * @throws {TransactionError} If the transaction fails with an error.
     */
    quoteSendTransaction(tx: Transaction | TSignedTransaction): Promise<Omit<TransactionResult, "hash">>;
    /**
     * Transfers a token to another address.
     *
     * @param {TransferOptions} options - The transfer's options.
     * @returns {Promise<TransferResult>} The transfer's result.
     * @throws {ValueError} If the transfer options are not valid.
     * @throws {InvalidTokenError} If the token's address doesn't match an existing ERC 20 token.
     * @throws {ProviderRequiredError} If the method requires a provider and none is set.
     * @throws {ProviderError} If the provider fails to perform the transfer.
     * @throws {TransferError} If the transfer fails with an error.
     * @throws {MaximumFeeExceededError} If the the costs of the transfer exceeds the transfer max. fee option.
     */
    transfer(options: TransferOptions): Promise<TransferResult>;
    /**
     * Returns a read-only copy of the account.
     *
     * @returns {Promise<IWalletAccountReadOnly>} The read-only account.
     */
    toReadOnlyAccount(): Promise<IWalletAccountReadOnly>;
    /**
     * Disposes the wallet account, erasing the private key from the memory.
     */
    dispose(): void;
}
export type Transaction = import("./wallet-account-read-only.js").Transaction;
export type TransactionResult = import("./wallet-account-read-only.js").TransactionResult;
export type TransferOptions = import("./wallet-account-read-only.js").TransferOptions;
export type TransferResult = import("./wallet-account-read-only.js").TransferResult;
export type InvalidTokenError = import("./errors.js").InvalidTokenError;
export type MaximumFeeExceededError = import("./errors.js").MaximumFeeExceededError;
export type ProviderError = import("./errors.js").ProviderError;
export type ProviderRequiredError = import("./errors.js").ProviderRequiredError;
export type TransactionError = import("./errors.js").TransactionError;
export type TransferError = import("./errors.js").TransferError;
export type ValueError = import("./errors.js").ValueError;
export type KeyPair = {
    /**
     * - The public key.
     */
    publicKey: Uint8Array;
    /**
     * - The private key (null if the account has been disposed).
     */
    privateKey: Uint8Array | null;
};
import { IWalletAccountReadOnly } from './wallet-account-read-only.js';
