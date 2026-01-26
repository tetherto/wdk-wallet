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

import * as bip39 from 'bip39'

import { NotImplementedError } from './errors.js'

/** @typedef {import('./wallet-account.js').IWalletAccount} IWalletAccount */

/**
 * @typedef {Object} WalletConfig
 * @property {number | bigint} [transferMaxFee] - The maximum fee amount for transfer operations.
 */

/**
 * @typedef {Object} FeeRates
 * @property {bigint} normal - The fee rate for transaction sent with normal priority.
 * @property {bigint} fast - The fee rate for transaction sent with fast priority.
 */

/** @abstract */
export default class WalletManager {
  /**
   * Creates a new wallet manager.
   *
   * @param {string | Uint8Array} seed - The wallet's [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrase.
   * @param {WalletConfig} [config] - The wallet configuration.
   */
  constructor (seed, config = { }) {
    if (typeof seed === 'string') {
      if (!WalletManager.isValidSeedPhrase(seed)) {
        throw new Error('The seed phrase is invalid.')
      }

      seed = bip39.mnemonicToSeedSync(seed)
    }

    /** @private */
    this._seed = seed

    /**
     * The wallet configuration.
     *
     * @protected
     * @type {WalletConfig}
     */
    this._config = config

    /**
     * A map between derivation paths and wallet accounts. The {@link dispose} method will automatically dispose
     * all the accounts in this map, so developers are encouraged to map all accounts accessed through the
     * {@link getAccount} and {@link getAccountByPath} methods.
     *
     * @protected
     * @type {{ [path: string]: IWalletAccount }}
     */
    this._accounts = {}
  }

  /**
   * Returns a random [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrase.
   *
   * @param {12 | 24} [wordCount=12] - The number of words in the seed phrase.
   * @returns {string} The seed phrase.
   */
  static getRandomSeedPhrase (wordCount = 12) {
    const strength = wordCount === 24 ? 256 : 128
    return bip39.generateMnemonic(strength)
  }

  /**
   * Checks if a seed phrase is valid.
   *
   * @param {string} seedPhrase - The seed phrase.
   * @returns {boolean} True if the seed phrase is valid.
   */
  static isValidSeedPhrase (seedPhrase) {
    return bip39.validateMnemonic(seedPhrase)
  }

  /**
   * The seed phrase of the wallet.
   *
   * @type {Uint8Array}
   */
  get seed () {
    return this._seed
  }

  /**
   * Returns the wallet account at a specific index (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
   *
   * @abstract
   * @param {number} [index] - The index of the account to get (default: 0).
   * @returns {Promise<IWalletAccount>} The account.
   */
  async getAccount (index = 0) {
    throw new NotImplementedError('getAccount(index)')
  }

  /**
   * Returns the wallet account at a specific [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) derivation path.
   *
   * @abstract
   * @param {string} path - The derivation path (e.g. "0'/0/0").
   * @returns {Promise<IWalletAccount>} The account.
   */
  async getAccountByPath (path) {
    throw new NotImplementedError('getAccountByPath(path)')
  }

  /**
   * Returns the current fee rates.
   *
   * @abstract
   * @returns {Promise<FeeRates>} The fee rates (in base unit).
   */
  async getFeeRates () {
    throw new NotImplementedError('getFeeRates()')
  }

  /**
   * Disposes all the wallet accounts, erasing their private keys from the memory.
   */
  dispose () {
    for (const account of Object.values(this._accounts)) {
      if (account.keyPair.privateKey) {
        account.dispose()
      }
    }

    this._accounts = {}
  }
}
