/**
 * Adds owner management features to a multisig wallet.
 *
 * @interface
 */
export interface IMultisigOwnerManagement {
    /**
     * Proposes adding a new owner to the multisig wallet account.
     *
     * @param {string} owner - The owner's address.
     * @param {MultisigOptions} [options] - The multisig options.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {Error} If the account is not an owner of the multisig wallet.
     */
    addOwner(owner: string, options?: MultisigOptions): Promise<MultisigProposal>;
    /**
     * Proposes removing an owner from the multisig wallet account.
     *
     * @param {string} owner - The owner's address.
     * @param {MultisigOptions} [options] - The multisig options.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {Error} If the account is not an owner of the multisig wallet.
     */
    removeOwner(owner: string, options?: MultisigOptions): Promise<MultisigProposal>;
    /**
     * Proposes replacing an owner with a different one.
     *
     * @param {string} oldOwner - The old owner.
     * @param {string} newOwner - The new owner.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {Error} If the account is not an owner of the multisig wallet.
     */
    swapOwner(oldOwner: string, newOwner: string): Promise<MultisigProposal>;
    /**
     * Proposes changing the signature threshold.
     *
     * @param {number} newThreshold - The new threshold.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {Error} If the account is not an owner of the multisig wallet.
     */
    changeThreshold(newThreshold: number): Promise<MultisigProposal>;
}
export type MultisigProposal = import("./wallet-account-read-only-multisig.js").MultisigProposal;
export type MultisigOptions = {
    /**
     * - The new amount of approvals required to execute a transaction.
     */
    threshold: number;
};
