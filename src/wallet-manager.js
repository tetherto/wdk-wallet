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
/** @typedef {import('./signer.js').ISigner} ISigner */

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
   * Creates a new wallet manager from a BIP-39 seed.
   *
   * @overload
   * @param {string | Uint8Array} seed - The BIP-39 seed phrase or raw seed bytes.
   * @param {WalletConfig} [config] - The wallet configuration.
   */

  /**
   * Creates a new wallet manager from a default signer.
   *
   * @overload
   * @param {ISigner} signer - The default signer.
   * @param {WalletConfig} [config] - The wallet configuration.
   */
  constructor (seedOrSigner, config = {}) {
    if (typeof seedOrSigner === 'string') {
      if (!WalletManager.isValidSeedPhrase(seedOrSigner)) {
        throw new Error('The seed phrase is invalid.')
      }

      seedOrSigner = bip39.mnemonicToSeedSync(seedOrSigner)
    }

    const isSeed = seedOrSigner instanceof Uint8Array

    /** @private */
    this._seed = isSeed ? seedOrSigner : undefined

    /**
     * The default signer provided at construction. Accessed via {@link getSigner}
     * with no arguments.
     *
     * @protected
     * @type {ISigner | undefined}
     */
    this._defaultSigner = isSeed ? undefined : seedOrSigner

    /**
     * A map between signer names and signers added via {@link addSigner}.
     *
     * @protected
     * @type {Record<string, ISigner>}
     */
    this._signers = {}

    /**
     * A map between derivation paths and wallet accounts. The {@link dispose} method will automatically dispose
     * all the accounts in this map, so developers are encouraged to map all accounts accessed through the
     * {@link getAccount} and {@link getAccountByPath} methods.
     *
     * @protected
     * @type {Record<string, IWalletAccount>}
     */
    this._accounts = {}

    /**
     * The wallet configuration.
     *
     * @protected
     * @type {WalletConfig}
     */
    this._config = config
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
   * The seed of the wallet.
   *
   * @type {Uint8Array | undefined}
   */
  get seed () {
    return this._seed
  }

  /**
   * Registers a signer under the given name.
   *
   * @param {string} signerName - The signer name.
   * @param {ISigner} signer - The signer.
   * @throws {Error} If `signerName` is empty.
   */
  addSigner (signerName, signer) {
    if (!signerName) {
      throw new Error('Signer name is required.')
    }

    this._signers[signerName] = signer
  }

  /**
   * Returns a signer. With no arguments, returns the default signer provided
   * at construction. With a name, returns the signer registered under that
   * name via {@link addSigner}.
   *
   * @param {string} [signerName] - The signer name. Omit to get the default.
   * @returns {ISigner} The signer.
   * @throws {Error} If called with no arguments and no default signer was
   * provided at construction, or if called with a name that is not registered.
   */
  getSigner (signerName) {
    if (signerName === undefined) {
      if (this._defaultSigner === undefined) {
        throw new Error('No default signer registered.')
      }
      return this._defaultSigner
    }
    const signer = this._signers[signerName]
    if (signer === undefined) {
      throw new Error(`No signer registered with name "${signerName}".`)
    }
    return signer
  }

  /**
   * Returns the wallet account at a specific index (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
   *
   * @abstract
   * @param {number} [index] - The index of the account to get (default: 0).
   * @param {Object} [options] - Account options.
   * @param {string} [options.signerName] - The signer name. Omit to use the default signer.
   * @returns {Promise<IWalletAccount>} The account.
   * @throws {Error} If a signer name is given, but no signer exists with the given name.
   */
  async getAccount (index = 0, options = {}) {
    throw new NotImplementedError('getAccount(index, options?)')
  }

  /**
   * Returns the wallet account at a specific [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) derivation path.
   *
   * @abstract
   * @param {string} path - The derivation path (e.g. "0'/0/0").
   * @param {Object} [options] - Account options.
   * @param {string} [options.signerName] - The signer name. Omit to use the default signer.
   * @returns {Promise<IWalletAccount>} The account.
   * @throws {Error} If a signer name is given, but no signer exists with the given name.
   */
  async getAccountByPath (path, options = {}) {
    throw new NotImplementedError('getAccountByPath(path, options?)')
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
   * Disposes all wallet accounts and signers, clearing secret material from memory.
   */
  dispose () {
    for (const account of Object.values(this._accounts)) {
      account.dispose()
    }

    if (this._defaultSigner !== undefined) {
      this._defaultSigner.dispose()
    }

    for (const signer of Object.values(this._signers)) {
      signer.dispose()
    }

    this._accounts = {}
    this._defaultSigner = undefined
    this._signers = {}
  }
}
