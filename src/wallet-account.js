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

import { IWalletAccountReadOnly } from './wallet-account-read-only.js'

import { NotImplementedError, ValueError } from './errors.js'

/** @typedef {import('./wallet-account-read-only.js').Transaction} Transaction */
/** @typedef {import('./wallet-account-read-only.js').TransactionResult} TransactionResult */

/** @typedef {import('./wallet-account-read-only.js').TransferOptions} TransferOptions */
/** @typedef {import('./wallet-account-read-only.js').TransferResult} TransferResult */

/** @typedef {import('./errors.js').InvalidTokenError} InvalidTokenError */
/** @typedef {import('./errors.js').MaximumFeeExceededError} MaximumFeeExceededError */
/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').TransactionError} TransactionError */
/** @typedef {import('./errors.js').TransferError} TransferError */
/** @typedef {import('./errors.js').ValueError} ValueError */

/**
 * @typedef {Object} KeyPair
 * @property {Uint8Array} publicKey - The public key.
 * @property {Uint8Array | null} privateKey - The private key (null if the account has been disposed).
 */

/**
 * @interface
 * @template [TSignedTransaction=unknown]
 */
export class IWalletAccount extends IWalletAccountReadOnly {
  /**
   * The derivation path's index of this account.
   *
   * @type {number}
   */
  get index () {
    throw new NotImplementedError('index')
  }

  /**
   * The derivation path of this account (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
   *
   * @type {string}
   */
  get path () {
    throw new NotImplementedError('path')
  }

  /**
   * The account's key pair.
   *
   * @type {KeyPair}
   */
  get keyPair () {
    throw new NotImplementedError('keyPair')
  }

  /**
   * Signs a message.
   *
   * @param {string} message - The message to sign.
   * @returns {Promise<string>} The message's signature.
   */
  async sign (message) {
    throw new NotImplementedError('sign(message)')
  }

  /**
   * Signs a transaction.
   *
   * @param {Transaction} tx - The transaction to sign.
   * @returns {Promise<TSignedTransaction>} The signed transaction.
   * @throws {ValueError} If the transaction is not valid.
   */
  async signTransaction (tx) {
    throw new NotImplementedError('signTransaction(tx)')
  }

  /**
   * Verifies a message's signature.
   *
   * @param {string} message - The original message.
   * @param {string} signature - The signature to verify.
   * @returns {Promise<boolean>} True if the signature is valid.
   */
  async verify (message, signature) {
    throw new NotImplementedError('verify(message, signature)')
  }

  /**
   * Sends a transaction.
   *
   * @param {Transaction | TSignedTransaction} tx - The transaction.
   * @returns {Promise<TransactionResult>} The transaction's result.
   * @throws {ValueError} If the transaction is not valid.
   * @throws {ProviderRequiredError} If the method requires a provider and none is set.
   * @throws {ProviderError} If the provider fails to perform the transaction.
   * @throws {TransactionError} If the transaction fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the transaction max. fee option.
   */
  async sendTransaction (tx) {
    throw new NotImplementedError('sendTransaction(tx)')
  }

  /**
   * Quotes the costs of a send transaction operation.
   *
   * @param {Transaction | TSignedTransaction} tx - The transaction.
   * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
   * @throws {ValueError} If the transaction is not valid.
   * @throws {ProviderRequiredError} If the method requires a provider and none is set.
   * @throws {ProviderError} If the provider fails to estimate the costs of the transaction.
   * @throws {TransactionError} If the transaction fails with an error.
   */
  async quoteSendTransaction (tx) {
    throw new NotImplementedError('quoteSendTransaction(tx)')
  }

  /**
   * Transfers a token to another address.
   *
   * @param {TransferOptions} options - The transfer's options.
   * @returns {Promise<TransferResult>} The transfer's result.
   * @throws {ValueError} If the transfer options are not valid.
   * @throws {InvalidTokenError} If the token's address doesn't match an existing ERC 20 token.
   * @throws {ProviderRequiredError} If the method requires a provider and none is set.
   * @throws {ProviderError} If the provider fails to perform the transfer.
   * @throws {TransferError} If the transfer fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transfer exceeds the transfer max. fee option.
   */
  async transfer (options) {
    throw new NotImplementedError('transfer(options)')
  }

  /**
   * Returns a read-only copy of the account.
   *
   * @returns {Promise<IWalletAccountReadOnly>} The read-only account.
   */
  async toReadOnlyAccount () {
    throw new NotImplementedError('toReadOnlyAccount()')
  }

  /**
   * Disposes the wallet account, erasing the private key from the memory.
   */
  dispose () {
    throw new NotImplementedError('dispose()')
  }
}
