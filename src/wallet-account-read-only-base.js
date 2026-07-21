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
 * The read-only members shared by every wallet account, single-signer or multisig.
 *
 * This is an internal base interface: it is not exported from the package entry point.
 * Consumers use {@link IWalletAccountReadOnly} or {@link IWalletAccountReadOnlyMultisig},
 * which both extend it.
 *
 * @interface
 */
export class IWalletAccountReadOnlyBase {
  /**
   * Returns the account's address.
   *
   * @returns {Promise<string>} The account's address.
   */
  async getAddress () {
    throw new NotImplementedError('getAddress()')
  }

  /**
   * Verifies a message's signature.
   *
   * @param {string} message - The original message.
   * @param {string} signature - The signature to verify.
   * @returns {Promise<boolean>} True if the signature is valid.
   * @throws {Error} If the read-only wallet account class is not able to provide an implementation for the method.
   */
  async verify (message, signature) {
    throw new NotImplementedError('verify(message, signature)')
  }

  /**
   * Returns the account's native token balance.
   *
   * @returns {Promise<bigint>} The native token balance.
   */
  async getBalance () {
    throw new NotImplementedError('getBalance()')
  }

  /**
   * Returns the account balance for a specific token.
   *
   * @param {string} tokenAddress - The smart contract address of the token.
   * @returns {Promise<bigint>} The token balance.
   */
  async getTokenBalance (tokenAddress) {
    throw new NotImplementedError('getTokenBalance(tokenAddress)')
  }

  /**
   * Returns a transaction's receipt.
   *
   * @param {string} hash - The transaction's hash.
   * @returns {Promise<unknown | null>} The receipt, or null if the transaction has not been included in a block yet.
   */
  async getTransactionReceipt (hash) {
    throw new NotImplementedError('getTransactionReceipt(hash)')
  }
}
