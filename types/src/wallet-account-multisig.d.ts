/**
 * @typedef {Object} MultisigResult
 * @property {string} proposalId - Unique identifier for the created proposal
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold for execution
 */
/**
 * @typedef {Object} MultisigExecuteResult
 * @property {string} hash - The finalized on-chain transaction identifier
 */
/** @interface */
export class IWalletAccountMultisig extends IWalletAccountMultisigReadOnly {
    /**
     * Creates a new proposal for a transaction.
     * The proposer's signature is included automatically.
     *
     *
     * @param {import('./wallet-account-read-only.js').Transaction} tx - The transaction to propose
     * @returns {Promise<MultisigResult>} The proposal result
     */
    propose(tx: import("./wallet-account-read-only.js").Transaction): Promise<MultisigResult>;
    /**
     * Adds the current signer's approval to an existing proposal.
     *
     * @param {string} proposalId - The proposal identifier to approve
     * @returns {Promise<MultisigResult>} The approval result
     */
    approve(proposalId: string): Promise<MultisigResult>;
    /**
     * Rejects a pending proposal.
     * Behavior is chain-specific: some chains support on-chain rejection,
     * others may create a competing proposal or simply record disapproval.
     *
     * @param {string} proposalId - The proposal identifier to reject
     * @returns {Promise<MultisigResult>} The rejection result
     */
    reject(proposalId: string): Promise<MultisigResult>;
    /**
     * Submits a fully-signed proposal for on-chain execution.
     *
     * @param {string} proposalId - The proposal identifier to execute
     * @returns {Promise<MultisigExecuteResult>} The transaction hash
     */
    execute(proposalId: string): Promise<MultisigExecuteResult>;
    /**
     * Proposes adding a new owner to the multisig.
     * throw NotImplementedError if not supported.
     *
     * @param {string} owner - The new owner's identifier (address/pubkey)
     * @param {number} [newThreshold] - Optional new threshold
     * @returns {Promise<MultisigResult>} The proposal result
     */
    addOwner(owner: string, newThreshold?: number): Promise<MultisigResult>;
    /**
     * Proposes removing an owner from the multisig.
     *
     * @param {string} owner - The owner's identifier to remove
     * @param {number} [newThreshold] - Optional new threshold
     * @returns {Promise<MultisigResult>} The proposal result
     */
    removeOwner(owner: string, newThreshold?: number): Promise<MultisigResult>;
    /**
     * Proposes replacing one owner with another.
     *
     * @param {string} oldOwner - The owner to replace
     * @param {string} newOwner - The replacement owner
     * @returns {Promise<MultisigResult>} The proposal result
     */
    swapOwner(oldOwner: string, newOwner: string): Promise<MultisigResult>;
    /**
     * Proposes changing the signature threshold.
     *
     * @param {number} newThreshold - The new threshold
     * @returns {Promise<MultisigResult>} The proposal result
     */
    changeThreshold(newThreshold: number): Promise<MultisigResult>;
}
export type MultisigResult = {
    /**
     * - Unique identifier for the created proposal
     */
    proposalId: string;
    /**
     * - Number of confirmations
     */
    confirmations: number;
    /**
     * - Required threshold for execution
     */
    threshold: number;
};
export type MultisigExecuteResult = {
    /**
     * - The finalized on-chain transaction identifier
     */
    hash: string;
};
import { IWalletAccountMultisigReadOnly } from './wallet-account-multisig-read-only.js';
