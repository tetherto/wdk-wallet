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

/** @typedef {import('../wallet-account.js').IWalletAccount} IWalletAccount */

/** @typedef {import('../wallet-account-read-only.js').Transaction} Transaction */
/** @typedef {import('../wallet-account-read-only.js').TransferOptions} TransferOptions */
/** @typedef {import('../wallet-account-read-only.js').TransactionResult} TransactionResult */

/** @typedef {import('./wallet-account-read-only-multisig.js').IWalletAccountReadOnlyMultisig} IWalletAccountReadOnlyMultisig */
/** @typedef {import('./wallet-account-read-only-multisig.js').MultisigProposal} MultisigProposal */

/**
 * @typedef {Object} MultisigTransactionResult
 * @property {string} proposalId - The proposal's id.
 * @property {string} hash - The transaction's hash.
 * @property {bigint} fee - The gas cost.
 * @property {number} confirmations - The current number of confirmations.
 * @property {number} threshold - The minimum amount of confirmations to execute the transaction.
 * @property {boolean} executed - True if the transaction has already been executed.
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
 * @typedef {Object} MultisigOptions
 * @property {number} threshold - The new amount of approvals required to execute a transaction.
 */

/**
 * @interface
 * @extends {IWalletAccount}
 * @extends {IWalletAccountReadOnlyMultisig}
 */
export class IWalletAccountMultisig {
  /**
   * Proposes sending a transaction.
   *
   * @param {Transaction} tx - The transaction.
   * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
   * @returns {Promise<MultisigTransactionResult>} The transaction's result.
   */
  async sendTransaction (tx, transactionOptions) {
    throw new NotImplementedError('sendTransaction(tx, transactionOptions)')
  }

  /**
   * Proposes transferring a token to another address.
   *
   * @param {TransferOptions} options - The transfer's options.
   * @param {MultisigTransactionOptions} [transactionOptions] - The multisig transaction's options.
   * @returns {Promise<MultisigTransactionResult>} The transfer's result.
   */
  async transfer (options, transactionOptions) {
    throw new NotImplementedError('transfer(options, transactionOptions)')
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
  async approveTx (proposalId) {
    throw new NotImplementedError('approveTx(proposalId)')
  }

  /**
   * Rejects a pending proposal.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   */
  async rejectTx (proposalId) {
    throw new NotImplementedError('rejectTx(proposalId)')
  }

  /**
   * Submits a proposal for on-chain execution.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<TransactionResult>} The transaction's result.
   */
  async executeTx (proposalId) {
    throw new NotImplementedError('executeTx(proposalId)')
  }

  /**
   * Proposes adding a new owner to the multisig wallet account.
   *
   * @param {string} owner - The owner's address.
   * @param {MultisigOptions} [options] - The multisig options.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {Error} If the operation is not supported.
   */
  async addOwner (owner, options) {
    throw new NotImplementedError('addOwner(owner, newThreshold)')
  }

  /**
   * Proposes removing an owner from the multisig wallet account.
   *
   * @param {string} owner - The owner's address.
   * @param {MultisigOptions} [options] - The multisig options.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {Error} If the operation is not supported.
   */
  async removeOwner (owner, options) {
    throw new NotImplementedError('removeOwner(owner, newThreshold)')
  }

  /**
   * Proposes replacing an owner with a different one.
   *
   * @param {string} oldOwner - The old owner.
   * @param {string} newOwner - The new owner.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {Error} If the operation is not supported.
   */
  async swapOwner (oldOwner, newOwner) {
    throw new NotImplementedError('swapOwner(oldOwner, newOwner)')
  }

  /**
   * Proposes changing the signature threshold.
   *
   * @param {number} newThreshold - The new threshold.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {Error} If the operation is not supported.
   */
  async changeThreshold (newThreshold) {
    throw new NotImplementedError('changeThreshold(newThreshold)')
  }
}
