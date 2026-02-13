/**
 * A chain-agnostic proposal object representing a pending multisig transaction.
 *
 * @typedef {Object} MultisigProposal
 * @property {string} proposalId - Unique identifier for the created proposal
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold for execution
 */
/**
 * @typedef {Object} MessageInfo
 * @property {string} messageHash - The message hash
 * @property {string} message - The original message
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold
 * @property {string | null} combinedSignature - Final combined signature when threshold is met
 */
/** @interface */
export class IWalletAccountMultisigReadOnly {
    /**
     * Returns the address/identifier of the signer associated with this account
     * (the individual key, not the multisig address).
     * Returns null if no signer is associated.
     *
     * @returns {Promise<string | null>} The signer's identifier
     */
    getSignerAddress(): Promise<string | null>;
    /**
     * Returns the list of owners/co-signers of the multisig wallet.
     * The format of each entry is chain-specific (address, pubkey, etc).
     *
     * @returns {Promise<string[]>} Array of owner identifiers
     */
    getOwners(): Promise<string[]>;
    /**
     * Returns the number of required signatures to execute a transaction.
     *
     * @returns {Promise<number>} The threshold
     */
    getThreshold(): Promise<number>;
    /**
     * Returns a proposal by its identifier.
     *
     * @param {string} proposalId - The proposal identifier
     * @returns {Promise<MultisigProposal | null>} The proposal details, or null if not found
     */
    getProposal(proposalId: string): Promise<MultisigProposal | null>;
    /**
     * Returns a message proposal by its hash.
     *
     * @param {string} messageHash - The message hash
     * @returns {Promise<MessageInfo | null>} The message info or null if not found
     */
    getMessage(messageHash: string): Promise<MessageInfo | null>;
}
/**
 * A chain-agnostic proposal object representing a pending multisig transaction.
 */
export type MultisigProposal = {
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
export type MessageInfo = {
    /**
     * - The message hash
     */
    messageHash: string;
    /**
     * - The original message
     */
    message: string;
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
