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

import { IWalletAccountReadOnlyBase } from '../wallet-account-read-only-base.js'

import { NotImplementedError } from '../errors.js'

/** @typedef {import('../errors.js').NoSuchElementError} NoSuchElementError */

/**
 * @typedef {Object} MultisigInfo
 * @property {string} address - The multisig wallet account address.
 * @property {string[]} owners - The owners of the multisig wallet account.
 * @property {number} threshold - The minimum amount of signatures to execute a transaction.
 * @property {boolean} [isCreated] - True if the multisig wallet account has already been created; omitted when the implementation cannot determine it without an on-chain lookup.
 */

/**
 *
 * @typedef {Object} MultisigProposal
 * @property {string} proposalId - The proposal's id.
 * @property {number} confirmations - The current number of confirmations.
 * @property {number} threshold - The minimum amount of confirmations to execute the transaction.
 * @property {'pending' | 'executed'} status - The proposal's lifecycle state: `'pending'` while it still awaits confirmations or on-chain execution, `'executed'` once it has been executed on-chain.
 */

/**
 * @typedef {Object} MultisigMessage
 * @property {string} messageId - The message's hash.
 * @property {string} message - The original message.
 * @property {number} confirmations - The current number of confirmations.
 * @property {number} threshold -  The minimum amount of confirmations to sign the message.
 * @property {string | null} combinedSignature - The final combined signature when the threshold is met.
 */

/**
 * @typedef {Object} MultisigExecuteQuote
 * @property {bigint} fee - The estimated cost of executing the proposal on-chain.
 */

/** @interface */
export class IWalletAccountReadOnlyMultisig extends IWalletAccountReadOnlyBase {
  /**
   * Returns the address of the signer associated with this wallet account.
   *
   * @returns {Promise<string | null>} The signer's address, or null if no signer is associated yet.
   */
  async getSignerAddress () {
    throw new NotImplementedError('getSignerAddress()')
  }

  /**
   * Returns the multisig wallet account info.
   *
   * @returns {Promise<MultisigInfo>} The info.
  */
  async getMultisigInfo () {
    throw new NotImplementedError('getMultisigInfo()')
  }

  /**
   * Returns a list of proposals by their identifiers.
   *
   * @param {string[]} proposalIds - The list of proposal identifiers.
   * @returns {Promise<(MultisigProposal | null)[]>} For each proposal id, the proposal details or
   *   null if the proposal has not been found.
   */
  async getProposals (proposalIds) {
    throw new NotImplementedError('getProposals(proposalIds)')
  }

  /**
   * Returns a list of message proposals by their hashes.
   *
   * @param {string[]} messageIds - The list of message hashes
   * @returns {Promise<(MultisigMessage | null)[]>} For each message hash, the message details or
   *   null if the message has not been found.
   */
  async getMessages (messageIds) {
    throw new NotImplementedError('getMessages(messageIds)')
  }

  /**
   * Quotes the on-chain cost of executing a pending proposal.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<MultisigExecuteQuote>} The execution cost estimate.
   * @throws {NoSuchElementError} If no proposal exists for the given id.
   */
  async quoteExecuteProposal (proposalId) {
    throw new NotImplementedError('quoteExecuteProposal(proposalId)')
  }
}
