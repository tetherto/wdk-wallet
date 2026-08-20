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

import { IWalletAccountReadOnlySimple } from './wallet-account-read-only-simple.js'

import { AssertionError, NoSuchElementError, NotImplementedError, ProviderError, TimeoutError, UnsupportedOperationError } from './errors.js'

/** @typedef {import('./wallet-account-read-only-simple.js').Finality} Finality */
/** @typedef {import('./wallet-account-read-only-simple.js').TransactionReceipt} TransactionReceipt */
/** @typedef {import('./wallet-account-read-only-simple.js').WaitForTransactionOptions} WaitForTransactionOptions */

/** @typedef {import('./errors.js').InvalidTokenError} InvalidTokenError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').TransactionError} TransactionError */
/** @typedef {import('./errors.js').TransferError} TransferError */
/** @typedef {import('./errors.js').ValueError} ValueError */

/**
 * @typedef {Object} Transaction
 * @property {string} to - The transaction's recipient.
 * @property {number | bigint} value - The amount of native tokens to send to the recipient (in base unit).
 */

/**
 * @typedef {Object} TransactionResult
 * @property {string} hash - The transaction's hash.
 * @property {bigint} fee - The gas cost.
 */

/**
 * @typedef {Object} TransferOptions
 * @property {string} token - The address of the token to transfer.
 * @property {string} recipient - The address of the recipient.
 * @property {number | bigint} amount - The amount of tokens to transfer to the recipient (in base units).
 */

/**
 * @typedef {Object} TransferResult
 * @property {string} hash - The hash of the transfer operation.
 * @property {bigint} fee - The gas cost.
 */

/**
 * Enum that assigns a comparable ordinal to each finality level, used to check
 * whether an observed finality satisfies a requested target.
 *
 * @readonly
 * @enum {number}
 */
export const FINALITY = {
  pending: 0,
  dropped: 1,
  confirmed: 2,
  final: 3
}

/**
 * Resolves after the given number of milliseconds.
 *
 * @param {number} amount - The delay, in milliseconds.
 * @returns {Promise<void>} A promise that resolves once the delay elapses.
 */
async function sleep (amount) {
  await new Promise(resolve => setTimeout(resolve, amount))
}

/** @interface */
export class IWalletAccountReadOnly extends IWalletAccountReadOnlySimple {
  /**
   * Quotes the costs of a send transaction operation.
   *
   * @param {Transaction} tx - The transaction.
   * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
   * @throws {ValueError} If the transaction is not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the transaction.
   * @throws {TransactionError} If the transaction fails with an error.
   */
  async quoteSendTransaction (tx) {
    throw new NotImplementedError('quoteSendTransaction(tx)')
  }

  /**
   * Quotes the costs of a transfer operation.
   *
   * @param {TransferOptions} options - The transfer's options.
   * @returns {Promise<Omit<TransferResult, 'hash'>>} The transfer's quotes.
   * @throws {ValueError} If the transfer options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the transfer.
   * @throws {TransferError} If the transfer fails with an error.
   */
  async quoteTransfer (options) {
    throw new NotImplementedError('quoteTransfer(options)')
  }
}

/**
 * @abstract
 * @implements {IWalletAccountReadOnly}
 */
export default class WalletAccountReadOnly {
  /**
   * The default poll cadence for {@link waitForTransaction}, in milliseconds,
   * applied when the caller doesn't provide an `interval`. Subclasses override
   * it to match their chain's block time.
   *
   * @type {number}
   */
  get defaultWaitInterval () {
    return 4000
  }

  /**
   * The default time budget for {@link waitForTransaction}, in milliseconds,
   * applied when the caller doesn't provide a `timeout`. Subclasses override it
   * to match their chain's finality expectations.
   *
   * @type {number}
   */
  get defaultWaitTimeout () {
    return 60000
  }

  /**
   * Creates a new read-only wallet account.
   *
   * @param {string} [address] - The account's address.
   */
  constructor (address) {
    /** @private */
    this.__address = address
  }

  /**
   * The account's address.
   *
   * @protected
   * @type {string | undefined}
   */
  get _address () {
    return this.__address
  }

  /**
   * Returns the account's address.
   *
   * @returns {Promise<string>} The account's address.
   */
  async getAddress () {
    if (!this._address) {
      throw new AssertionError("The account's address must be set to perform this operation.")
    }

    return this._address
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
    throw new UnsupportedOperationError('verify(message, signature)')
  }

  /**
   * Returns the account's native token balance.
   *
   * @abstract
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
   * @abstract
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
   * Quotes the costs of a send transaction operation.
   *
   * @abstract
   * @param {Transaction} tx - The transaction.
   * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
   * @throws {ValueError} If the transaction is not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the transaction.
   * @throws {TransactionError} If the transaction fails with an error.
   */
  async quoteSendTransaction (tx) {
    throw new NotImplementedError('quoteSendTransaction(tx)')
  }

  /**
   * Quotes the costs of a transfer operation.
   *
   * @abstract
   * @param {TransferOptions} options - The transfer's options.
   * @returns {Promise<Omit<TransferResult, 'hash'>>} The transfer's quotes.
   * @throws {ValueError} If the transfer options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the transfer.
   * @throws {TransferError} If the transfer fails with an error.
   */
  async quoteTransfer (options) {
    throw new NotImplementedError('quoteTransfer(options)')
  }

  /**
   * Returns a transaction's receipt.
   *
   * @deprecated Use {@link getTransaction} instead, which returns a normalized, finality-based receipt. The native receipt fields remain available on each module's extended return type.
   * @abstract
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
   * @abstract
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
   * Blocks until a transaction reaches a terminal state (the requested finality
   * target or `dropped`), or times out.
   *
   * The polling loop and target resolution are chain-agnostic: this method only
   * interprets the normalized receipt returned by {@link getTransaction}. A
   * {@link NoSuchElementError} is treated as a transient not-found, so the loop
   * keeps polling until the timeout.
   *
   * @param {string} hash - The transaction's identifier.
   * @param {WaitForTransactionOptions} [options] - The wait options.
   * @returns {Promise<TransactionReceipt>} The terminal receipt: the finality target reached (inspect `success` to tell success from revert), or `dropped`.
   * @throws {ValueError} If the hash is not a valid identifier.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the transaction.
   * @throws {TimeoutError} If the operation times out.
   */
  async waitForTransaction (hash, options = {}) {
    const {
      target = 'confirmed',
      interval = this.defaultWaitInterval,
      timeout = this.defaultWaitTimeout,
      maxPollErrors = 3
    } = options

    const deadline = Date.now() + timeout
    let droppedStreak = 0
    let errorStreak = 0

    while (true) {
      let receipt = null

      try {
        receipt = await this.getTransaction(hash)
        errorStreak = 0
      } catch (error) {
        if (error instanceof NoSuchElementError) {
          errorStreak = 0
        } else if (error instanceof ProviderError) {
          if (++errorStreak > maxPollErrors) {
            throw error
          }
        } else {
          throw error
        }
      }

      if (receipt) {
        if (receipt.finality === 'dropped') {
          if (++droppedStreak >= 2) {
            return receipt
          }
        } else {
          droppedStreak = 0

          if (FINALITY[receipt.finality] >= FINALITY[target]) {
            return receipt
          }
        }
      } else {
        droppedStreak = 0
      }

      if (Date.now() >= deadline) {
        throw new TimeoutError(`Transaction '${hash}' did not reach '${target}' within the timeout.`)
      }

      await sleep(interval)
    }
  }
}
