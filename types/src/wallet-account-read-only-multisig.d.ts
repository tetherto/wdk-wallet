/**
 * @typedef {Object} MultisigInfo
 * @property {string} address - The multisig address
 * @property {string[]} owners - Array of owner identifiers
 * @property {number} threshold - Required number of signatures
 * @property {boolean} [isCreated] - Whether the multisig wallet has been created
 */
/**
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
export interface IWalletAccountReadOnlyMultisig extends IWalletAccountReadOnly {
    /**
     * Returns the address/identifier of the signer associated with this account wallet
     * Returns null if no signer is associated.
     *
     * @returns {Promise<string | null>} The signer's identifier
     */
    getSignerAddress(): Promise<string | null>;
    /**
     * Returns the multisig wallet info.
     *
     * @returns {Promise<MultisigInfo>} The multisig info
    */
    getMultisigInfo(): Promise<MultisigInfo>;
    /**
     * Returns a list of proposals by their identifiers.
     *
     * @param {string[]} proposalIds - The list of proposal identifiers
     * @returns {Promise<(MultisigProposal | null)[]>} The proposal details, or null for proposals not found
     */
    getProposals(proposalIds: string[]): Promise<(MultisigProposal | null)[]>;
    /**
     * Returns a list of message proposals by their hashes.
     *
     * @param {string[]} messageHashes - The list of message hashes
     * @returns {Promise<(MessageInfo | null)[]>} The message details, or null for messages not found
     */
    getMessages(messageHashes: string[]): Promise<(MessageInfo | null)[]>;
}
export type MultisigInfo = {
    /**
     * - The multisig address
     */
    address: string;
    /**
     * - Array of owner identifiers
     */
    owners: string[];
    /**
     * - Required number of signatures
     */
    threshold: number;
    /**
     * - Whether the multisig wallet has been created
     */
    isCreated?: boolean;
};
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
import { IWalletAccountReadOnly } from './wallet-account-read-only.js';
