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

/** @interface */
export class IWalletAccountReadOnly {
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
   * Quotes the costs of a send transaction operation.
   *
   * @param {Transaction} tx - The transaction.
   * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
   */
  async quoteSendTransaction (tx) {
    throw new NotImplementedError('quoteSendTransaction(tx)')
  }

  /**
   * Quotes the costs of a transfer operation.
   *
   * @param {TransferOptions} options - The transfer's options.
   * @returns {Promise<Omit<TransferResult, 'hash'>>} The transfer's quotes.
   */
  async quoteTransfer (options) {
    throw new NotImplementedError('quoteTransfer(options)')
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

/**
 * @abstract
 * @implements {IWalletAccountReadOnly}
 */
export default class WalletAccountReadOnly {
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
      throw new Error("The account's address must be set to perform this operation.")
    }

    return this._address
  }

  /**
   * Verifies a message's signature.
   *
   * @abstract
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
   * @abstract
   * @returns {Promise<bigint>} The native token balance.
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
   */
  async quoteTransfer (options) {
    throw new NotImplementedError('quoteTransfer(options)')
  }

  /**
   * Returns a transaction's receipt.
   *
   * @abstract
   * @param {string} hash - The transaction's hash.
   * @returns {Promise<unknown | null>} The receipt, or null if the transaction has not been included in a block yet.
   */
  async getTransactionReceipt (hash) {
    throw new NotImplementedError('getTransactionReceipt(hash)')
  }
}
