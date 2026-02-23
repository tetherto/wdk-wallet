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

import { IWalletAccount } from './wallet-account.js'
import { NotImplementedError } from './errors.js'

/** @typedef {import('./wallet-account-read-only.js').Transaction} Transaction */
/** @typedef {import('./wallet-account-read-only.js').TransferOptions} TransferOptions */
/** @typedef {import('./wallet-account-read-only-multisig.js').MultisigProposal} MultisigResult */

/**
 * @typedef {Object} MultisigTransactionResult
 * @property {string} hash - The transaction hash (proposal hash if not executed, on-chain hash if executed)
 * @property {bigint} fee - The estimated transaction fee
 * @property {number} confirmations - Current number of confirmations
 * @property {number} threshold - Required threshold for execution
 * @property {boolean} executed - Whether the transaction was executed on-chain
 */

/**
 * @typedef {Object} MultisigExecuteResult
 * @property {string} hash - The on-chain transaction hash
 */

/**
 * @typedef {Object} MultisigSendOptions
 * @property {boolean} [autoExecute] - If true, automatically execute the transaction when the approval threshold is met
 */

/**
 * @typedef {Object} MessageProposal
 * @property {string} messageHash - Unique identifier for the message proposal
 * @property {string} signature - This signer's signature
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold
 * @property {string | null} combinedSignature - Final combined signature when threshold is met
 */

/**
 * @typedef {Object} MultisigOptions
 * @property {number} threshold - The number of approvals required to execute a transaction.
 */

/**
 * @interface
 * @extends {IWalletAccount}
 * @extends {IWalletAccountReadOnlyMultisig}
 */
export class IWalletAccountMultisig extends IWalletAccount {
  /**
   * Proposes sending a transaction.
   * The transaction will be sent automatically once the approval threshold is met
   * if autoExecute option is enabled.
   *
   * @param {Transaction} tx - The transaction
   * @param {MultisigSendOptions} [options] - The multisig send options
   * @returns {Promise<MultisigTransactionResult>} The transaction result
   */
  async sendTransaction (tx, options) {
    throw new NotImplementedError('sendTransaction(tx)')
  }

  /**
   * Proposes transferring a token to another address.
   * The transfer will be executed automatically once the approval threshold is met
   * if autoExecute option is enabled.
   *
   * @param {TransferOptions} options - The transfer options
   * @param {MultisigSendOptions} [sendOptions] - The multisig send options
   * @returns {Promise<MultisigTransactionResult>} The transfer result
   */
  async transfer (options, sendOptions) {
    throw new NotImplementedError('transfer(options)')
  }

  /**
   * Proposes signing a message with the multisig.
   * The proposer's signature is included automatically.
   *
   * @param {string} message - The message to sign
   * @returns {Promise<MessageProposal>} The message proposal result
   */
  async proposeMessage (message) {
    throw new NotImplementedError('proposeMessage(message)')
  }

  /**
   * Approves an existing message proposal.
   *
   * @param {string} messageHash - The message hash to approve
   * @returns {Promise<MessageProposal>} The approval result
   */
  async approveMessage (messageHash) {
    throw new NotImplementedError('approveMessage(messageHash)')
  }

  // ==========================================
  // Proposal Lifecycle
  // ==========================================
  /**
   * Creates a new proposal for a transaction.
   * The proposer's signature is included automatically.
   *
   * @param {Transaction} tx - The transaction to propose
   * @returns {Promise<MultisigResult>} The proposal result
   */
  async propose (tx) {
    throw new NotImplementedError('propose(tx)')
  }

  /**
   * Adds the current signer's approval to an existing proposal.
   *
   * @param {string} proposalId - The proposal identifier to approve
   * @returns {Promise<MultisigResult>} The approval result
   */
  async approve (proposalId) {
    throw new NotImplementedError('approve(proposalId)')
  }

  /**
   * Rejects a pending proposal.
   * Behavior is chain-specific: some chains support on-chain rejection,
   * others may create a competing proposal or simply record disapproval.
   *
   * @param {string} proposalId - The proposal identifier to reject
   * @returns {Promise<MultisigResult>} The rejection result
   */
  async reject (proposalId) {
    throw new NotImplementedError('reject(proposalId)')
  }

  /**
   * Submits a fully-signed proposal for on-chain execution.
   *
   * @param {string} proposalId - The proposal identifier to execute
   * @returns {Promise<MultisigExecuteResult>} The execution result
   */
  async execute (proposalId) {
    throw new NotImplementedError('execute(proposalId)')
  }

  // ==========================================
  // Owner Management
  // ==========================================

  /**
   * Proposes adding a new owner to the multisig.
   *
   * @param {string} owner - The new owner's identifier (address/pubkey).
   * @param {MultisigOptions} [options] - The new multisig options.
   * @returns {Promise<MultisigResult>} The proposal result.
   * @throws {Error} If the operation is not supported.
   */
  async addOwner (owner, options) {
    throw new NotImplementedError('addOwner(owner, newThreshold)')
  }

  /**
   * Proposes removing an owner from the multisig.
   *
   * @param {string} owner - The owner's identifier to remove
   * @param {MultisigOptions} [options] - The new multisig options.
   * @returns {Promise<MultisigResult>} The proposal result
   * @throws {Error} If the operation is not supported.
   */
  async removeOwner (owner, options) {
    throw new NotImplementedError('removeOwner(owner, newThreshold)')
  }

  /**
   * Proposes replacing one owner with another.
   *
   * @param {string} oldOwner - The owner to replace
   * @param {string} newOwner - The replacement owner
   * @returns {Promise<MultisigResult>} The proposal result
   * @throws {Error} If the operation is not supported.
   */
  async swapOwner (oldOwner, newOwner) {
    throw new NotImplementedError('swapOwner(oldOwner, newOwner)')
  }

  /**
   * Proposes changing the signature threshold.
   *
   * @param {number} newThreshold - The new threshold
   * @returns {Promise<MultisigResult>} The proposal result
   * @throws {Error} If the operation is not supported.
   */
  async changeThreshold (newThreshold) {
    throw new NotImplementedError('changeThreshold(newThreshold)')
  }
}
