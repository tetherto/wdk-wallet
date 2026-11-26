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

import { DisposalError, InvalidSignerError, NoSuchElementError, NotImplementedError, ValueError } from './errors.js'

/** @typedef {import('./wallet-account.js').IWalletAccount} IWalletAccount */

/** @typedef {import('./signer.js').ISigner} ISigner */
/** @typedef {import('./disposable.js').IDisposable} IDisposable */

/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */

/**
 * @typedef {Object} WalletConfig
 * @property {number | bigint} [transactionMaxFee] - The maximum fee amount for sending transactions.
 * @property {number | bigint} [transferMaxFee] - The maximum fee amount for transfer operations.
 */

/**
 * @typedef {Object} FeeRates
 * @property {number | bigint} normal - The fee rate for transaction sent with normal priority.
 * @property {number | bigint} fast - The fee rate for transaction sent with fast priority.
 */

/**
 * @abstract
 * @template {ISigner} [TSigner=ISigner]
 * @implements {IDisposable}
 */
export default class WalletManager {
  /**
   * Creates a new wallet manager from a seed.
   *
   * @overload
   * @param {string | Uint8Array} seed - A BIP-39 mnemonic seed phrase, or a raw BIP-32 master seed (16-64 bytes).
   * @param {WalletConfig} [config] - The wallet configuration.
   * @throws {ValueError} If the seed is not a valid seed or BIP-39 seed phrase.
   */

  /**
   * Creates a new wallet manager from a default signer.
   *
   * @overload
   * @param {TSigner} signer - The default signer.
   * @param {WalletConfig} [config] - The wallet configuration.
   * @throws {InvalidSignerError} If the given signer doesn't support account derivation.
   */
  constructor (seedOrSigner, config = {}) {
    if (typeof seedOrSigner === 'string') {
      if (!WalletManager.isValidSeedPhrase(seedOrSigner)) {
        throw new ValueError('Invalid seed phrase.')
      }

      seedOrSigner = bip39.mnemonicToSeedSync(seedOrSigner)
    }

    const isSeed = seedOrSigner instanceof Uint8Array

    if (!isSeed && !seedOrSigner.isDerivable) {
      throw new InvalidSignerError('The default signer must be derivable. Non-derivable signers (e.g. private-key signers) can only be registered by name via addSigner.')
    }

    /** @private */
    this._seed = isSeed ? seedOrSigner : undefined

    /**
     * The default signer.
     *
     * @protected
     * @type {TSigner | undefined}
     */
    this._defaultSigner = isSeed ? undefined : seedOrSigner

    /**
     * A map between signer names and signers added via {@link addSigner}. It has a null prototype, so names
     * such as "constructor" or "__proto__" are treated as plain keys.
     *
     * @protected
     * @type {Record<string, TSigner>}
     */
    this._signers = Object.create(null)

    /**
     * A map between derivation paths and wallet accounts. The {@link dispose} method will automatically dispose
     * the accounts in this map that hold a private key, so developers are encouraged to map all accounts accessed
     * through the {@link getAccount} and {@link getAccountByPath} methods. It has a null prototype, so lookups
     * never resolve to inherited object properties.
     *
     * @protected
     * @type {Record<string, IWalletAccount>}
     */
    this._accounts = Object.create(null)

    /**
     * The wallet configuration.
     *
     * @protected
     * @type {WalletConfig}
     */
    this._config = config

    /** @private */
    this._disposed = false
  }

  /**
   * True if the wallet manager has been disposed.
   *
   * @type {boolean}
   */
  get disposed () {
    return this._disposed
  }

  /**
   * Returns a random [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrase.
   *
   * @param {12 | 24} [wordCount] - The number of words in the seed phrase (default: 12).
   * @returns {string} The seed phrase.
   */
  static getRandomSeedPhrase (wordCount = 12) {
    const strength = wordCount === 12 ? 128 : 256

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
   * Registers a signer with the given name.
   *
   * @param {string} signerName - The signer name.
   * @param {TSigner} signer - The signer.
   * @returns {this} The wallet manager.
   * @throws {ValueError} If the signer name is an empty or blank string.
   * @throws {DisposalError} If the wallet manager has been disposed.
   */
  addSigner (signerName, signer) {
    if (this.disposed) {
      throw new DisposalError('The wallet manager has been disposed.')
    }

    if (!signerName.trim()) {
      throw new ValueError('The signer name cannot be an empty or blank string.')
    }

    this._signers[signerName] = signer

    return this
  }

  /**
   * Returns the default signer, or the signer with the given name.
   *
   * @param {string} [signerName] - If set, returns the signer with the given name.
   * @returns {TSigner} The signer.
   * @throws {NoSuchElementError} If the default signer is not set, or no signers are found for the given name.
   */
  getSigner (signerName) {
    if (signerName === undefined) {
      if (this._defaultSigner === undefined) {
        throw new NoSuchElementError('No default signer set.')
      }

      return this._defaultSigner
    }

    const signer = this._signers[signerName]

    if (signer === undefined) {
      throw new NoSuchElementError(`No signer found with name "${signerName}".`)
    }

    return signer
  }

  /**
   * Returns a shallow copy of the map of signers registered via {@link addSigner}.
   * The default signer is not included; use {@link getSigner} with no arguments
   * to retrieve it.
   *
   * @returns {Record<string, TSigner>} A map of signer names to signers. Empty if no signers have been registered.
   */
  getSigners () {
    return { ...this._signers }
  }

  /**
   * Returns the wallet account at a specific index (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
   *
   * @overload
   * @param {number} [index] - The index of the account to get (default: 0).
   * @param {Object} [options] - Account options.
   * @param {string} [options.signerName] - The signer name.
   * @returns {Promise<IWalletAccount>} The account.
   * @throws {ValueError} If the index is not valid.
   * @throws {NoSuchElementError} If a signer name is given but no signer exists with that name.
   * @throws {InvalidSignerError} If the signer doesn't support account derivation.
   * @throws {DisposalError} If the wallet manager or the given signer has been disposed.
   */

  /**
   * Returns the wallet account associated with a registered signer. For
   * non-derivable signers (e.g., private-key signers), returns the signer's
   * single account. For derivable signers, returns the wallet account at the
   * signer's root, with no further derivation.
   *
   * @overload
   * @param {string} signerName - The signer name registered via {@link addSigner}.
   * @returns {Promise<IWalletAccount>} The account.
   * @throws {NoSuchElementError} If no signer exists with the given name.
   * @throws {DisposalError} If the wallet manager or the given signer has been disposed.
   */

  /** @abstract */
  async getAccount (indexOrSignerName = 0, options = {}) {
    throw new NotImplementedError('getAccount(indexOrSignerName, options?)')
  }

  /**
   * Returns the wallet account at a specific [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) derivation path.
   *
   * @abstract
   * @param {string} path - The derivation path (e.g. "0'/0/0").
   * @param {Object} [options] - Account options.
   * @param {string} [options.signerName] - The signer name. Omit to use the default signer.
   * @returns {Promise<IWalletAccount>} The account.
   * @throws {ValueError} If the path is not valid.
   * @throws {NoSuchElementError} If a signer name is given but no signer exists with that name.
   * @throws {InvalidSignerError} If the signer doesn't support account derivation.
   * @throws {DisposalError} If the wallet manager or the given signer has been disposed.
   */
  async getAccountByPath (path, options = {}) {
    throw new NotImplementedError('getAccountByPath(path, options?)')
  }

  /**
   * Returns the current fee rates.
   *
   * @abstract
   * @returns {Promise<FeeRates>} The fee rates (in base unit).
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch fee rates.
   */
  async getFeeRates () {
    throw new NotImplementedError('getFeeRates()')
  }

  /**
   * Disposes the cached wallet accounts that hold a private key. An account created directly on a signer added via
   * {@link addSigner} keeps its key. Signers supplied by the caller (as the default signer or via {@link addSigner})
   * are never disposed, and the seed stored by this class is not cleared.
   */
  dispose () {
    if (this._disposed) return

    for (const account of Object.values(this._accounts)) {
      if (account.keyPair?.privateKey) {
        account.dispose()
      }
    }

    this._accounts = Object.create(null)

    this._disposed = true
  }
}
