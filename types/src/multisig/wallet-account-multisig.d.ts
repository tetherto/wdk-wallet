/** @interface */
export interface IWalletAccountMultisig extends IWalletAccountReadOnlyMultisig {
    /**
     * The derivation path's index of this account.
     *
     * @type {number}
     */
    get index(): number;
    /**
     * The derivation path of this account (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
     *
     * @type {string}
     */
    get path(): string;
    /**
     * The key pair of this account.
     *
     * @type {KeyPair}
     */
    get keyPair(): KeyPair;
    /**
     * Returns the signer's address.
     *
     * @returns {Promise<string>} The signer's address.
     */
    getSignerAddress(): Promise<string>;
    /**
     * Proposes sending a transaction for the other owners to approve. Does not execute on-chain:
     * the returned proposal must be approved up to the threshold and then executed via
     * {@link executeProposal}.
     *
     * @param {Transaction} tx - The transaction.
     * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
     * @returns {Promise<MultisigProposal>} The created proposal; its `status` is `'executed'` when `autoExecute` ran to completion, otherwise `'pending'`.
     * @throws {ValueError} If the transaction is not valid.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to propose the transaction.
     * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
     */
    propose(tx: Transaction, transactionOptions?: MultisigTransactionOptions): Promise<MultisigProposal>;
    /**
     * Approves a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {ValueError} If the proposal's identifier is not a valid id.
     * @throws {NoSuchElementError} If no message exists for the given id.
     * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
     */
    approveProposal(proposalId: string): Promise<MultisigProposal>;
    /**
     * Rejects a pending proposal.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<MultisigProposal>} The multisig proposal.
     * @throws {ValueError} If the proposal's identifier is not a valid id.
     * @throws {NoSuchElementError} If no message exists for the given id.
     * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
     */
    rejectProposal(proposalId: string): Promise<MultisigProposal>;
    /**
     * Submits an approved proposal for on-chain execution.
     *
     * @param {string} proposalId - The proposal's id.
     * @returns {Promise<TransactionResult>} The on-chain transaction's result.
     * @throws {ValueError} If the proposal's identifier is not a valid id.
     * @throws {NoSuchElementError} If no proposal exists for the given id.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to execute the proposal.
     * @throws {TransactionError} If the transaction fails with an error.
     * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
     * @throws {ThresholdNotMetError} If the proposal's threshold has not been met yet.
     * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the transaction max. fee option.
     */
    executeProposal(proposalId: string): Promise<TransactionResult>;
}
export type Transaction = import("../wallet-account-read-only.js").Transaction;
export type TransactionResult = import("../wallet-account-read-only.js").TransactionResult;
export type KeyPair = import("../wallet-account.js").KeyPair;
export type MultisigProposal = import("./wallet-account-read-only-multisig.js").MultisigProposal;
export type AccountNotOwnerError = import("./errors.js").AccountNotOwnerError;
export type MaximumFeeExceededError = import("./errors.js").MaximumFeeExceededError;
export type NoSuchElementError = import("./errors.js").NoSuchElementError;
export type ProviderError = import("./errors.js").ProviderError;
export type ProviderRequiredError = import("./errors.js").ProviderRequiredError;
export type TransactionError = import("./errors.js").TransactionError;
export type ThresholdNotMetError = import("./errors.js").ThresholdNotMetError;
export type ValueError = import("./errors.js").ValueError;
export type MultisigTransactionOptions = {
    /**
     * - If true, automatically executes the transaction when the approval threshold is met (only takes effect if this signer's approval is the last one required).
     */
    autoExecute?: boolean;
};
export type MultisigAutoExecuteResult = {
    /**
     * - If auto execute is set to true and the method call triggers the execution of the proposal, this field is set to the corresponding transaction's result (i.e., hash and fee).
     */
    transaction?: TransactionResult;
};
import { IWalletAccountReadOnlyMultisig } from './wallet-account-read-only-multisig.js';
