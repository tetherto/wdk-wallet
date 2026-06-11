/**
 * A message proposal to share with the other owners for them to confirm.
 *
 * @typedef {Object} MultisigTransportMessageInput
 * @property {string} message - The message to sign.
 * @property {string} signature - The submitting owner's signature over the message.
 */
/**
 * A shared transaction proposal returned by the transport. The concrete payload is
 * chain-specific and opaque to the transport: an implementation persists whatever the
 * chain's execution layer produced and returns it intact, alongside the owner
 * confirmations collected so far.
 *
 * @typedef {Object} MultisigTransportProposal
 * @property {unknown[]} confirmations - The owner confirmations (signatures) collected so far.
 */
/**
 * A shared message proposal returned by the transport, alongside the owner confirmations
 * collected so far. As with proposals, any further fields are chain-specific.
 *
 * @typedef {Object} MultisigTransportMessage
 * @property {unknown[]} confirmations - The owner confirmations (signatures) collected so far.
 */
/**
 * Transport for sharing multisig calldata between the owners of a multisig account.
 *
 * A transport distributes transaction proposals and message proposals (and their
 * confirmations) amongst the owners of a multisig account, so that signers running on
 * separate machines can coordinate without a shared process. It is chain-agnostic: the
 * proposal and message payloads are opaque to the transport and interpreted by each
 * chain's multisig package, so the same transport can back account-abstraction, UTXO
 * (PSBT) or other multisig wallets. Plug in a custom backend (a hosted service, a
 * database, a peer-to-peer channel, etc.) by implementing this interface.
 *
 * @interface
 */
export interface IMultisigTransport {
    /**
     * Submits a new transaction proposal so the other owners can confirm it.
     *
     * @param {Record<string, unknown>} proposal - The signed transaction proposal to share. Opaque to the transport, which must persist it so {@link getProposal} can return it intact.
     * @returns {Promise<void>}
     */
    submitProposal(proposal: Record<string, unknown>): Promise<void>;
    /**
     * Returns a transaction proposal by its identifier.
     *
     * @param {string} proposalId - The proposal's identifier.
     * @returns {Promise<MultisigTransportProposal | null>} The proposal, or null if it has not been found.
     */
    getProposal(proposalId: string): Promise<MultisigTransportProposal | null>;
    /**
     * Adds an owner's confirmation (signature) to an existing transaction proposal.
     *
     * @param {string} proposalId - The proposal's identifier.
     * @param {string} signature - The owner's signature over the proposal.
     * @returns {Promise<void>}
     */
    confirmProposal(proposalId: string, signature: string): Promise<void>;
    /**
     * Submits a new message proposal so the other owners can confirm it.
     *
     * @param {string} accountAddress - The multisig account's address.
     * @param {MultisigTransportMessageInput} message - The message proposal to share.
     * @returns {Promise<void>}
     */
    submitMessage(accountAddress: string, message: MultisigTransportMessageInput): Promise<void>;
    /**
     * Returns a message proposal by its hash.
     *
     * @param {string} messageHash - The message's hash.
     * @returns {Promise<MultisigTransportMessage | null>} The message, or null if it has not been found.
     */
    getMessage(messageHash: string): Promise<MultisigTransportMessage | null>;
    /**
     * Adds an owner's confirmation (signature) to an existing message proposal.
     *
     * @param {string} messageHash - The message's hash.
     * @param {string} signature - The owner's signature over the message.
     * @returns {Promise<void>}
     */
    confirmMessage(messageHash: string, signature: string): Promise<void>;
}
/**
 * A message proposal to share with the other owners for them to confirm.
 */
export type MultisigTransportMessageInput = {
    /**
     * - The message to sign.
     */
    message: string;
    /**
     * - The submitting owner's signature over the message.
     */
    signature: string;
};
/**
 * A shared transaction proposal returned by the transport. The concrete payload is
 * chain-specific and opaque to the transport: an implementation persists whatever the
 * chain's execution layer produced and returns it intact, alongside the owner
 * confirmations collected so far.
 */
export type MultisigTransportProposal = {
    /**
     * - The owner confirmations (signatures) collected so far.
     */
    confirmations: unknown[];
};
/**
 * A shared message proposal returned by the transport, alongside the owner confirmations
 * collected so far. As with proposals, any further fields are chain-specific.
 */
export type MultisigTransportMessage = {
    /**
     * - The owner confirmations (signatures) collected so far.
     */
    confirmations: unknown[];
};
