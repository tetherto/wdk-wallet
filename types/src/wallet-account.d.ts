/** @interface */
export interface IWalletAccount<TSignedTransaction = unknown> extends IWalletAccountReadOnly {
    /**
     * The derivation path's index of this account, or undefined if the account's
     * signer is not bound to a BIP-44 position (e.g. private-key signers).
     *
     * @type {number | undefined}
     */
    get index(): number | undefined;
    /**
     * The derivation path of this account (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)),
     * or undefined if the account's signer is not bound to a BIP-44 position (e.g. private-key signers).
     *
     * @type {string | undefined}
     */
    get path(): string | undefined;
    /**
     * The account's key pair, or null if the account's signer does not allow
     * retrieving key material (e.g. hardware signers).
     *
     * @type {KeyPair | null}
     */
    get keyPair(): KeyPair | null;
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
     * @overload
     * @param {Transaction | TSignedTransaction} tx - The transaction.
     * @returns {Promise<TransactionResult>} The transaction's result.
     */
    sendTransaction(tx: Transaction | TSignedTransaction): Promise<TransactionResult>;
    /**
     * Quotes the costs of a send transaction operation.
     *
     * @overload
     * @param {Transaction | TSignedTransaction} tx - The transaction.
     * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
     */
    quoteSendTransaction(tx: Transaction | TSignedTransaction): Promise<Omit<TransactionResult, "hash">>;
    /**
     * Transfers a token to another address.
     *
     * @param {TransferOptions} options - The transfer's options.
     * @returns {Promise<TransferResult>} The transfer's result.
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
