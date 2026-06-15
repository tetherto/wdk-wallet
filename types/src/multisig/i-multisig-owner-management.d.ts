/**
 * Optional owner-management surface for multisig accounts whose owner set is mutable
 * (e.g. account-abstraction wallets). Chains whose owner set is fixed at creation —
 * such as Bitcoin script multisig, where the participants are committed in the redeem
 * script — do not implement this interface.
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
     */
    addOwner(owner: string, options?: MultisigOptions): Promise<MultisigProposal>;
    /**
     * Proposes removing an owner from the multisig wallet account.
     *
     * @param {string} owner - The owner's address.
     * @param {MultisigOptions} [options] - The multisig options.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     */
    removeOwner(owner: string, options?: MultisigOptions): Promise<MultisigProposal>;
    /**
     * Proposes replacing an owner with a different one.
     *
     * @param {string} oldOwner - The old owner.
     * @param {string} newOwner - The new owner.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     */
    swapOwner(oldOwner: string, newOwner: string): Promise<MultisigProposal>;
    /**
     * Proposes changing the signature threshold.
     *
     * @param {number} newThreshold - The new threshold.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
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
