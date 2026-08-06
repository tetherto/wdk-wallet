/** @interface */
export interface IWalletAccountMultisig extends IWalletAccountReadOnlyMultisig {
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
     * The key pair of this account.
     *
     * @type {KeyPair}
     */
    get keyPair(): KeyPair;
    /**
     * Returns the address of the multisig wallet.
     *
     * @returns {Promise<string>} The multisig wallet's address.
     */
    getMultisigAddress(): Promise<string>; 
    /**
     * Proposes sending a transaction for the other owners to approve. Does not execute on-chain:
     * the returned proposal must be approved up to the threshold and then executed via
     * {@link executeProposal}.
     *
     * @param {Transaction} tx - The transaction.
     * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
     * @returns {Promise<MultisigProposal>} The created proposal; its `status` is `'executed'` when `autoExecute` ran to completion, otherwise `'pending'`.
     * @throws {Error} If the account is not an owner of the multisig wallet.
     */
    propose(tx: Transaction, transactionOptions?: MultisigTransactionOptions): Promise<MultisigProposal>;
    /**
     * Proposes signing a message.
     *
     * @param {string} message - The message to sign.
     * @returns {Promise<MultisigMessageProposal & MultisigSignature>} The multisig message proposal.
     * @throws {Error} If the account is not an owner of the multisig wallet.
     */
    proposeMessage(message: string): Promise<MultisigMessageProposal & MultisigSignature>;
    /**
     * Approves an existing message proposal.
     *
     * @param {string} messageId - The message's hash.
     * @returns {Promise<MultisigMessageProposal & MultisigSignature>} The multisig message proposal.
     * @throws {Error} If the account is not an owner of the multisig wallet.
     * @throws {NoSuchElementError} If no message exists for the given id.
     */
    approveMessageProposal(messageId: string): Promise<MultisigMessageProposal & MultisigSignature>;
    /**
     * Approves a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {Error} If the account is not an owner of the multisig wallet.
     * @throws {NoSuchElementError} If no proposal exists for the given id.
     */
    approveProposal(proposalId: string): Promise<MultisigProposal>;
    /**
     * Rejects a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {NoSuchElementError} If no proposal exists for the given id.
     */
    rejectProposal(proposalId: string): Promise<MultisigProposal>;
    /**
     * Submits an approved proposal for on-chain execution.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<TransactionResult>} The on-chain transaction's result.
     * @throws {NoSuchElementError} If no proposal exists for the given id.
     * @throws {ValueError} If the proposal has not reached the approval threshold.
     */
    executeProposal(proposalId: string): Promise<TransactionResult>;
}
export type Transaction = import("../wallet-account-read-only.js").Transaction;
export type TransactionResult = import("../wallet-account-read-only.js").TransactionResult;
export type IWalletAccountReadOnlyMultisig = import("./wallet-account-read-only-multisig.js").IWalletAccountReadOnlyMultisig;
export type MultisigProposal = import("./wallet-account-read-only-multisig.js").MultisigProposal;
export type KeyPair = import("../wallet-account.js").KeyPair;
export type MultisigTransactionOptions = {
    /**
     * - If true, automatically executes the transaction when the approval threshold is met (only takes effect if this signer's approval is the last one required).
     */
    autoExecute?: boolean;
};
export type MultisigSignature = {
    /**
     * - The caller's signature.
     */
    signature: string;
};
export type MultisigMessageProposal = import("./wallet-account-read-only-multisig.js").MultisigMessageProposal;
