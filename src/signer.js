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

/** @typedef {import('./wallet-account.js').KeyPair} KeyPair */

/**
 * A minimal, cross-chain signer interface.
 *
 * @interface
 */
export class ISigner {
  /**
   * Whether the signer supports account derivation via {@link derive}.
   *
   * @type {boolean}
   */
  get isDerivable () {
    throw new NotImplementedError('isDerivable')
  }

  /**
   * The signer's key pair, or null if the signer does not allow retrieving
   * key material (e.g. hardware signers).
   *
   * @type {KeyPair | null}
   */
  get keyPair () {
    throw new NotImplementedError('keyPair')
  }

  /**
   * Derive a child signer using a relative path (e.g., "0'/0/0").
   *
   * @param {string} relPath - The relative derivation path.
   * @returns {Promise<ISigner>} The derived signer.
   * @throws {SignerError} If the signer does not support derivation.
   */
  async derive (relPath) {
    throw new NotImplementedError('derive(relPath)')
  }

  /**
   * Returns the signer's address.
   *
   * @returns {Promise<string>} The address.
   */
  async getAddress () {
    throw new NotImplementedError('getAddress()')
  }

  /**
   * Disposes the signer and clears any secret material from memory.
   */
  dispose () {
    throw new NotImplementedError('dispose()')
  }
}
