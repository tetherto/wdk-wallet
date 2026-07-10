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

import { NotImplementedError } from '../errors.js'

/** @typedef {import('../wallet-account-read-only.js').Transaction} Transaction */
/** @typedef {import('../wallet-account-read-only.js').TransferOptions} TransferOptions */
/** @typedef {import('../wallet-account-read-only.js').TransactionResult} TransactionResult */

/** @typedef {import('../wallet-account.js').KeyPair} KeyPair */

/** @typedef {import('./wallet-account-read-only-multisig.js').MultisigProposal} MultisigProposal */

/** @typedef {import('../errors.js').SignerError} SignerError */
/** @typedef {import('../errors.js').NoSuchElementError} NoSuchElementError */
/** @typedef {import('../errors.js').ValueError} ValueError */

/**
 * @typedef {Object} MultisigTransactionOptions
 * @property {boolean} [autoExecute] - If true, automatically executes the transaction when the approval threshold is met (only takes effect if this signer's approval is the last one required).
 */

/**
 * @typedef {Object} MultisigMessageProposal
 * @property {string} messageId - The message's hash.
 * @property {string} signature - The signature of the caller.
 * @property {number} confirmations - The current number of confirmations.
 * @property {number} threshold - The minimum amount of confirmations to sign the message.
 * @property {string | null} combinedSignature - The final combined signature when the threshold is met.
 */

/** @interface */
export class IWalletAccountMultisig extends IWalletAccountReadOnlyMultisig {
  /**
   * The derivation path's index of the signer associated with this account.
   *
   * @type {number}
   */
  get index () {
    throw new NotImplementedError('index')
  }

  /**
   * The derivation path of the signer associated with this account (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
   *
   * @type {string}
   */
  get path () {
    throw new NotImplementedError('path')
  }

  /**
   * The key pair of the signer associated with this account.
   *
   * @type {KeyPair}
   */
  get signerKeyPair () {
    throw new NotImplementedError('signerKeyPair')
  }

  /**
   * Proposes sending a transaction for the other owners to approve. Does not execute on-chain:
   * the returned proposal must be approved up to the threshold and then executed via
   * {@link executeProposal}.
   *
   * @param {Transaction} tx - The transaction.
   * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
   * @returns {Promise<MultisigProposal>} The created proposal; its `status` is `'executed'` when `autoExecute` ran to completion, otherwise `'pending'`.
   * @throws {SignerError} If the signer is not an owner of the multisig account.
   */
  async propose (tx, transactionOptions) {
    throw new NotImplementedError('propose(tx, transactionOptions)')
  }

  /**
   * Proposes transferring a token to another address for the other owners to approve. Does not
   * execute on-chain; see {@link propose}.
   *
   * @param {TransferOptions} options - The transfer's options.
   * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
   * @returns {Promise<MultisigProposal>} The created proposal; its `status` is `'executed'` when `autoExecute` ran to completion, otherwise `'pending'`.
   * @throws {SignerError} If the signer is not an owner of the multisig account.
   */
  async proposeTransfer (options, transactionOptions) {
    throw new NotImplementedError('proposeTransfer(options, transactionOptions)')
  }

  /**
   * Proposes signing a message.
   *
   * @param {string} message - The message to sign.
   * @returns {Promise<MultisigMessageProposal>} The multisig message proposal.
   * @throws {SignerError} If the signer is not an owner of the multisig account.
   */
  async proposeMessage (message) {
    throw new NotImplementedError('proposeMessage(message)')
  }

  /**
   * Approves an existing message proposal.
   *
   * @param {string} messageId - The message's hash.
   * @returns {Promise<MultisigMessageProposal>} The multisig message proposal.
   * @throws {SignerError} If the signer is not an owner of the multisig account.
   * @throws {NoSuchElementError} If no message exists for the given id.
   */
  async approveMessage (messageId) {
    throw new NotImplementedError('approveMessage(messageId)')
  }

  /**
   * Approves a pending proposal.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {SignerError} If the signer is not an owner of the multisig account.
   * @throws {NoSuchElementError} If no proposal exists for the given id.
   */
  async approveProposal (proposalId) {
    throw new NotImplementedError('approveProposal(proposalId)')
  }

  /**
   * Rejects a pending proposal.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {NoSuchElementError} If no proposal exists for the given id.
   */
  async rejectProposal (proposalId) {
    throw new NotImplementedError('rejectProposal(proposalId)')
  }

  /**
   * Submits an approved proposal for on-chain execution.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<TransactionResult>} The on-chain transaction's result.
   * @throws {NoSuchElementError} If no proposal exists for the given id.
   * @throws {ValueError} If the proposal has not reached the approval threshold.
   */
  async executeProposal (proposalId) {
    throw new NotImplementedError('executeProposal(proposalId)')
  }
}
