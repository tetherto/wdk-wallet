/** @typedef {import('./wallet-account-read-only.js').Transaction} Transaction */
/** @typedef {import('./wallet-account-read-only.js').TransferOptions} TransferOptions */
/** @typedef {import('./wallet-account-read-only-multisig.js').MultisigProposal} MultisigResult */
/**
 * @typedef {Object} MultisigTransactionResult
 * @property {string} proposalId - The proposal identifier
 * @property {string} hash - The transaction hash
 * @property {bigint} fee - The transaction fee or estimated fee
 * @property {number} confirmations - Current number of confirmations
 * @property {number} threshold - Required threshold for execution
 * @property {boolean} executed - Whether the transaction was executed on-chain
 */
/**
 * @typedef {Object} MultisigExecuteResult
 * @property {string} hash - The transaction hash
 * @property {bigint} [fee] - The transaction fee
 */
/**
 * @typedef {Object} MultisigSendOptions
 * @property {boolean} [autoExecute] - If true, automatically execute the transaction when the approval threshold is met. Only takes effect if this signer's approval is the final one required. Otherwise the transaction must be executed manually via `executeTx()`.
 */
/**
 * @typedef {Object} MessageProposal
 * @property {string} messageHash - Unique identifier for the message proposal
 * @property {string} signature - This signer's signature
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold
 * @property {string | null} combinedSignature - Final combined signature when threshold is met
 */
/**
 * @typedef {Object} MultisigOptions
 * @property {number} threshold - The number of approvals required to execute a transaction.
 */
/**
 * @interface
 * @extends {IWalletAccount}
 * @extends {IWalletAccountReadOnlyMultisig}
 */
export interface IWalletAccountMultisig extends IWalletAccount, IWalletAccountReadOnlyMultisig {
    /**
     * Proposes sending a transaction.
     * The transaction will be sent automatically once the approval threshold is met
     * if autoExecute option is enabled.
     *
     * @param {Transaction} tx - The transaction
     * @param {MultisigSendOptions} [options] - The multisig send options
     * @returns {Promise<MultisigTransactionResult>} The transaction result
     */
    sendTransaction(tx: Transaction, options?: MultisigSendOptions): Promise<MultisigTransactionResult>;
    /**
     * Proposes transferring a token to another address.
     * The transfer will be executed automatically once the approval threshold is met
     * if autoExecute option is enabled.
     *
     * @param {TransferOptions} options - The transfer options
     * @param {MultisigSendOptions} [sendOptions] - The multisig send options
     * @returns {Promise<MultisigTransactionResult>} The transfer result
     */
    transfer(options: TransferOptions, sendOptions?: MultisigSendOptions): Promise<MultisigTransactionResult>;
    /**
     * Proposes signing a message with the multisig.
     * The proposer's signature is included automatically.
     *
     * @param {string} message - The message to sign
     * @returns {Promise<MessageProposal>} The message proposal result
     */
    proposeMessage(message: string): Promise<MessageProposal>;
    /**
     * Approves an existing message proposal.
     *
     * @param {string} messageHash - The message hash to approve
     * @returns {Promise<MessageProposal>} The approval result
     */
    approveMessage(messageHash: string): Promise<MessageProposal>;
    /**
     * Adds the current signer's approval to an existing proposal.
     *
     * @param {string} proposalId - The proposal identifier to approve
     * @returns {Promise<MultisigResult>} The approval result
     */
    approveTx(proposalId: string): Promise<MultisigResult>;
    /**
     * Rejects a pending proposal.
     * Behavior is chain-specific: some chains support on-chain rejection,
     * others may create a competing proposal or simply record disapproval.
     *
     * @param {string} proposalId - The proposal identifier to reject
     * @returns {Promise<MultisigResult>} The rejection result
     */
    rejectTx(proposalId: string): Promise<MultisigResult>;
    /**
     * Submits a fully-signed proposal for on-chain execution.
     *
     * @param {string} proposalId - The proposal identifier to execute
     * @returns {Promise<MultisigExecuteResult>} The execution result
     */
    executeTx(proposalId: string): Promise<MultisigExecuteResult>;
    /**
     * Proposes adding a new owner to the multisig.
     *
     * @param {string} owner - The new owner's identifier (address/pubkey).
     * @param {MultisigOptions} [options] - The new multisig options.
     * @returns {Promise<MultisigResult>} The proposal result.
     * @throws {Error} If the operation is not supported.
     */
    addOwner(owner: string, options?: MultisigOptions): Promise<MultisigResult>;
    /**
     * Proposes removing an owner from the multisig.
     *
     * @param {string} owner - The owner's identifier to remove
     * @param {MultisigOptions} [options] - The new multisig options.
     * @returns {Promise<MultisigResult>} The proposal result
     * @throws {Error} If the operation is not supported.
     */
    removeOwner(owner: string, options?: MultisigOptions): Promise<MultisigResult>;
    /**
     * Proposes replacing one owner with another.
     *
     * @param {string} oldOwner - The owner to replace
     * @param {string} newOwner - The replacement owner
     * @returns {Promise<MultisigResult>} The proposal result
     * @throws {Error} If the operation is not supported.
     */
    swapOwner(oldOwner: string, newOwner: string): Promise<MultisigResult>;
    /**
     * Proposes changing the signature threshold.
     *
     * @param {number} newThreshold - The new threshold
     * @returns {Promise<MultisigResult>} The proposal result
     * @throws {Error} If the operation is not supported.
     */
    changeThreshold(newThreshold: number): Promise<MultisigResult>;
}
export type Transaction = import("./wallet-account-read-only.js").Transaction;
export type TransferOptions = import("./wallet-account-read-only.js").TransferOptions;
export type MultisigResult = import("./wallet-account-read-only-multisig.js").MultisigProposal;
export type MultisigTransactionResult = {
    /**
     * - The proposal identifier
     */
    proposalId: string;
    /**
     * - The transaction hash
     */
    hash: string;
    /**
     * - The transaction fee or estimated fee
     */
    fee: bigint;
    /**
     * - Current number of confirmations
     */
    confirmations: number;
    /**
     * - Required threshold for execution
     */
    threshold: number;
    /**
     * - Whether the transaction was executed on-chain
     */
    executed: boolean;
};
export type MultisigExecuteResult = {
    /**
     * - The transaction hash
     */
    hash: string;
    /**
     * - The transaction fee
     */
    fee?: bigint;
};
export type MultisigSendOptions = {
    /**
     * - If true, automatically execute the transaction when the approval threshold is met. Only takes effect if this signer's approval is the final one required. Otherwise the transaction must be executed manually via `executeTx()`.
     */
    autoExecute?: boolean;
};
export type MessageProposal = {
    /**
     * - Unique identifier for the message proposal
     */
    messageHash: string;
    /**
     * - This signer's signature
     */
    signature: string;
    /**
     * - Number of confirmations
     */
    confirmations: number;
    /**
     * - Required threshold
     */
    threshold: number;
    /**
     * - Final combined signature when threshold is met
     */
    combinedSignature: string | null;
};
export type MultisigOptions = {
    /**
     * - The number of approvals required to execute a transaction.
     */
    threshold: number;
};
import { IWalletAccountReadOnlyMultisig } from './wallet-account-read-only-multisig.js';
import { IWalletAccount } from './wallet-account.js';
