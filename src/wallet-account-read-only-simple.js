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

/** @typedef {import('./errors.js').InvalidTokenError} InvalidTokenError */
/** @typedef {import('./errors.js').NoSuchElementError} NoSuchElementError */
/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').TimeoutError} TimeoutError */
/** @typedef {import('./errors.js').ValueError} ValueError */
/** @typedef {import('./errors.js').UnsupportedOperationError} UnsupportedOperationError */

/**
 * A normalized, cross-chain transaction finality level.
 *
 * - `pending`: seen, not settled (mempool / processed / in-flight).
 * - `confirmed`: settled, reversible only under extreme conditions.
 * - `final`: irreversible per the chain's own guarantees.
 * - `dropped`: evicted / replaced, never landed.
 *
 * @typedef {'pending' | 'confirmed' | 'final' | 'dropped'} Finality
 */

/**
 * A normalized, cross-chain transaction receipt. Blockchain modules extend this
 * type with their own native receipt fields (e.g. `confirmations`, the raw
 * transaction and receipt objects, etc.).
 *
 * @typedef {Object} TransactionReceipt
 * @property {string} hash - The transaction's identifier (hash / signature / lt:hash).
 * @property {Finality} finality - The transaction's finality level.
 * @property {boolean} [success] - The execution's result (not set if the transaction is still pending or it has been dropped).
 * @property {number} [block] - A reference to the including block (block number / height / slot / masterchain seqno).
 * @property {bigint} [fee] - The fee paid, when known.
 */

/**
 * The finality level to wait for.
 *
 * @typedef {'confirmed' | 'final'} WaitForTransactionTarget
 */

/**
 * @typedef {Object} WaitForTransactionOptions
 * @property {WaitForTransactionTarget} [target] - The finality target to wait for (default: 'confirmed').
 * @property {number} [timeout] - The total time budget in milliseconds before giving up. If omitted, the account's `defaultWaitTimeout` is used.
 * @property {number} [interval] - The poll cadence in milliseconds. If omitted, the account's `defaultWaitInterval` is used.
 * @property {number} [maxPollErrors] - How many consecutive getTransaction() failures to tolerate before rethrowing (default: 3).
 */

/**
 * The read-only members shared by every wallet account, single-signer or multisig.
 *
 * This is an internal base interface: it is not exported from the package entry point.
 * Consumers use {@link IWalletAccountReadOnly} or {@link IWalletAccountReadOnlyMultisig},
 * which both extend it.
 *
 * @interface
 */
export class IWalletAccountReadOnlySimple {
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
   * @throws {UnsupportedOperationError} If the read-only wallet account class is not able to provide an implementation for the method.
   */
  async verify (message, signature) {
    throw new NotImplementedError('verify(message, signature)')
  }

  /**
   * Returns the account's native token balance.
   *
   * @returns {Promise<bigint>} The native token balance.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the account's balance.
   */
  async getBalance () {
    throw new NotImplementedError('getBalance()')
  }

  /**
   * Returns the account balance for a specific token.
   *
   * @param {string} tokenAddress - The smart contract address of the token.
   * @returns {Promise<bigint>} The token balance.
   * @throws {ValueError} If the token's address is not valid.
   * @throws {InvalidTokenError} If the token's address doesn't match an existing ERC 20 token.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the account's token balance.
   */
  async getTokenBalance (tokenAddress) {
    throw new NotImplementedError('getTokenBalance(tokenAddress)')
  }

  /**
   * Returns a transaction's receipt.
   *
   * @deprecated Use {@link getTransaction} instead, which returns a normalized, finality-based receipt. The native receipt fields remain available on each module's extended return type.
   * @param {string} hash - The transaction's hash.
   * @returns {Promise<unknown | null>} The receipt, or null if the transaction has not been included in a block yet.
   * @throws {ValueError} If the hash is not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the transaction's receipt.
   */
  async getTransactionReceipt (hash) {
    throw new NotImplementedError('getTransactionReceipt(hash)')
  }

  /**
   * Returns a normalized, finality-based receipt for a transaction.
   *
   * @param {string} hash - The transaction's identifier (hash / signature / lt:hash).
   * @returns {Promise<TransactionReceipt>} The normalized receipt.
   * @throws {ValueError} If the hash is not a valid identifier.
   * @throws {NoSuchElementError} If no transaction has been found for the given hash.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the transaction.
   */
  async getTransaction (hash) {
    throw new NotImplementedError('getTransaction(hash)')
  }

  /**
   * Blocks until a transaction reaches a terminal state (the requested finality target or `dropped`), or times out.
   *
   * @param {string} hash - The transaction's identifier.
   * @param {WaitForTransactionOptions} [options] - The wait options.
   * @returns {Promise<TransactionReceipt>} The terminal receipt: the finality target reached (inspect `success` to tell success from revert), or `dropped`.
   * @throws {ValueError} If the hash is not a valid identifier.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the transaction.
   * @throws {TimeoutError} If the operation times out.
   */
  async waitForTransaction (hash, options) {
    throw new NotImplementedError('waitForTransaction(hash, options)')
  }
}
