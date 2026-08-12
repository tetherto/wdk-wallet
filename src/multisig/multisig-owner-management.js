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

/** @typedef {import('./wallet-account-read-only-multisig.js').MultisigProposal} MultisigProposal */

/**
 * @typedef {Object} MultisigOptions
 * @property {number} threshold - The new amount of approvals required to execute a transaction.
 */

/**
 * Adds owner management features to a multisig wallet.
 *
 * @interface
 */
export class IMultisigOwnerManagement {
  /**
   * Proposes adding a new owner to the multisig wallet account.
   *
   * @param {string} owner - The owner's address.
   * @param {MultisigOptions} [options] - The multisig options.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {Error} If the account is not an owner of the multisig wallet.
   */
  async addOwner (owner, options) {
    throw new NotImplementedError('addOwner(owner, options)')
  }

  /**
   * Proposes removing an owner from the multisig wallet account.
   *
   * @param {string} owner - The owner's address.
   * @param {MultisigOptions} [options] - The multisig options.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {Error} If the account is not an owner of the multisig wallet.
   */
  async removeOwner (owner, options) {
    throw new NotImplementedError('removeOwner(owner, options)')
  }

  /**
   * Proposes replacing an owner with a different one.
   *
   * @param {string} oldOwner - The old owner.
   * @param {string} newOwner - The new owner.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {Error} If the account is not an owner of the multisig wallet.
   */
  async swapOwner (oldOwner, newOwner) {
    throw new NotImplementedError('swapOwner(oldOwner, newOwner)')
  }

  /**
   * Proposes changing the signature threshold.
   *
   * @param {number} newThreshold - The new threshold.
   * @returns {Promise<MultisigProposal>} The multisig proposal.
   * @throws {Error} If the account is not an owner of the multisig wallet.
   */
  async changeThreshold (newThreshold) {
    throw new NotImplementedError('changeThreshold(newThreshold)')
  }
}
