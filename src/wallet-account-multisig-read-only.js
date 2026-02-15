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

import { NotImplementedError } from './errors.js'

/**
 * @typedef {Object} MultisigInfo
 * @property {string} address - The multisig address
 * @property {string[]} owners - Array of owner identifiers
 * @property {number} threshold - Required number of signatures
 * @property {boolean} [isCreated] - Whether the multisig wallet has been created
 */

/**
 * A proposal object representing a pending multisig transaction.
 *
 * @typedef {Object} MultisigProposal
 * @property {string} proposalId - Unique identifier for the created proposal
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold for execution
 */

/**
 * @typedef {Object} MessageInfo
 * @property {string} messageHash - The message hash
 * @property {string} message - The original message
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold
 * @property {string | null} combinedSignature - Final combined signature when threshold is met
 */

/** @interface */
export class IWalletAccountMultisigReadOnly {
  /**
   * Returns the address/identifier of the signer associated with this account wallet
   * Returns null if no signer is associated.
   *
   * @returns {Promise<string | null>} The signer's identifier
   */
  async getSignerAddress () {
    throw new NotImplementedError('getSignerAddress()')
  }

  /**
   * Returns the multisig wallet info.
   *
   * @returns {Promise<MultisigInfo>} The multisig info
  */
  async getMultisigInfo () {
    throw new NotImplementedError('getMultisigInfo()')
  }

  /**
   * Returns the list of owners/co-signers of the multisig wallet.
   * The format of each entry is chain-specific (address, pubkey, etc).
   *
   * @returns {Promise<string[]>} Array of owner identifiers
   */
  async getOwners () {
    throw new NotImplementedError('getOwners()')
  }

  /**
   * Returns the number of required signatures to execute a transaction.
   *
   * @returns {Promise<number>} The threshold
   */
  async getThreshold () {
    throw new NotImplementedError('getThreshold()')
  }

  /**
   * Returns a proposal by its identifier.
   *
   * @param {string} proposalId - The proposal identifier
   * @returns {Promise<MultisigProposal | null>} The proposal details, or null if not found
   */
  async getProposal (proposalId) {
    throw new NotImplementedError('getProposal(proposalId)')
  }

  /**
   * Returns a message proposal by its hash.
   *
   * @param {string} messageHash - The message hash
   * @returns {Promise<MessageInfo | null>} The message info or null if not found
   */
  async getMessage (messageHash) {
    throw new NotImplementedError('getMessage(messageHash)')
  }
}
