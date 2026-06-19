/**
 * @interface
 * @extends {IWalletAccountReadOnlyMultisig}
 */
export interface IWalletAccountMultisig extends IWalletAccountReadOnlyMultisig {
    /**
     * The derivation path's index of the signer associated with this account.
     *
     * @type {number}
     */
    get index(): number;
    /**
     * The derivation path of the signer associated with this account (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
     *
     * @type {string}
     */
    get path(): string;
    /**
     * The key pair of the signer associated with this account.
     *
     * @type {KeyPair}
     */
    get signerKeyPair(): KeyPair;
    /**
     * Proposes sending a transaction for the other owners to approve. Does not execute on-chain:
     * the returned proposal must be approved up to the threshold and then executed via
     * {@link executeProposal}.
     *
     * @param {Transaction} tx - The transaction.
     * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
     * @returns {Promise<MultisigProposal>} The created proposal; its `status` is `'executed'` when `autoExecute` ran to completion, otherwise `'pending'`.
     */
    propose(tx: Transaction, transactionOptions?: MultisigTransactionOptions): Promise<MultisigProposal>;
    /**
     * Proposes transferring a token to another address for the other owners to approve. Does not
     * execute on-chain; see {@link propose}.
     *
     * @param {TransferOptions} options - The transfer's options.
     * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
     * @returns {Promise<MultisigProposal>} The created proposal; its `status` is `'executed'` when `autoExecute` ran to completion, otherwise `'pending'`.
     */
    proposeTransfer(options: TransferOptions, transactionOptions?: MultisigTransactionOptions): Promise<MultisigProposal>;
    /**
     * Proposes signing a message.
     *
     * @param {string} message - The message to sign.
     * @returns {Promise<MultisigMessageProposal>} The multisig message proposal.
     */
    proposeMessage(message: string): Promise<MultisigMessageProposal>;
    /**
     * Approves an existing message proposal.
     *
     * @param {string} messageId - The message's hash.
     * @returns {Promise<MultisigMessageProposal>} The multisig message proposal.
     */
    approveMessage(messageId: string): Promise<MultisigMessageProposal>;
    /**
     * Approves a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     */
    approveProposal(proposalId: string): Promise<MultisigProposal>;
    /**
     * Rejects a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     */
    rejectProposal(proposalId: string): Promise<MultisigProposal>;
    /**
     * Submits an approved proposal for on-chain execution.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<TransactionResult>} The on-chain transaction's result.
     */
    executeProposal(proposalId: string): Promise<TransactionResult>;
}
export type Transaction = import("../wallet-account-read-only.js").Transaction;
export type TransferOptions = import("../wallet-account-read-only.js").TransferOptions;
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
export type MultisigMessageProposal = {
    /**
     * - The message's hash.
     */
    messageId: string;
    /**
     * - The signature of the caller.
     */
    signature: string;
    /**
     * - The current number of confirmations.
     */
    confirmations: number;
    /**
     * - The minimum amount of confirmations to sign the message.
     */
    threshold: number;
    /**
     * - The final combined signature when the threshold is met.
     */
    combinedSignature: string | null;
};
