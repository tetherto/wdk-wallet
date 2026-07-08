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

/** @typedef {import('./swap-protocol.js').ISwapProtocol} ISwapProtocol */
/** @typedef {import('./swap-protocol.js').SwapOptions} SwapOptions */
/** @typedef {import('./swap-protocol.js').SwapResult} SwapResult */

/** @typedef {import('./bridge-protocol.js').IBridgeProtocol} IBridgeProtocol */
/** @typedef {import('./bridge-protocol.js').BridgeOptions} BridgeOptions */
/** @typedef {import('./bridge-protocol.js').BridgeResult} BridgeResult */

/**
 * @typedef {'pending' | 'action-required' | 'completed' | 'failed'
 *          | 'refund-pending' | 'refunded' | 'cancelled' | 'expired' | 'partial'} SwidgeStatus
 */

/**
 * @typedef {'network' | 'protocol' | 'affiliate' | 'other'} SwidgeFeeType
 */

/**
 * @typedef {Object} SwidgeProtocolConfig
 * @property {number | bigint} [maxNetworkFeeBps] - Maximum acceptable network fee in basis points of the input amount.
 * @property {number | bigint} [maxProtocolFeeBps] - Maximum acceptable protocol fee in basis points of the input amount.
 */

/**
 * @typedef {SwidgeCommonOptions & (SwidgeExactInOptions | SwidgeExactOutOptions)} SwidgeOptions
 */

/**
 * @typedef {Object} SwidgeCommonOptions
 * @property {string} fromToken - The provider-specific identifier or address of the source token.
 * @property {string} toToken - The provider-specific identifier or address of the destination token.
 * @property {string | number} [toChain] - The identifier of the destination chain. If omitted, defaults to the source chain (same-chain swap).
 * @property {string} [recipient] - The address that will receive the output tokens.
 * @property {string} [refundAddress] - The address that will receive refunds if the tx cannot complete.
 * @property {number} [slippage] - The maximum acceptable slippage as a decimal (e.g., 0.01 for 1%).
 * @property {number | bigint} [minAmountOut] - The minimum acceptable amount of destination tokens to receive (in base unit).
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
 * Non-binding quote for a swidge operation.
 * Providers that internally decompose the operation into multiple sequential transactions
 * should encapsulate that decomposition behind a single quote.
 *
 * @typedef {Object} SwidgeQuote
 * @property {bigint} fromTokenAmount - The amount of source tokens to spend.
 * @property {bigint} toTokenAmount - The estimated amount of destination tokens to receive.
 * @property {bigint} toTokenAmountMin - The minimum guaranteed amount after slippage.
 * @property {SwidgeFee[]} fees - Itemised fee breakdown.
 * @property {number} [estimatedDuration] - Estimated duration in seconds.
 * @property {number} [expiry] - Unix timestamp (seconds) at which the quote expires.
 * @property {number} [priceImpact] - Provider-reported estimated price impact as a decimal (e.g., 0.01 for 1%).
 */

/**
 * @typedef {Object} SwidgeResult
 * @property {string} id - The unique swidge execution identifier.
 * @property {string} [hash] - The primary transaction hash (if available immediately).
 * @property {SwidgeFee[]} fees - Itemised fee breakdown.
 * @property {SwidgeTransaction[]} [transactions] - Transactions produced by the swidge execution.
 * @property {bigint} fromTokenAmount - The actual amount of source tokens spent.
 * @property {bigint} toTokenAmount - The actual or expected amount of destination tokens.
 * @property {bigint} [toTokenAmountMin] - The minimum guaranteed amount after slippage.
 */

/**
 * @typedef {Object} SwidgeStatusOptions
 * @property {string | number} [fromChain] - The source chain identifier.
 * @property {string | number} [toChain] - The destination chain identifier.
 */

/**
 * @typedef {Object} SwidgeStatusResult
 * @property {SwidgeStatus} status - The current status of the swidge.
 * @property {SwidgeTransaction[]} [transactions] - Transactions associated with the swidge.
 */

/**
 * @typedef {Object} SwidgeSupportedChain
 * @property {string | number} id - The provider-specific chain identifier.
 * @property {string} name - The human-readable chain name.
 * @property {string} type - The chain or virtual machine type (e.g., 'evm', 'svm', 'utxo').
 * @property {string} nativeToken - The symbol of the chain's native token.
 */

/**
 * @typedef {Object} SwidgeSupportedToken
 * @property {string} token - The provider-specific token identifier to use in swidge operations.
 * @property {string | number} chain - The chain on which the token is available.
 * @property {string} symbol - The token symbol.
 * @property {number} decimals - The number of decimal places for the token's base unit.
 * @property {string} [address] - The token contract address, if applicable.
 * @property {string} [name] - The token's full name.
 */

/**
 * @typedef {Object} SwidgeSupportedTokensOptions
 * @property {string | number} [fromChain] - The optional source chain for route-scoped discovery.
 * @property {string} [fromToken] - The optional source token for route-scoped discovery.
 * @property {string | number} [toChain] - The optional destination chain for route-scoped discovery.
 */

/**
 * @interface
 * @implements {ISwapProtocol}
 * @implements {IBridgeProtocol}
 */
export class ISwidgeProtocol {
  /**
   * Quotes the estimated costs and output of a cross-chain swap/bridge operation.
   * Returns a non-binding quote; the actual execution is performed
   * by {@link swidge}.
   *
   * @param {SwidgeOptions} options - The swidge options.
   * @returns {Promise<SwidgeQuote>} The quoted swidge details.
   */
  async quoteSwidge (options) {
    throw new NotImplementedError('quoteSwidge(options)')
  }

  /**
   * Executes a swidge operation.
   *
   * @param {SwidgeOptions} options - The swidge options.
   * @param {SwidgeProtocolConfig} [config] - Optional provider-specific execution configuration.
   * @returns {Promise<SwidgeResult>} The swidge execution result.
   */
  async swidge (options, config) {
    throw new NotImplementedError('swidge(options, config)')
  }

  /**
   * Retrieves the current status of an in-flight swidge.
   *
   * @param {string} id - The swidge execution identifier returned by swidge.
   * @param {SwidgeStatusOptions} [options] - Optional hints to assist provider lookups.
   * @returns {Promise<SwidgeStatusResult>} The current swidge status.
   * @throws {Error} If the id is invalid, or no swidge exists with the given identifier.
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
 * @implements {ISwapProtocol}
 * @implements {IBridgeProtocol}
 */
export default class SwidgeProtocol {
  /**
   * Creates a new swidge protocol without binding it to a wallet account.
   *
   * @overload
   * @param {undefined} [account] - The wallet account to use to interact with the protocol.
   * @param {SwidgeProtocolConfig} [config] - The swidge protocol configuration.
   */

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
     * @type {IWalletAccountReadOnly | IWalletAccount | undefined}
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
   * Swaps a pair of tokens by delegating to {@link swidge}.
   *
   * @param {SwapOptions} options - The swap's options.
   * @returns {Promise<SwapResult>} The swap's result.
   * @throws {Error} If no account, or a read-only account was given at construction.
   */
  async swap (options) {
    const result = await this.swidge({
      fromToken: options.tokenIn,
      toToken: options.tokenOut,
      recipient: options.to,
      fromTokenAmount: options.tokenInAmount,
      toTokenAmount: options.tokenOutAmount,
      minAmountOut: options.minAmountOut
    })
    const fee = result.fees.reduce((acc, f) => acc + f.amount, 0n)
    return { hash: result.id, fee, tokenInAmount: result.fromTokenAmount, tokenOutAmount: result.toTokenAmount }
  }

  /**
   * Quotes the costs of a swap operation by delegating to {@link quoteSwidge}.
   *
   * @param {SwapOptions} options - The swap's options.
   * @returns {Promise<Omit<SwapResult, 'hash'>>} The swap's quotes.
   * @throws {Error} If no account was given at construction.
   */
  async quoteSwap (options) {
    const result = await this.quoteSwidge({
      fromToken: options.tokenIn,
      toToken: options.tokenOut,
      recipient: options.to,
      fromTokenAmount: options.tokenInAmount,
      toTokenAmount: options.tokenOutAmount,
      minAmountOut: options.minAmountOut
    })
    const fee = result.fees.reduce((acc, f) => acc + f.amount, 0n)
    return { fee, tokenInAmount: result.fromTokenAmount, tokenOutAmount: result.toTokenAmount }
  }

  /**
   * Bridges a token to a different blockchain by delegating to {@link swidge}.
   *
   * @param {BridgeOptions} options - The bridge's options.
   * @returns {Promise<BridgeResult>} The bridge's result.
   * @throws {Error} If no account, or a read-only account was given at construction.
   */
  async bridge (options) {
    const { id: hash, fees } = await this.swidge({
      fromToken: options.token,
      toToken: options.token,
      toChain: options.targetChain,
      recipient: options.recipient,
      fromTokenAmount: options.amount
    })
    const fee = fees.filter(f => f.type === 'network')
      .reduce((acc, { amount }) => acc + amount, 0n)
    const bridgeFee = fees.filter(f => f.type === 'protocol')
      .reduce((acc, { amount }) => acc + amount, 0n)
    return { hash, fee, bridgeFee }
  }

  /**
   * Quotes the costs of a bridge operation by delegating to {@link quoteSwidge}.
   *
   * @param {BridgeOptions} options - The bridge's options.
   * @returns {Promise<Omit<BridgeResult, 'hash'>>} The bridge's quotes.
   * @throws {Error} If no account was given at construction.
   */
  async quoteBridge (options) {
    const { fees } = await this.quoteSwidge({
      fromToken: options.token,
      toToken: options.token,
      toChain: options.targetChain,
      recipient: options.recipient,
      fromTokenAmount: options.amount
    })
    const fee = fees.filter(f => f.type === 'network')
      .reduce((acc, { amount }) => acc + amount, 0n)
    const bridgeFee = fees.filter(f => f.type === 'protocol')
      .reduce((acc, { amount }) => acc + amount, 0n)
    return { fee, bridgeFee }
  }

  /**
   * Quotes the estimated costs and output of a swidge operation.
   * Returns a non-binding quote; the actual execution is performed
   * by {@link swidge}.
   *
   * @abstract
   * @param {SwidgeOptions} options - The swidge options.
   * @returns {Promise<SwidgeQuote>} The quoted swidge details.
   * @throws {Error} If no account was given at construction.
   */
  async quoteSwidge (options) {
    throw new NotImplementedError('quoteSwidge(options)')
  }

  /**
   * Executes a swidge operation.
   *
   * @abstract
   * @param {SwidgeOptions} options - The swidge options.
   * @param {SwidgeProtocolConfig} [config] - Optional provider-specific execution configuration.
   * @returns {Promise<SwidgeResult>} The swidge execution result.
   * @throws {Error} If no account, or a read-only account was given at construction.
   */
  async swidge (options, config) {
    throw new NotImplementedError('swidge(options, config)')
  }

  /**
   * Retrieves the current status of an in-flight swidge.
   *
   * @abstract
   * @param {string} id - The swidge execution identifier returned by swidge.
   * @param {SwidgeStatusOptions} [options] - Optional hints to assist provider lookups.
   * @returns {Promise<SwidgeStatusResult>} The current swidge status.
   * @throws {Error} If the id is invalid, or no swidge exists with the given identifier.
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
