/**
 * Adds message-signing features to a multisig wallet.
 *
 * @interface
 */
export interface IMultisigMessageSigning extends IMultisigMessageSigningReadOnly {
    /**
     * Proposes signing a message.
     *
     * @param {string} message - The message to sign.
     * @returns {Promise<MultisigMessageProposal & MultisigSignature>} The multisig message proposal.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to propose the message.
     * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
     */
    proposeMessage(message: string): Promise<MultisigMessageProposal & MultisigSignature>;
    /**
     * Approves an existing message proposal.
     *
     * @param {string} messageId - The message's hash.
     * @returns {Promise<MultisigMessageProposal & MultisigSignature>} The multisig message proposal.
     * @throws {ValueError} If the message's identifier is not a valid id.
     * @throws {NoSuchElementError} If no message exists for the given id.
     * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
     */
    approveMessageProposal(messageId: string): Promise<MultisigMessageProposal & MultisigSignature>;
}
export type MultisigMessageProposal = import("./multisig-message-signing-read-only.js").MultisigMessageProposal;
export type AccountNotOwnerError = import("./errors.js").AccountNotOwnerError;
export type NoSuchElementError = import("./errors.js").NoSuchElementError;
export type ProviderError = import("./errors.js").ProviderError;
export type ProviderRequiredError = import("./errors.js").ProviderRequiredError;
export type ValueError = import("./errors.js").ValueError;
export type MultisigSignature = {
    /**
     * - The caller's signature.
     */
    signature: string;
};
import { IMultisigMessageSigningReadOnly } from './multisig-message-signing-read-only.js';
