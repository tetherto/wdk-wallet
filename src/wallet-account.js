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

import { NotImplementedError } from './errors.js'

/** @typedef {import('./wallet-account-read-only.js').Transaction} Transaction */
/** @typedef {import('./wallet-account-read-only.js').TransactionResult} TransactionResult */

/** @typedef {import('./wallet-account-read-only.js').TransferOptions} TransferOptions */
/** @typedef {import('./wallet-account-read-only.js').TransferResult} TransferResult */

/**
 * @typedef {Object} KeyPair
 * @property {Uint8Array} publicKey - The public key.
 * @property {Uint8Array | null} privateKey - The private key (null if the account has been disposed).
 */

/** @typedef {import('./disposable.js').IDisposable} IDisposable */

/**
 * @interface
 * @implements {IDisposable}
 * @template [TSignedTransaction=unknown]
 */
export class IWalletAccount extends IWalletAccountReadOnly {
  /**
   * The derivation path of this account (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)),
   * or null if the account's signer is not bound to a BIP-44 position (e.g. private-key signers).
   *
   * @type {string | null}
   */
  get path () {
    throw new NotImplementedError('path')
  }

  /**
   * The account's key pair, or null if the account's signer does not allow
   * retrieving key material (e.g. hardware signers).
   *
   * @type {KeyPair | null}
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
   * Signs a transaction
   *
   * @param {Transaction} tx - The transaction to sign.
   * @returns {Promise<TSignedTransaction>} The signed transaction.
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
   */
  async sendTransaction (tx) {
    throw new NotImplementedError('sendTransaction(tx)')
  }

  /**
   * Quotes the costs of a send transaction operation.
   *
   * @param {Transaction | TSignedTransaction} tx - The transaction.
   * @returns {Promise<Omit<TransactionResult, 'hash'>>} The transaction's quotes.
   */
  async quoteSendTransaction (tx) {
    throw new NotImplementedError('quoteSendTransaction(tx)')
  }

  /**
   * Transfers a token to another address.
   *
   * @param {TransferOptions} options - The transfer's options.
   * @returns {Promise<TransferResult>} The transfer's result.
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
