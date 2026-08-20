/** @interface */
export interface IWalletAccountReadOnlyMultisig extends IWalletAccountReadOnlySimple {
    /**
     * Returns the multisig wallet account info.
     *
     * @returns {Promise<MultisigInfo>} The info.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the multisig wallet's info.
    */
    getMultisigInfo(): Promise<MultisigInfo>;
    /**
     * Returns a list of proposals by their identifiers.
     *
     * @param {string[]} proposalIds - The list of proposal's identifiers.
     * @returns {Promise<Record<string, MultisigProposal | null>>} For each proposal id, the proposal details or
     *   null if the proposal has not been found.
     * @throws {ValueError} If the list of proposal's identifiers contains an invalid id.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the proposals.
     */
    getProposals(proposalIds: string[]): Promise<Record<string, MultisigProposal | null>>;
    /**
     * Returns a proposal by its identifier.
     *
     * @param {string} proposalId - The proposal's identifier.
     * @returns {Promise<MultisigProposal | null>} The proposal details, or null if it has not been found.
     * @throws {ValueError} If the proposal's identifier is not a valid id.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to fetch the proposal.
     */
    getProposal(proposalId: string): Promise<MultisigProposal | null>;
    /**
     * Quotes the on-chain cost of executing a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<Omit<TransactionResult, 'hash'>>} The execution cost estimate.
     * @throws {ValueError} If the proposal's identifier is not a valid id.
     * @throws {NoSuchElementError} If no proposal exists for the given id.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to estimate the costs of the transaction.
     * @throws {TransactionError} If the transaction fails with an error.
     */
    quoteExecuteProposal(proposalId: string): Promise<Omit<TransactionResult, "hash">>;
}
export type TransactionResult = import("../wallet-account-read-only.js").TransactionResult;
export type NoSuchElementError = import("./errors.js").NoSuchElementError;
export type ProviderError = import("./errors.js").ProviderError;
export type ProviderRequiredError = import("./errors.js").ProviderRequiredError;
export type TransactionError = import("./errors.js").TransactionError;
export type ValueError = import("./errors.js").ValueError;
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
    /**
     * - The proposal's lifecycle state: `'pending'` while it still awaits confirmations or on-chain execution, `'executed'` once it has been executed on-chain.
     */
    status: "pending" | "executed";
};
import { IWalletAccountReadOnlySimple } from '../wallet-account-read-only-simple.js';
