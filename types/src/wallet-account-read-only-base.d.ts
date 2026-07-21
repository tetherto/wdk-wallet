/**
 * The read-only members shared by every wallet account, single-signer or multisig.
 *
 * This is an internal base interface: it is not exported from the package entry point.
 * Consumers use {@link IWalletAccountReadOnly} or {@link IWalletAccountReadOnlyMultisig},
 * which both extend it.
 *
 * @interface
 */
export interface IWalletAccountReadOnlyBase {
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
     * Returns a transaction's receipt.
     *
     * @param {string} hash - The transaction's hash.
     * @returns {Promise<unknown | null>} The receipt, or null if the transaction has not been included in a block yet.
     */
    getTransactionReceipt(hash: string): Promise<unknown | null>;
}
