/** @interface */
export interface IWalletAccountReadOnlyMultisig extends IWalletAccountReadOnlyBase {
    /**
     * Returns the address of the signer associated with this wallet account.
     *
     * @returns {Promise<string | null>} The signer's address, or null if no signer is associated yet.
     */
    getSignerAddress(): Promise<string | null>;
    /**
     * Returns the multisig wallet account info.
     *
     * @returns {Promise<MultisigInfo>} The info.
    */
    getMultisigInfo(): Promise<MultisigInfo>;
    /**
     * Returns a list of proposals by their identifiers.
     *
     * @param {string[]} proposalIds - The list of proposal identifiers.
     * @returns {Promise<(MultisigProposal | null)[]>} For each proposal id, the proposal details or
     *   null if the proposal has not been found.
     */
    getProposals(proposalIds: string[]): Promise<(MultisigProposal | null)[]>;
    /**
     * Returns a list of message proposals by their hashes.
     *
     * @param {string[]} messageHashes - The list of message hashes
     * @returns {Promise<(MultisigMessage | null)[]>} For each message hash, the message details or
     *   null if the message has not been found.
     */
    getMessages(messageHashes: string[]): Promise<(MultisigMessage | null)[]>;
    /**
     * Quotes the on-chain cost of executing a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<MultisigExecuteQuote>} The execution cost estimate.
     */
    quoteExecuteProposal(proposalId: string): Promise<MultisigExecuteQuote>;
}
export type MultisigInfo = {
    /**
     * - The multisig wallet account address.
     */
    address: string;
    /**
     * - The owners of the multisig wallet account.
     */
    owners: string[];
    /**
     * - The minimum amount of signatures to execute a transaction.
     */
    threshold: number;
    /**
     * - True if the multisig wallet account has already been created.
     */
    isCreated?: boolean;
};
export type MultisigProposal = {
    /**
     * - The proposal's id.
     */
    proposalId: string;
    /**
     * - The current number of confirmations.
     */
    confirmations: number;
    /**
     * - The minimum amount of confirmations to execute the transaction.
     */
    threshold: number;
};
export type MultisigMessage = {
    /**
     * - The message's hash.
     */
    messageHash: string;
    /**
     * - The original message.
     */
    message: string;
    /**
     * - The current number of confirmations.
     */
    confirmations: number;
    /**
     * -  The minimum amount of confirmations to sign the message.
     */
    threshold: number;
    /**
     * - The final combined signature when the threshold is met.
     */
    combinedSignature: string | null;
};
export type MultisigExecuteQuote = {
    /**
     * - The estimated gas cost of executing the proposal on-chain.
     */
    fee: bigint;
};
import { IWalletAccountReadOnlyBase } from '../wallet-account-read-only-base.js';
