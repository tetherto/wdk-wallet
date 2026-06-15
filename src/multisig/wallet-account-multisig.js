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

import { NotImplementedError } from '../errors.js'

/** @typedef {import('../wallet-account-read-only.js').Transaction} Transaction */
/** @typedef {import('../wallet-account-read-only.js').TransferOptions} TransferOptions */
/** @typedef {import('../wallet-account-read-only.js').TransactionResult} TransactionResult */

/** @typedef {import('./wallet-account-read-only-multisig.js').IWalletAccountReadOnlyMultisig} IWalletAccountReadOnlyMultisig */
/** @typedef {import('./wallet-account-read-only-multisig.js').MultisigProposal} MultisigProposal */

/**
 * @typedef {Object} MultisigProposalResult
 * @property {string} proposalId - The proposal's id, used to approve, reject, query, quote or execute it.
 * @property {number} confirmations - The current number of confirmations.
 * @property {number} threshold - The minimum amount of confirmations to execute the transaction.
 * @property {boolean} executed - True if the transaction has already been executed (e.g. via `autoExecute`).
 */

/**
 * @typedef {Object} MultisigTransactionOptions
 * @property {boolean} [autoExecute] - If true, automatically executes the transaction when the approval threshold is met (only takes effect if this signer's approval is the last one required).
 */

/**
 * @typedef {Object} MultisigMessageProposal
 * @property {string} messageHash - The message's hash.
 * @property {string} signature - The signature of the caller.
 * @property {number} confirmations - The current number of confirmations.
 * @property {number} threshold - The minimum amount of confirmations to sign the message.
 * @property {string | null} combinedSignature - The final combined signature when the threshold is met.
 */

/**
 * @interface
 * @extends {IWalletAccountReadOnlyMultisig}
 */
export class IWalletAccountMultisig {
  /**
   * Proposes sending a transaction for the other owners to approve. Does not execute on-chain:
   * the returned proposal must be approved up to the threshold and then executed via
   * {@link executeProposal}.
   *
   * @param {Transaction} tx - The transaction.
   * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
   * @returns {Promise<MultisigProposalResult>} The proposal's result.
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
   * @returns {Promise<MultisigProposalResult>} The proposal's result.
   */
  async proposeTransfer (options, transactionOptions) {
    throw new NotImplementedError('proposeTransfer(options, transactionOptions)')
  }

  /**
   * Proposes signing a message.
   *
   * @param {string} message - The message to sign.
   * @returns {Promise<MultisigMessageProposal>} The multisig message proposal.
   */
  async proposeMessage (message) {
    throw new NotImplementedError('proposeMessage(message)')
  }

  /**
   * Approves an existing message proposal.
   *
   * @param {string} messageHash - The message's hash.
   * @returns {Promise<MultisigMessageProposal>} The multisig message proposal.
   */
  async approveMessage (messageHash) {
    throw new NotImplementedError('approveMessage(messageHash)')
  }

  /**
   * Approves a pending proposal.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   */
  async approveProposal (proposalId) {
    throw new NotImplementedError('approveProposal(proposalId)')
  }

  /**
   * Rejects a pending proposal.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   */
  async rejectProposal (proposalId) {
    throw new NotImplementedError('rejectProposal(proposalId)')
  }

  /**
   * Submits an approved proposal for on-chain execution.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<TransactionResult>} The on-chain transaction's result.
   */
  async executeProposal (proposalId) {
    throw new NotImplementedError('executeProposal(proposalId)')
  }
}
