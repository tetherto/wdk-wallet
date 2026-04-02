/** @interface */
export interface IWalletAccount extends IWalletAccountReadOnly {
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
     * @param {Transaction} tx - The transaction.
     * @returns {Promise<TransactionResult>} The transaction's result.
     */
    sendTransaction(tx: Transaction): Promise<TransactionResult>;
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
