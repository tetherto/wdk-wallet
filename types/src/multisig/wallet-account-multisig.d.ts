/**
 * @interface
 * @extends {IWalletAccount}
 * @extends {IWalletAccountReadOnlyMultisig}
 */
export interface IWalletAccountMultisig extends IWalletAccount, IWalletAccountReadOnlyMultisig {
    /**
     * Proposes sending a transaction.
     *
     * @param {Transaction} tx - The transaction.
     * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
     * @returns {Promise<MultisigTransactionResult>} The transaction's result.
     */
    sendTransaction(tx: Transaction, transactionOptions?: MultisigTransactionOptions): Promise<MultisigTransactionResult>;
    /**
     * Proposes transferring a token to another address.
     *
     * @param {TransferOptions} options - The transfer's options.
     * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
     * @returns {Promise<MultisigTransactionResult>} The transfer's result.
     */
    transfer(options: TransferOptions, transactionOptions?: MultisigTransactionOptions): Promise<MultisigTransactionResult>;
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
     * @param {string} messageHash - The message's hash.
     * @returns {Promise<MultisigMessageProposal>} The multisig message proposal.
     */
    approveMessage(messageHash: string): Promise<MultisigMessageProposal>;
    /**
     * Approves a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     */
    approveTx(proposalId: string): Promise<MultisigProposal>;
    /**
     * Rejects a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     */
    rejectTx(proposalId: string): Promise<MultisigProposal>;
    /**
     * Submits a proposal for on-chain execution.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<TransactionResult>} The transaction's result.
     */
    executeTx(proposalId: string): Promise<TransactionResult>;
    /**
     * Proposes adding a new owner to the multisig wallet account.
     *
     * @param {string} owner - The owner's address.
     * @param {MultisigOptions} [options] - The multisig options.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {Error} If the operation is not supported.
     */
    addOwner(owner: string, options?: MultisigOptions): Promise<MultisigProposal>;
    /**
     * Proposes removing an owner from the multisig wallet account.
     *
     * @param {string} owner - The owner's address.
     * @param {MultisigOptions} [options] - The multisig options.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {Error} If the operation is not supported.
     */
    removeOwner(owner: string, options?: MultisigOptions): Promise<MultisigProposal>;
    /**
     * Proposes replacing an owner with a different one.
     *
     * @param {string} oldOwner - The old owner.
     * @param {string} newOwner - The new owner.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {Error} If the operation is not supported.
     */
    swapOwner(oldOwner: string, newOwner: string): Promise<MultisigProposal>;
    /**
     * Proposes changing the signature threshold.
     *
     * @param {number} newThreshold - The new threshold.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {Error} If the operation is not supported.
     */
    changeThreshold(newThreshold: number): Promise<MultisigProposal>;
}
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
export type Transaction = import("../wallet-account-read-only.js").Transaction;
export type TransferOptions = import("../wallet-account-read-only.js").TransferOptions;
export type TransactionResult = import("../wallet-account-read-only.js").TransactionResult;
export type IWalletAccountReadOnlyMultisig = import("./wallet-account-read-only-multisig.js").IWalletAccountReadOnlyMultisig;
export type MultisigProposal = import("./wallet-account-read-only-multisig.js").MultisigProposal;
export type MultisigTransactionResult = {
    /**
     * - The proposal's id.
     */
    proposalId: string;
    /**
     * - The transaction's hash.
     */
    hash: string;
    /**
     * - The gas cost.
     */
    fee: bigint;
    /**
     * - The current number of confirmations.
     */
    confirmations: number;
    /**
     * - The minimum amount of confirmations to execute the transaction.
     */
    threshold: number;
    /**
     * - True if the transaction has already been executed.
     */
    executed: boolean;
};
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
    messageHash: string;
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
export type MultisigOptions = {
    /**
     * - The new amount of approvals required to execute a transaction.
     */
    threshold: number;
};
