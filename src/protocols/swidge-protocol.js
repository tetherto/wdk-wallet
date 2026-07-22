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

import { BridgeError, NotImplementedError, SwapError, SwidgeError } from './errors.js'

/** @typedef {import('../wallet-account-read-only.js').IWalletAccountReadOnly} IWalletAccountReadOnly */

/** @typedef {import('../wallet-account.js').IWalletAccount} IWalletAccount */

/** @typedef {import('./swap-protocol.js').ISwapProtocol} ISwapProtocol */
/** @typedef {import('./swap-protocol.js').SwapOptions} SwapOptions */
/** @typedef {import('./swap-protocol.js').SwapResult} SwapResult */

/** @typedef {import('./bridge-protocol.js').IBridgeProtocol} IBridgeProtocol */
/** @typedef {import('./bridge-protocol.js').BridgeOptions} BridgeOptions */
/** @typedef {import('./bridge-protocol.js').BridgeResult} BridgeResult */

/** @typedef {import('./errors.js').AccountRequiredError} AccountRequiredError */
/** @typedef {import('./errors.js').InvalidTokenError} InvalidTokenError */
/** @typedef {import('./errors.js').MaximumFeeExceededError} MaximumFeeExceededError */
/** @typedef {import('./errors.js').NoSuchElementError} NoSuchElementError */
/** @typedef {import('./errors.js').ReadOnlyAccountRequiredError} ReadOnlyAccountRequiredError */
/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').ValueError} ValueError */

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
 * @extends {ISwapProtocol}
 * @extends {IBridgeProtocol}
 */
export class ISwidgeProtocol {
  /**
   * Quotes the estimated costs and output of a cross-chain swap/bridge operation.
   * Returns a non-binding quote; the actual execution is performed
   * by {@link swidge}.
   *
   * @param {SwidgeOptions} options - The swidge options.
   * @returns {Promise<SwidgeQuote>} The quoted swidge details.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a swidge.
   * @throws {ValueError} If the swidge options are not valid.
   * @throws {InvalidTokenError} If the from or to tokens are not valid ERC 20 token's addresses.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the swidge.
   * @throws {SwidgeError} If the swidge fails with an error.
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
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a swidge.
   * @throws {ValueError} If the swidge options are not valid.
   * @throws {InvalidTokenError} If the from or to tokens are not valid ERC 20 token's addresses.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the swidge.
   * @throws {SwidgeError} If the swidge fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the max. network or protocol fee options.
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
   * @throws {ValueError} If the id is not valid.
   * @throws {NoSuchElementError} If no swidge exists for the given id.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the swidge's status.
   */
  async getSwidgeStatus (id, options) {
    throw new NotImplementedError('getSwidgeStatus(id, options)')
  }

  /**
   * Retrieves the chains supported by the provider for swidge operations.
   *
   * @returns {Promise<SwidgeSupportedChain[]>} The supported chains.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available blockchains.
   */
  async getSupportedChains () {
    throw new NotImplementedError('getSupportedChains()')
  }

  /**
   * Retrieves the tokens supported by the provider for swidge operations.
   *
   * @param {SwidgeSupportedTokensOptions} [options] - Optional filters for chain- or route-scoped token discovery.
   * @returns {Promise<SwidgeSupportedToken[]>} The supported tokens.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available tokens.
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
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a swap.
   * @throws {ValueError} If the swap options are not valid.
   * @throws {InvalidTokenError} If the input or output tokens are not valid ERC 20 token's addresses.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the swap.
   * @throws {SwapError} If the swap fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the max. network or protocol fee options.
   */
  async swap (options) {
    try {
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
    } catch (error) {
      if (error instanceof SwidgeError) {
        throw new SwapError(error.message, { reason: error.reason, cause: error })
      }

      throw error
    }
  }

  /**
   * Quotes the costs of a swap operation by delegating to {@link quoteSwidge}.
   *
   * @param {SwapOptions} options - The swap's options.
   * @returns {Promise<Omit<SwapResult, 'hash'>>} The swap's quotes.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a swap.
   * @throws {ValueError} If the swap options are not valid.
   * @throws {InvalidTokenError} If the input or output tokens are not valid ERC 20 token's addresses.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the swap.
   * @throws {SwapError} If the swap fails with an error.
   */
  async quoteSwap (options) {
    try {
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
    } catch (error) {
      if (error instanceof SwidgeError) {
        throw new SwapError(error.message, { reason: error.reason, cause: error })
      }

      throw error
    }
  }

  /**
   * Bridges a token to a different blockchain by delegating to {@link swidge}.
   *
   * @param {BridgeOptions} options - The bridge's options.
   * @returns {Promise<BridgeResult>} The bridge's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a bridge.
   * @throws {ValueError} If the bridge options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the bridge.
   * @throws {BridgeError} If the bridge fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the max. network or protocol fee options.
   */
  async bridge (options) {
    try {
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
    } catch (error) {
      if (error instanceof SwidgeError) {
        throw new BridgeError(error.message, { reason: error.reason, cause: error })
      }

      throw error
    }
  }

  /**
   * Quotes the costs of a bridge operation by delegating to {@link quoteSwidge}.
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
    try {
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
    } catch (error) {
      if (error instanceof SwidgeError) {
        throw new BridgeError(error.message, { reason: error.reason, cause: error })
      }

      throw error
    }
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
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a swidge.
   * @throws {ValueError} If the swidge options are not valid.
   * @throws {InvalidTokenError} If the from or to tokens are not valid ERC 20 token's addresses.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the swidge.
   * @throws {SwidgeError} If the swidge fails with an error.
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
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a swidge.
   * @throws {ValueError} If the swidge options are not valid.
   * @throws {InvalidTokenError} If the from or to tokens are not valid ERC 20 token's addresses.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the swidge.
   * @throws {SwidgeError} If the swidge fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the max. network or protocol fee options.
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
   * @throws {ValueError} If the id is not valid.
   * @throws {NoSuchElementError} If no swidge exists for the given id.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the swidge's status.
   */
  async getSwidgeStatus (id, options) {
    throw new NotImplementedError('getSwidgeStatus(id, options)')
  }

  /**
   * Retrieves the chains supported by the provider for swidge operations.
   *
   * @abstract
   * @returns {Promise<SwidgeSupportedChain[]>} The supported chains.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available blockchains.
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
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available tokens.
   */
  async getSupportedTokens (options) {
    throw new NotImplementedError('getSupportedTokens(options)')
  }
}
