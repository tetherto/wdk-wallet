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

import { NotImplementedError, UnsupportedOperationError } from '../errors.js'

/** @typedef {import('../wallet-account-read-only.js').IWalletAccountReadOnly} IWalletAccountReadOnly */

/** @typedef {import('../wallet-account.js').IWalletAccount} IWalletAccount */

/** @typedef {import('../errors.js').AccountRequiredError} AccountRequiredError */

/**
 * A blockchain identifier: a numeric chain id (e.g. `1`) or a provider-specific
 * chain name (e.g. `'ethereum'`).
 *
 * @typedef {string | number} Blockchain
 */

/**
 * How a provider re-processes a deposit that was not picked up automatically.
 * `reindex` re-scans a known source transaction (Orchestra, Relay); `none` means
 * no such call is exposed. This is about provider-side reprocessing of a missed
 * deposit, not about fund custody — whether deposited funds are recoverable is
 * governed by {@link SdaCustodyModel}. Re-enabling an idle/expired address is the
 * activation lifecycle ({@link SdaActivationModel} `'ttl'` +
 * {@link ISdaProtocol#renewDepositAddress}), not recovery.
 *
 * @typedef {'reindex' | 'none'} SdaRecoveryMode
 */

/**
 * The activation lifecycle of a deposit address. `'none'` — the address is live
 * as soon as it is created. `'required'` — the address must be activated (so the
 * provider starts monitoring it) before it can receive deposits. `'ttl'` —
 * activation expires and must be refreshed via {@link ISdaProtocol#renewDepositAddress}.
 *
 * @typedef {'none' | 'required' | 'ttl'} SdaActivationModel
 */

/**
 * Who controls deposited funds while a deposit is in flight. `'trusted-operator'`
 * — the provider holds the deposit address and the funds (recovery means asking
 * the provider to reprocess). `'self-custodial'` — the address is an on-chain
 * contract whose withdrawal rights are fixed in code (e.g. the recipient can
 * withdraw immediately, an optional custodial withdrawer only after a timelock),
 * so funds are recoverable on-chain without the provider.
 *
 * @typedef {'self-custodial' | 'trusted-operator'} SdaCustodyModel
 */

/**
 * How a provider lets routes be discovered. `'full'` means
 * {@link ISdaProtocol#getSupportedRoutes} returns every route with no filters;
 * `'by-chain-pair'` means a source and destination chain must be supplied.
 *
 * @typedef {'full' | 'by-chain-pair'} SdaRouteDiscoveryMode
 */

/**
 * A normalized, protocol-agnostic token reference. `token` is the identifier
 * the provider expects in SDA calls; `address` is the on-chain contract address
 * when applicable (absent for native gas tokens).
 *
 * @typedef {Object} SdaToken
 * @property {string} token - The provider-specific token identifier to use in SDA calls.
 * @property {Blockchain} chain - The chain on which the token lives.
 * @property {string} symbol - The token symbol (e.g., 'USDC', 'USDT').
 * @property {number} decimals - The number of decimal places for the token's base unit.
 * @property {string} [address] - The token contract address, if applicable.
 * @property {string} [name] - The token's full name.
 */

/**
 * Per-route deposit limits, denominated in the base unit of the route's input
 * token. Either bound may be absent when the provider does not enforce it.
 *
 * @typedef {Object} SdaLimits
 * @property {number | bigint} [min] - Minimum deposit amount, in the input token's base unit.
 * @property {number | bigint} [max] - Maximum deposit amount, in the input token's base unit.
 */

/**
 * Optional filters for narrowing route discovery.
 *
 * @typedef {Object} SdaRoutesOptions
 * @property {Blockchain} [sourceChain] - Restrict to routes that accept deposits from this chain.
 * @property {string} [sourceToken] - Restrict to routes that accept this input token.
 * @property {Blockchain} [destinationChain] - Restrict to routes that deliver to this chain.
 * @property {string} [destinationAsset] - Restrict to routes that deliver this asset.
 */

/**
 * A supported conversion route: one or more source chains and their accepted
 * input tokens, the destination chain, and the asset delivered there.
 *
 * @typedef {Object} SdaRoute
 * @property {Blockchain[]} sourceChains - The source chains this route accepts deposits from. A list because some providers issue one address valid across a VM family.
 * @property {SdaToken[]} inputTokens - The deposit tokens accepted on the source side.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {SdaToken} destinationAsset - The asset delivered to the destination (e.g., USDT).
 * @property {SdaLimits} [limits] - Deposit limits for this route.
 * @property {boolean} [reusable] - Whether addresses issued for this route can receive more than one deposit.
 * @property {number} [estimatedDuration] - Typical end-to-end duration in seconds.
 */

/**
 * Options for fetching a deposit quote. Required up front by providers whose
 * addresses are bound to a quote (e.g., Rhino); optional otherwise.
 *
 * @typedef {Object} SdaQuoteOptions
 * @property {Blockchain} sourceChain - The chain the deposit originates from.
 * @property {string} inputToken - The provider identifier of the token being deposited.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {string} destinationAsset - The provider identifier of the asset to deliver.
 * @property {number | bigint} inputAmount - The amount to deposit, in the input token's base unit.
 */

/**
 * The category of a fee charged by the provider.
 *
 * @typedef {'network' | 'protocol' | 'affiliate' | 'other'} SdaFeeType
 */

/**
 * A single itemised fee.
 *
 * @typedef {Object} SdaFee
 * @property {SdaFeeType} type - The category of the fee.
 * @property {bigint} amount - The fee amount, in the fee token's base unit.
 * @property {string} token - The token in which the fee is denominated.
 * @property {Blockchain} [chain] - The chain on which the fee is charged.
 * @property {boolean} [included] - Whether the fee is already reflected in the quoted output amount.
 * @property {string} [description] - A human-readable description of the fee.
 */

/**
 * A non-binding estimate of the asset delivered for a given deposit. Some
 * providers return an `id` that must be passed to {@link ISdaProtocol#createDepositAddress}
 * to bind the address to this quote.
 *
 * @typedef {Object} SdaQuote
 * @property {Blockchain} inputChain - The chain the deposit originates from.
 * @property {string} inputToken - The provider identifier of the deposited token.
 * @property {bigint} inputAmount - The amount deposited, in the input token's base unit.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {string} destinationAsset - The provider identifier of the delivered asset.
 * @property {bigint} outputAmount - The estimated amount delivered, in the destination asset's base unit.
 * @property {SdaFee[]} fees - Itemised fee breakdown.
 * @property {string} [rate] - The effective conversion rate as a string, to avoid precision loss.
 * @property {number} [expiry] - Unix timestamp (seconds) at which the quote expires.
 * @property {string} [id] - The provider quote identifier, when an address must be bound to this quote.
 */

/**
 * Options for creating a deposit address.
 *
 * @typedef {Object} SdaCreateOptions
 * @property {Blockchain[]} sourceChains - One or more source chains the address should accept deposits from. Providers that issue one address per VM family use the full list; single-chain providers use a one-element list.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {string} destinationAsset - The provider identifier of the asset to deliver (e.g., USDT).
 * @property {string} [destinationAddress] - The address that receives the delivered asset. Defaults to the bound account's address.
 * @property {string} [inputToken] - The expected input token, when the provider needs it declared up front.
 * @property {string} [refundAddress] - The address that receives refunds if a deposit cannot be processed (push-refund style).
 * @property {boolean} [reusable] - Request a reusable address, for providers that let the caller pick reusable vs single-use per request.
 * @property {SdaQuote | string} [quote] - A pre-fetched quote (or quote id) to bind the address to, for providers that require it.
 */

/**
 * A deposit address plus its normalized descriptor: where it accepts deposits
 * from, what it accepts, where it delivers, and its lifecycle metadata.
 *
 * @typedef {Object} SdaDepositAddress
 * @property {string} address - The deposit address the user sends funds to.
 * @property {string} id - The provider identifier for this SDA, used for status, recovery and disabling.
 * @property {Blockchain[]} sourceChains - The chains this address accepts deposits from.
 * @property {SdaToken[]} supportedInputTokens - The tokens this address accepts.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {SdaToken} destinationAsset - The asset delivered to the destination.
 * @property {string} destinationAddress - The resolved address that receives the delivered asset.
 * @property {SdaQuote} [quote] - The quote bound to this address, if any.
 * @property {SdaLimits} [limits] - Deposit limits for this address.
 * @property {boolean} reusable - Whether the address can receive more than one deposit.
 * @property {string} [refundAddress] - The refund address bound to this address.
 * @property {number} [expiry] - Unix timestamp (seconds) at which the address's activation expires, for a provider whose activation model ({@link SdaActivationModel}) is `'ttl'`.
 */

/**
 * The lifecycle status of a deposit/transfer through an SDA.
 *
 * @typedef {'pending' | 'detected' | 'processing' | 'completed' | 'failed'
 *          | 'refund-pending' | 'refunded' | 'expired'} SdaTransferStatus
 */

/**
 * A single deposit observed at, and processed through, an SDA.
 *
 * @typedef {Object} SdaTransfer
 * @property {string} id - The provider identifier for this transfer.
 * @property {string} [depositAddress] - The SDA the deposit was sent to, when known (a status-by-id lookup may not return it).
 * @property {SdaTransferStatus} status - The current status of the transfer.
 * @property {SdaToken} [inputToken] - The token that was deposited.
 * @property {bigint} [inputAmount] - The amount deposited, in the input token's base unit.
 * @property {SdaToken} [destinationAsset] - The asset delivered to the destination.
 * @property {bigint} [outputAmount] - The amount delivered, in the destination asset's base unit.
 * @property {string} [sourceTxHash] - The hash of the deposit transaction on the source chain.
 * @property {string} [destinationTxHash] - The hash of the delivery transaction on the destination chain.
 * @property {SdaFee[]} [fees] - Itemised fees applied to this transfer.
 * @property {number} [createdAt] - Unix timestamp (seconds) when the transfer was first observed.
 * @property {number} [updatedAt] - Unix timestamp (seconds) when the transfer was last updated.
 */

/**
 * Optional pagination/filtering for transfer history.
 *
 * @typedef {Object} SdaTransfersOptions
 * @property {Blockchain} [sourceChain] - The source chain of the deposit address, required by providers that key addresses by (address, chain).
 * @property {number} [limit] - The maximum number of transfers to return.
 * @property {number} [skip] - The number of transfers to skip, for offset-based pagination.
 * @property {SdaTransferStatus} [status] - Restrict to transfers in this status.
 */

/**
 * Recover a deposit by the SDA identifier.
 *
 * @typedef {Object} SdaRecoverById
 * @property {string} id - The provider SDA identifier (the `SdaDepositAddress.id`).
 */

/**
 * Recover a deposit by its deposit address.
 *
 * @typedef {Object} SdaRecoverByAddress
 * @property {string} address - The deposit address to reindex.
 * @property {Blockchain} [sourceChain] - The chain of the deposit address, required by providers that key addresses by (address, chain).
 */

/**
 * Options for re-processing a deposit that was not picked up automatically
 * (`reindex`). A caller identifies the deposit either by SDA id or by its deposit
 * address; the union has no empty member, so `recoverDepositAddress({})` is a
 * type error. A provider needing extra inputs extends the relevant member on its
 * own options type.
 *
 * @typedef {SdaRecoverById | SdaRecoverByAddress} SdaRecoveryOptions
 */

/**
 * The outcome of a recovery attempt.
 *
 * @typedef {Object} SdaRecoveryResult
 * @property {'reindexed' | 'pending' | 'failed'} status - The result of the reindex attempt.
 * @property {string} [address] - The address that was reindexed.
 * @property {string} [id] - The provider SDA identifier.
 * @property {SdaTransfer} [transfer] - The transfer that was recovered, if one resulted.
 * @property {string} [message] - A human-readable description of the outcome.
 */

/**
 * Interface for "Smart Deposit Address" (SDA) providers: services that issue a
 * deposit address, accept a stablecoin (or native token) from a supported
 * source chain, convert it, and deliver a chosen asset (e.g., USDT) to a chosen
 * destination chain and address.
 *
 * The required core every provider implements is route discovery and address
 * creation. Every other operation is optional: a provider that does not support
 * one leaves the base implementation in place, which throws
 * {@link UnsupportedOperationError}. Descriptive traits that are not tied to a
 * single method (custody, activation and route-discovery models) are documented
 * on each provider — see {@link SdaCustodyModel}, {@link SdaActivationModel} and
 * {@link SdaRouteDiscoveryMode}.
 *
 * @interface
 */
export class ISdaProtocol {
  /**
   * Lists the conversion routes the provider supports: source chains, accepted
   * input tokens, destination assets and per-route deposit limits. A provider
   * whose route discovery is `'by-chain-pair'` ({@link SdaRouteDiscoveryMode})
   * requires `sourceChain` and `destinationChain` to be supplied.
   *
   * @param {SdaRoutesOptions} [options] - Optional filters for route discovery.
   * @returns {Promise<SdaRoute[]>} The supported routes.
   * @throws {Error} If the provider's route discovery is `'by-chain-pair'` and `sourceChain` or `destinationChain` is missing.
   */
  async getSupportedRoutes (options) {
    throw new NotImplementedError('getSupportedRoutes(options)')
  }

  /**
   * Fetches a non-binding quote for a deposit. Optional: only supported by
   * providers that offer quoting. Some providers bind the deposit address to a
   * quote and require it up front — see that provider's documentation.
   *
   * @param {SdaQuoteOptions} options - The quote options.
   * @returns {Promise<SdaQuote>} The quoted deposit details.
   * @throws {UnsupportedOperationError} If this provider does not support quoting.
   */
  async quoteDeposit (options) {
    throw new UnsupportedOperationError('quoteDeposit(options)')
  }

  /**
   * Creates deposit addresses for the given route and destination, ready to
   * receive per the provider's activation model ({@link SdaActivationModel}) —
   * for a `'required'` / `'ttl'` provider this also activates the address so it
   * is monitored. Returns one entry per distinct address: a provider that issues
   * a single address across a chain family returns one entry covering all of
   * `sourceChains`, while a provider that issues one address per source chain
   * returns one entry each.
   *
   * @param {SdaCreateOptions} options - The address creation options.
   * @returns {Promise<SdaDepositAddress[]>} The created deposit addresses, one per distinct address.
   * @throws {AccountRequiredError} If `destinationAddress` is omitted and no account was bound at construction.
   */
  async createDepositAddress (options) {
    throw new NotImplementedError('createDepositAddress(options)')
  }

  /**
   * Derives a deposit address client-side, without any provider call and
   * without activating or monitoring it — used to verify (derive + compare) or
   * recover an address for a self-custodial provider. Optional: only supported
   * by providers whose deposit address is client-derivable.
   *
   * @param {SdaCreateOptions} options - The same options passed to {@link ISdaProtocol#createDepositAddress}; a provider needing extra derivation inputs declares them on its own options type (which extends `SdaCreateOptions`).
   * @returns {Promise<string>} The derived deposit address.
   * @throws {UnsupportedOperationError} If this provider does not support client-side derivation.
   * @throws {AccountRequiredError} If `destinationAddress` is omitted and no account was bound at construction.
   */
  async deriveDepositAddress (options) {
    throw new UnsupportedOperationError('deriveDepositAddress(options)')
  }

  /**
   * Looks up an existing deposit address by its identifier — the
   * `SdaDepositAddress.id` returned by {@link ISdaProtocol#createDepositAddress},
   * which round-trips any chain context the provider needs. Optional: only
   * supported by providers that expose address lookup.
   *
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain context the provider needs).
   * @returns {Promise<SdaDepositAddress>} The deposit address descriptor.
   * @throws {UnsupportedOperationError} If this provider does not support address lookup.
   * @throws {Error} If no such address exists.
   */
  async getDepositAddress (id) {
    throw new UnsupportedOperationError('getDepositAddress(id)')
  }

  /**
   * Refreshes the activation of a deposit address so the provider keeps
   * monitoring it. Optional: only relevant for providers whose activation model
   * ({@link SdaActivationModel}) is `'ttl'`.
   *
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id`.
   * @returns {Promise<SdaDepositAddress>} The refreshed deposit address descriptor (with the new `expiry`).
   * @throws {UnsupportedOperationError} If this provider does not use activation TTLs.
   */
  async renewDepositAddress (id) {
    throw new UnsupportedOperationError('renewDepositAddress(id)')
  }

  /**
   * Lists the deposits observed at a deposit address. Optional: only supported
   * by providers that expose pull-based history keyed by deposit address.
   *
   * @param {string} address - The deposit address to list transfers for.
   * @param {SdaTransfersOptions} [options] - Optional pagination/filtering, plus `sourceChain` for providers that key addresses by (address, chain).
   * @returns {Promise<SdaTransfer[]>} The transfers for the address.
   * @throws {UnsupportedOperationError} If this provider does not support pull-based history.
   */
  async getTransfers (address, options) {
    throw new UnsupportedOperationError('getTransfers(address, options)')
  }

  /**
   * Lists transfers aggregated by recipient — every deposit routed to the given
   * recipient across all of that recipient's deposit addresses and source
   * chains. Optional: only supported by providers that expose recipient-keyed
   * history.
   *
   * @param {Blockchain} destinationChain - The destination chain the transfers are delivered to.
   * @param {string} recipient - The recipient (destination) address to aggregate transfers for.
   * @param {SdaTransfersOptions} [options] - Optional pagination/filtering.
   * @returns {Promise<SdaTransfer[]>} The transfers routed to the recipient.
   * @throws {UnsupportedOperationError} If this provider does not support recipient-keyed history.
   */
  async getTransfersByRecipient (destinationChain, recipient, options) {
    throw new UnsupportedOperationError('getTransfersByRecipient(destinationChain, recipient, options)')
  }

  /**
   * Retrieves the status of a single transfer by its identifier. Optional: only
   * supported by providers that expose status-by-transfer-id.
   *
   * @param {string} id - The transfer identifier.
   * @returns {Promise<SdaTransfer>} The transfer's current status.
   * @throws {UnsupportedOperationError} If this provider does not support transfer-status lookup.
   * @throws {Error} If no such transfer exists.
   */
  async getTransferStatus (id) {
    throw new UnsupportedOperationError('getTransferStatus(id)')
  }

  /**
   * Recovers a deposit or address that was not picked up automatically, using
   * the provider's recovery mode ({@link SdaRecoveryMode}). Optional: only
   * supported by providers whose recovery mode is not `'none'`.
   *
   * @param {SdaRecoveryOptions} options - The recovery options.
   * @returns {Promise<SdaRecoveryResult>} The recovery outcome.
   * @throws {UnsupportedOperationError} If this provider does not support recovery.
   */
  async recoverDepositAddress (options) {
    throw new UnsupportedOperationError('recoverDepositAddress(options)')
  }

  /**
   * Disables a deposit address so it no longer accepts deposits. Optional: only
   * supported by providers that allow disabling an address.
   *
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain context the provider needs).
   * @returns {Promise<void>} Resolves once the address has been disabled.
   * @throws {UnsupportedOperationError} If this provider does not support disabling addresses.
   */
  async disableDepositAddress (id) {
    throw new UnsupportedOperationError('disableDepositAddress(id)')
  }
}

/**
 * Abstract base class for "Smart Deposit Address" (SDA) providers. Concrete
 * providers extend this and implement the provider-specific calls.
 *
 * @abstract
 * @implements {ISdaProtocol}
 */
export default class SdaProtocol {
  /**
   * Creates a new SDA protocol without binding it to a wallet account.
   *
   * @overload
   * @param {undefined} [account] - The wallet account to use to interact with the protocol.
   */

  /**
   * Creates a new read-only SDA protocol.
   *
   * @overload
   * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
   */

  /**
   * Creates a new SDA protocol.
   *
   * @overload
   * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
   */
  constructor (account) {
    /**
     * The wallet account to use to interact with the protocol. The account's
     * address is the default delivery destination for created addresses.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount | undefined}
     */
    this._account = account
  }

  /**
   * Lists the conversion routes the provider supports: source chains, accepted
   * input tokens, destination assets and per-route deposit limits. A provider
   * whose route discovery is `'by-chain-pair'` ({@link SdaRouteDiscoveryMode})
   * requires `sourceChain` and `destinationChain` to be supplied.
   *
   * @abstract
   * @param {SdaRoutesOptions} [options] - Optional filters for route discovery.
   * @returns {Promise<SdaRoute[]>} The supported routes.
   * @throws {Error} If the provider's route discovery is `'by-chain-pair'` and `sourceChain` or `destinationChain` is missing.
   */
  async getSupportedRoutes (options) {
    throw new NotImplementedError('getSupportedRoutes(options)')
  }

  /**
   * Fetches a non-binding quote for a deposit. Optional: only supported by
   * providers that offer quoting. Some providers bind the deposit address to a
   * quote and require it up front — see that provider's documentation.
   *
   * @abstract
   * @param {SdaQuoteOptions} options - The quote options.
   * @returns {Promise<SdaQuote>} The quoted deposit details.
   * @throws {UnsupportedOperationError} If this provider does not support quoting.
   */
  async quoteDeposit (options) {
    throw new UnsupportedOperationError('quoteDeposit(options)')
  }

  /**
   * Creates deposit addresses for the given route and destination, ready to
   * receive per the provider's activation model ({@link SdaActivationModel}) —
   * for a `'required'` / `'ttl'` provider this also activates the address so it
   * is monitored. Returns one entry per distinct address: a provider that issues
   * a single address across a chain family returns one entry covering all of
   * `sourceChains`, while a provider that issues one address per source chain
   * returns one entry each.
   *
   * @abstract
   * @param {SdaCreateOptions} options - The address creation options.
   * @returns {Promise<SdaDepositAddress[]>} The created deposit addresses, one per distinct address.
   * @throws {AccountRequiredError} If `destinationAddress` is omitted and no account was bound at construction.
   */
  async createDepositAddress (options) {
    throw new NotImplementedError('createDepositAddress(options)')
  }

  /**
   * Derives a deposit address client-side, without any provider call and
   * without activating or monitoring it — used to verify (derive + compare) or
   * recover an address for a self-custodial provider. Optional: only supported
   * by providers whose deposit address is client-derivable.
   *
   * @abstract
   * @param {SdaCreateOptions} options - The same options passed to {@link ISdaProtocol#createDepositAddress}; a provider needing extra derivation inputs declares them on its own options type (which extends `SdaCreateOptions`).
   * @returns {Promise<string>} The derived deposit address.
   * @throws {UnsupportedOperationError} If this provider does not support client-side derivation.
   * @throws {AccountRequiredError} If `destinationAddress` is omitted and no account was bound at construction.
   */
  async deriveDepositAddress (options) {
    throw new UnsupportedOperationError('deriveDepositAddress(options)')
  }

  /**
   * Looks up an existing deposit address by its identifier — the
   * `SdaDepositAddress.id` returned by {@link ISdaProtocol#createDepositAddress},
   * which round-trips any chain context the provider needs. Optional: only
   * supported by providers that expose address lookup.
   *
   * @abstract
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain context the provider needs).
   * @returns {Promise<SdaDepositAddress>} The deposit address descriptor.
   * @throws {UnsupportedOperationError} If this provider does not support address lookup.
   * @throws {Error} If no such address exists.
   */
  async getDepositAddress (id) {
    throw new UnsupportedOperationError('getDepositAddress(id)')
  }

  /**
   * Refreshes the activation of a deposit address so the provider keeps
   * monitoring it. Optional: only relevant for providers whose activation model
   * ({@link SdaActivationModel}) is `'ttl'`.
   *
   * @abstract
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id`.
   * @returns {Promise<SdaDepositAddress>} The refreshed deposit address descriptor (with the new `expiry`).
   * @throws {UnsupportedOperationError} If this provider does not use activation TTLs.
   */
  async renewDepositAddress (id) {
    throw new UnsupportedOperationError('renewDepositAddress(id)')
  }

  /**
   * Lists the deposits observed at a deposit address. Optional: only supported
   * by providers that expose pull-based history keyed by deposit address.
   *
   * @abstract
   * @param {string} address - The deposit address to list transfers for.
   * @param {SdaTransfersOptions} [options] - Optional pagination/filtering, plus `sourceChain` for providers that key addresses by (address, chain).
   * @returns {Promise<SdaTransfer[]>} The transfers for the address.
   * @throws {UnsupportedOperationError} If this provider does not support pull-based history.
   */
  async getTransfers (address, options) {
    throw new UnsupportedOperationError('getTransfers(address, options)')
  }

  /**
   * Lists transfers aggregated by recipient — every deposit routed to the given
   * recipient across all of that recipient's deposit addresses and source
   * chains. Optional: only supported by providers that expose recipient-keyed
   * history.
   *
   * @abstract
   * @param {Blockchain} destinationChain - The destination chain the transfers are delivered to.
   * @param {string} recipient - The recipient (destination) address to aggregate transfers for.
   * @param {SdaTransfersOptions} [options] - Optional pagination/filtering.
   * @returns {Promise<SdaTransfer[]>} The transfers routed to the recipient.
   * @throws {UnsupportedOperationError} If this provider does not support recipient-keyed history.
   */
  async getTransfersByRecipient (destinationChain, recipient, options) {
    throw new UnsupportedOperationError('getTransfersByRecipient(destinationChain, recipient, options)')
  }

  /**
   * Retrieves the status of a single transfer by its identifier. Optional: only
   * supported by providers that expose status-by-transfer-id.
   *
   * @abstract
   * @param {string} id - The transfer identifier.
   * @returns {Promise<SdaTransfer>} The transfer's current status.
   * @throws {UnsupportedOperationError} If this provider does not support transfer-status lookup.
   * @throws {Error} If no such transfer exists.
   */
  async getTransferStatus (id) {
    throw new UnsupportedOperationError('getTransferStatus(id)')
  }

  /**
   * Recovers a deposit or address that was not picked up automatically, using
   * the provider's recovery mode ({@link SdaRecoveryMode}). Optional: only
   * supported by providers whose recovery mode is not `'none'`.
   *
   * @abstract
   * @param {SdaRecoveryOptions} options - The recovery options.
   * @returns {Promise<SdaRecoveryResult>} The recovery outcome.
   * @throws {UnsupportedOperationError} If this provider does not support recovery.
   */
  async recoverDepositAddress (options) {
    throw new UnsupportedOperationError('recoverDepositAddress(options)')
  }

  /**
   * Disables a deposit address so it no longer accepts deposits. Optional: only
   * supported by providers that allow disabling an address.
   *
   * @abstract
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain context the provider needs).
   * @returns {Promise<void>} Resolves once the address has been disabled.
   * @throws {UnsupportedOperationError} If this provider does not support disabling addresses.
   */
  async disableDepositAddress (id) {
    throw new UnsupportedOperationError('disableDepositAddress(id)')
  }
}
