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

import { IMultisigMessageSigningReadOnly } from './multisig-message-signing-read-only.js'

import { NotImplementedError } from './errors.js'

/** @typedef {import('./multisig-message-signing-read-only.js').MultisigMessageProposal} MultisigMessageProposal */

/** @typedef {import('./errors.js').AccountNotOwnerError} AccountNotOwnerError */
/** @typedef {import('./errors.js').NoSuchElementError} NoSuchElementError */
/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').ValueError} ValueError */

/**
 * @typedef {Object} MultisigSignature
 * @property {string} signature - The caller's signature.
 */

/**
 * Adds message-signing features to a multisig wallet.
 *
 * @interface
 */
export class IMultisigMessageSigning extends IMultisigMessageSigningReadOnly {
  /**
   * Proposes signing a message.
   *
   * @param {string} message - The message to sign.
   * @returns {Promise<MultisigMessageProposal & MultisigSignature>} The multisig message proposal.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to propose the message.
   * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
   */
  async proposeMessage (message) {
    throw new NotImplementedError('proposeMessage(message)')
  }

  /**
   * Approves an existing message proposal.
   *
   * @param {string} messageId - The message's hash.
   * @returns {Promise<MultisigMessageProposal & MultisigSignature>} The multisig message proposal.
   * @throws {ValueError} If the message's identifier is not a valid id.
   * @throws {NoSuchElementError} If no message exists for the given id.
   * @throws {AccountNotOwnerError} If the account is not an owner of the multisig wallet.
   */
  async approveMessageProposal (messageId) {
    throw new NotImplementedError('approveMessageProposal(messageId)')
  }
}
