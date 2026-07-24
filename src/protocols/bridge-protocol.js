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

/** @typedef {import('../wallet-account-read-only.js').IWalletAccountReadOnly} IWalletAccountReadOnly */

/** @typedef {import('../wallet-account.js').IWalletAccount} IWalletAccount */

/** @typedef {import('./errors.js').AccountRequiredError} AccountRequiredError */
/** @typedef {import('./errors.js').BridgeError} BridgeError */
/** @typedef {import('./errors.js').InvalidTokenError} InvalidTokenError */
/** @typedef {import('./errors.js').MaximumFeeExceededError} MaximumFeeExceededError */
/** @typedef {import('./errors.js').ReadOnlyAccountRequiredError} ReadOnlyAccountRequiredError */
/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').ValueError} ValueError */

/**
 * @typedef {Object} BridgeProtocolConfig
 * @property {number | bigint} [bridgeMaxFee] - The maximum fee amount for bridge operations.
 */

/**
 * @typedef {Object} BridgeOptions
 * @property {string} targetChain - The identifier of the destination blockchain (e.g., "arbitrum").
 * @property {string} recipient - The address of the recipient.
 * @property {string} token - The address of the token to bridge.
 * @property {number | bigint} amount - The amount of tokenss to bridge to the destination chain (in base unit).
 */

/**
 * @typedef {Object} BridgeResult
 * @property {string} hash - The hash of the bridge operation.
 * @property {bigint} fee - The gas cost.
 * @property {bigint} bridgeFee - The amount of native tokens paid to the bridge protocol.
 */

/** @interface */
export class IBridgeProtocol {
  /**
   * Bridges a token to a different blockchain.
   *
   * @param {BridgeOptions} options - The bridge's options.
   * @returns {Promise<BridgeResult>} The bridge's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a bridge.
   * @throws {ValueError} If the bridge options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the bridge.
   * @throws {BridgeError} If the bridge fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the bridge max. fee option.
   */
  async bridge (options) {
    throw new NotImplementedError('bridge(options)')
  }

  /**
   * Quotes the costs of a bridge operation.
   *
   * @param {BridgeOptions} options - The bridge's options.
   * @returns {Promise<Omit<BridgeResult, 'hash'>>} The bridge's quotes.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a swap.
   * @throws {ValueError} If the bridge options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the bridge.
   * @throws {BridgeError} If the bridge fails with an error.
   */
  async quoteBridge (options) {
    throw new NotImplementedError('quoteBridge(options)')
  }
}

/**
 * @abstract
 * @implements {IBridgeProtocol}
 */
export default class BridgeProtocol {
  /**
   * Creates a new read-only bridge protocol.
   *
   * @overload
   * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
   * @param {BridgeProtocolConfig} [config] - The bridge protocol configuration.
   */

  /**
   * Creates a new bridge protocol.
   *
   * @overload
   * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
   * @param {BridgeProtocolConfig} [config] - The bridge protocol configuration.
   */
  constructor (account, config = {}) {
    /**
     * The wallet account to use to interact with the protocol.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount}
     */
    this._account = account

    /**
     * The bridge protocol configuration.
     *
     * @protected
     * @type {BridgeProtocolConfig}
     */
    this._config = config
  }

  /**
   * Bridges a token to a different blockchain.
   *
   * @abstract
   * @param {BridgeOptions} options - The bridge's options.
   * @returns {Promise<BridgeResult>} The bridge's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a bridge.
   * @throws {ValueError} If the bridge options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the bridge.
   * @throws {BridgeError} If the bridge fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the bridge max. fee option.
   */
  async bridge (options) {
    throw new NotImplementedError('bridge(options)')
  }

  /**
   * Quotes the costs of a bridge operation.
   *
   * @abstract
   * @param {BridgeOptions} options - The bridge's options.
   * @returns {Promise<Omit<BridgeResult, 'hash'>>} The bridge's quotes.
   * @throws {ValueError} If the bridge options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the bridge.
   * @throws {BridgeError} If the bridge fails with an error.
   */
  async quoteBridge (options) {
    throw new NotImplementedError('quoteBridge(options)')
  }
}
