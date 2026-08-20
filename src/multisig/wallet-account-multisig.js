// Copyright 2024 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict'

import { IWalletAccountReadOnlyMultisig } from './wallet-account-read-only-multisig.js'

import { NotImplementedError } from './errors.js'

/** @typedef {import('../wallet-account-read-only.js').Transaction} Transaction */
/** @typedef {import('../wallet-account-read-only.js').TransactionResult} TransactionResult */

/** @typedef {import('../wallet-account.js').KeyPair} KeyPair */

/** @typedef {import('./wallet-account-read-only-multisig.js').MultisigProposal} MultisigProposal */

/** @typedef {import('./errors.js').AccountNotOwnerError} AccountNotOwnerError */
/** @typedef {import('./errors.js').MaximumFeeExceededError} MaximumFeeExceededError */
/** @typedef {import('./errors.js').NoSuchElementError} NoSuchElementError */
/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').TransactionError} TransactionError */
/** @typedef {import('./errors.js').ThresholdNotMetError} ThresholdNotMetError */
/** @typedef {import('./errors.js').ValueError} ValueError */

/**
 * @typedef {Object} MultisigTransactionOptions
 * @property {boolean} [autoExecute] - If true, automatically executes the transaction when the approval threshold is met (only takes effect if this signer's approval is the last one required).
 */

/**
 * @typedef {Object} MultisigAutoExecuteResult
 * @property {TransactionResult} [transaction] - If auto execute is set to true and the method call triggers the execution of the proposal, this field is set to the corresponding transaction's result (i.e., hash and fee).
 */

/** @interface */
export class IWalletAccountMultisig extends IWalletAccountReadOnlyMultisig {
  /**
   * The derivation path's index of this account.
   *
   * @type {number}
   */
  get index () {
    throw new NotImplementedError('index')
  }

  /**
   * The derivation path of this account (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
   *
   * @type {string}
   */
  get path () {
    throw new NotImplementedError('path')
  }

  /**
   * The key pair of this account.
   *
   * @type {KeyPair}
   */
  get keyPair () {
    throw new NotImplementedError('keyPair')
  }

  /**
   * Returns the signer's address.
   *
   * @returns {Promise<string>} The signer's address.
   */
  async getSignerAddress () {
    throw new NotImplementedError('getSignerAddress()')
  }

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
  async propose (tx, transactionOptions) {
    throw new NotImplementedError('propose(tx, transactionOptions)')
  }

  /**
   * Approves a pending proposal.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {ValueError} If the proposal's identifier is not a valid id.
   * @throws {NoSuchElementError} If no message exists for the given id.
   * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
   */
  async approveProposal (proposalId) {
    throw new NotImplementedError('approveProposal(proposalId)')
  }

  /**
   * Rejects a pending proposal.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {ValueError} If the proposal's identifier is not a valid id.
   * @throws {NoSuchElementError} If no message exists for the given id.
   * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
   */
  async rejectProposal (proposalId) {
    throw new NotImplementedError('rejectProposal(proposalId)')
  }

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
  async executeProposal (proposalId) {
    throw new NotImplementedError('executeProposal(proposalId)')
  }
}
