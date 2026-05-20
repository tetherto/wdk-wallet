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

import { NotImplementedError } from '../errors.js'

/** @typedef {import('../wallet-account-read-only.js').IWalletAccountReadOnly} IWalletAccountReadOnly */

/** @typedef {import('../wallet-account.js').IWalletAccount} IWalletAccount */

/**
 * @typedef {'pending' | 'action-required' | 'completed' | 'failed'
 *          | 'refund-pending' | 'refunded' | 'cancelled' | 'expired' | 'partial'} SwidgeStatus
 */

/**
 * @typedef {'gas' | 'protocol' | 'bridge' | 'relayer'
 *          | 'application' | 'affiliate' | 'liquidity' | 'other'} SwidgeFeeType
 */

/**
 * @typedef {Object} SwidgeProtocolConfig
 * @property {bigint} [swidgeMaxFee] - The maximum total fee for swidge operations.
 * @property {bigint} [swidgeMaxProtocolFee] - The maximum protocol fee for swidge operations.
 */

/**
 * @typedef {SwidgeCommonOptions & (SwidgeExactInOptions | SwidgeExactOutOptions)} SwidgeOptions
 */

/**
 * @typedef {Object} SwidgeCommonOptions
 * @property {string} fromToken - The provider-specific identifier or address of the source token.
 * @property {string} toToken - The provider-specific identifier or address of the destination token.
 * @property {string | number} toChain - The identifier of the destination chain.
 * @property {string} [recipient] - The address that will receive the output tokens.
 * @property {string} [refundAddress] - The address that will receive refunds if the tx cannot complete.
 * @property {number} [slippage] - The maximum acceptable slippage as a decimal (e.g., 0.01 for 1%).
 */

/**
 * @typedef {Object} SwidgeExactInOptions
 * @property {number | bigint} fromTokenAmount - The exact amount of source tokens to spend (in base unit).
 * @property {never} [toTokenAmount] - Not applicable for exact-in operations.
 */

/**
 * @typedef {Object} SwidgeExactOutOptions
 * @property {never} [fromTokenAmount] - Not applicable for exact-out operations.
 * @property {number | bigint} toTokenAmount - The exact amount of destination tokens to receive (in base unit).
 */

/**
 * @typedef {Object} SwidgeFee
 * @property {SwidgeFeeType} type - The category of the fee.
 * @property {bigint} amount - The fee amount in base units.
 * @property {string} token - The token in which the fee is denominated.
 * @property {string | number} [chain] - The chain on which the fee is charged.
 * @property {boolean} [included] - Whether the fee is already included in the quoted amounts.
 * @property {string} [description] - A human-readable description of the fee.
 */

/**
 * @typedef {Object} SwidgeTransaction
 * @property {string} hash - The transaction hash.
 * @property {string | number} [chain] - The chain on which the transaction occurred.
 * @property {'source' | 'destination' | 'approval' | 'refund' | 'other'} [type] - The role of the transaction within the swidge.
 */

/**
 * @typedef {Object} SwidgeQuote
 * @property {bigint} fromTokenAmount - The amount of source tokens to spend.
 * @property {bigint} toTokenAmount - The estimated amount of destination tokens to receive.
 * @property {bigint} toTokenAmountMin - The minimum guaranteed amount after slippage.
 * @property {bigint} [fee] - The total aggregated fee.
 * @property {bigint} [protocolFee] - The protocol-specific fee portion.
 * @property {SwidgeFee[]} [fees] - Itemized fee breakdown.
 * @property {number} [estimatedDuration] - Estimated duration in seconds.
 * @property {number} [expiry] - Unix timestamp (seconds) at which the quote expires.
 * @property {number} [priceImpact] - Provider-reported estimated price impact as a decimal (e.g., 0.01 for 1%).
 * @property {object} providerData - Opaque provider-specific data required to execute the swidge.
 */

/**
 * @typedef {Object} SwidgeResult
 * @property {string} id - The unique swidge execution identifier.
 * @property {string} [hash] - The primary transaction hash (if available immediately).
 * @property {bigint} [fee] - The total aggregated fee charged.
 * @property {bigint} [protocolFee] - The protocol-specific fee charged.
 * @property {SwidgeFee[]} [fees] - Itemized fee breakdown.
 * @property {SwidgeTransaction[]} [transactions] - Transactions produced by the swidge execution.
 * @property {bigint} fromTokenAmount - The actual amount of source tokens spent.
 * @property {bigint} toTokenAmount - The actual or expected amount of destination tokens.
 * @property {bigint} [toTokenAmountMin] - The minimum guaranteed amount after slippage.
 * @property {object} [providerData] - Opaque provider-specific data for status tracking.
 */

/**
 * @typedef {Object} SwidgeStatusOptions
 * @property {string | number} [fromChain] - The source chain identifier.
 * @property {string | number} [toChain] - The destination chain identifier.
 * @property {object} [providerData] - Opaque provider-specific data to assist status lookup.
 */

/**
 * @typedef {Object} SwidgeStatusResult
 * @property {SwidgeStatus} status - The current status of the swidge.
 * @property {SwidgeTransaction[]} [transactions] - Transactions associated with the swidge.
 * @property {object} [providerData] - Opaque provider-specific data.
 */

/**
 * @typedef {Object} SwidgeSupportedChain
 * @property {string | number} id - The provider-specific chain identifier.
 * @property {string} name - The human-readable chain name.
 * @property {string} [type] - The chain or virtual machine type (e.g., 'evm', 'svm', 'utxo').
 * @property {string} [nativeToken] - The symbol of the chain's native token.
 * @property {object} [providerData] - Opaque provider-specific metadata.
 */

/**
 * @typedef {Object} SwidgeSupportedToken
 * @property {string} token - The provider-specific token identifier to use in swidge operations.
 * @property {string | number} chain - The chain on which the token is available.
 * @property {string} symbol - The token symbol.
 * @property {number} decimals - The number of decimal places for the token's base unit.
 * @property {string} [address] - The token contract address, if applicable.
 * @property {string} [name] - The token's full name.
 * @property {object} [providerData] - Opaque provider-specific metadata.
 */

/**
 * @typedef {Object} SwidgeSupportedTokensOptions
 * @property {string | number} [chain] - Filters tokens by chain.
 * @property {string | number} [fromChain] - The optional source chain for route-scoped discovery.
 * @property {string} [fromToken] - The optional source token for route-scoped discovery.
 * @property {string | number} [toChain] - The optional destination chain for route-scoped discovery.
 */

/** @interface */
export class ISwidgeProtocol {
  /**
   * Quotes a cross-chain swap/bridge operation.
   *
   * @param {SwidgeOptions} options - The swidge options.
   * @returns {Promise<SwidgeQuote>} The quoted swidge details.
   */
  async quoteSwidge (options) {
    throw new NotImplementedError('quoteSwidge(options)')
  }

  /**
   * Executes a previously quoted swidge.
   *
   * @param {SwidgeQuote} quote - The quote returned by quoteSwidge.
   * @param {SwidgeProtocolConfig} [config] - Optional fee limits for the execution.
   * @returns {Promise<SwidgeResult>} The swidge execution result.
   */
  async executeSwidge (quote, config) {
    throw new NotImplementedError('executeSwidge(quote, config)')
  }

  /**
   * Retrieves the current status of an in-flight swidge.
   *
   * @param {string} id - The swidge execution identifier returned by executeSwidge.
   * @param {SwidgeStatusOptions} [options] - Optional hints to assist provider lookups.
   * @returns {Promise<SwidgeStatusResult>} The current swidge status.
   */
  async getSwidgeStatus (id, options) {
    throw new NotImplementedError('getSwidgeStatus(id, options)')
  }

  /**
   * Retrieves the chains supported by the provider for swidge operations.
   *
   * @returns {Promise<SwidgeSupportedChain[]>} The supported chains.
   */
  async getSupportedChains () {
    throw new NotImplementedError('getSupportedChains()')
  }

  /**
   * Retrieves the tokens supported by the provider for swidge operations.
   *
   * @param {SwidgeSupportedTokensOptions} [options] - Optional filters for chain- or route-scoped token discovery.
   * @returns {Promise<SwidgeSupportedToken[]>} The supported tokens.
   */
  async getSupportedTokens (options) {
    throw new NotImplementedError('getSupportedTokens(options)')
  }
}

/**
 * @abstract
 * @implements {ISwidgeProtocol}
 */
export default class SwidgeProtocol {
  /**
   * Creates a new read-only swidge protocol.
   *
   * @overload
   * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
   * @param {SwidgeProtocolConfig} [config] - The swidge protocol configuration.
   */

  /**
   * Creates a new swidge protocol.
   *
   * @overload
   * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
   * @param {SwidgeProtocolConfig} [config] - The swidge protocol configuration.
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
     * The swidge protocol configuration.
     *
     * @protected
     * @type {SwidgeProtocolConfig}
     */
    this._config = config
  }

  /**
   * Quotes a cross-chain swap/bridge operation.
   *
   * @abstract
   * @param {SwidgeOptions} options - The swidge options.
   * @returns {Promise<SwidgeQuote>} The quoted swidge details.
   */
  async quoteSwidge (options) {
    throw new NotImplementedError('quoteSwidge(options)')
  }

  /**
   * Executes a previously quoted swidge.
   *
   * @abstract
   * @param {SwidgeQuote} quote - The quote returned by quoteSwidge.
   * @param {SwidgeProtocolConfig} [config] - Optional fee limits for the execution.
   * @returns {Promise<SwidgeResult>} The swidge execution result.
   */
  async executeSwidge (quote, config) {
    throw new NotImplementedError('executeSwidge(quote, config)')
  }

  /**
   * Retrieves the current status of an in-flight swidge.
   *
   * @abstract
   * @param {string} id - The swidge execution identifier returned by executeSwidge.
   * @param {SwidgeStatusOptions} [options] - Optional hints to assist provider lookups.
   * @returns {Promise<SwidgeStatusResult>} The current swidge status.
   */
  async getSwidgeStatus (id, options) {
    throw new NotImplementedError('getSwidgeStatus(id, options)')
  }

  /**
   * Retrieves the chains supported by the provider for swidge operations.
   *
   * @abstract
   * @returns {Promise<SwidgeSupportedChain[]>} The supported chains.
   */
  async getSupportedChains () {
    throw new NotImplementedError('getSupportedChains()')
  }

  /**
   * Retrieves the tokens supported by the provider for swidge operations.
   *
   * @abstract
   * @param {SwidgeSupportedTokensOptions} [options] - Optional filters for chain- or route-scoped token discovery.
   * @returns {Promise<SwidgeSupportedToken[]>} The supported tokens.
   */
  async getSupportedTokens (options) {
    throw new NotImplementedError('getSupportedTokens(options)')
  }
}
