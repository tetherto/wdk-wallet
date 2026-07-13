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

/** @typedef {import('../errors.js').ValueError} ValueError */

/** @typedef {import('../errors.js').NoSuchElementError} NoSuchElementError */

/**
 * A blockchain identifier: a numeric chain id (e.g. `1`) or a protocol-specific chain name (e.g. `'ethereum'`).
 *
 * @typedef {string | number} Blockchain
 */

/**
 * A normalized token reference. `token` is the identifier the protocol expects in SDA calls; `address` is the
 * on-chain contract address when applicable (absent for native gas tokens).
 *
 * @typedef {Object} SdaToken
 * @property {string} token - The protocol-specific token identifier to use in SDA calls.
 * @property {Blockchain} chain - The chain on which the token lives.
 * @property {string} symbol - The token symbol (e.g., 'USDC', 'USDT').
 * @property {number} decimals - The number of decimal places for the token's base unit.
 * @property {string} [address] - The token contract address, if applicable.
 * @property {string} [name] - The token's full name.
 */

/**
 * Per-route deposit limits, denominated in the base unit of the route's input token. Either bound may be absent
 * when the protocol does not enforce it; a protocol that only enforces limits in another denomination (e.g. USD)
 * omits `limits` rather than converting.
 *
 * @typedef {Object} SdaDepositAddressLimits
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
 * @property {string} [outputAsset] - Restrict to routes that deliver this asset.
 */

/**
 * A supported conversion route: one or more source chains and their accepted input tokens, the destination chain,
 * and the asset delivered there.
 *
 * @typedef {Object} SdaRoute
 * @property {Blockchain[]} sourceChains - The source chains this route accepts deposits from. A list because some
 *   protocols issue one address valid across a VM family.
 * @property {SdaToken[]} inputTokens - The deposit tokens accepted on the source side.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {SdaToken} outputAsset - The asset delivered to the destination (e.g., USDT).
 * @property {SdaDepositAddressLimits} [limits] - Deposit limits for this route.
 * @property {boolean} [reusable] - Whether addresses issued for this route can receive more than one deposit.
 * @property {number} [estimatedDuration] - Typical end-to-end duration in seconds.
 */

/**
 * Options for fetching a deposit quote — a non-binding estimate of what a given deposit would deliver.
 *
 * @typedef {Object} SdaDepositOptions
 * @property {Blockchain} sourceChain - The chain the deposit originates from.
 * @property {string} inputToken - The protocol identifier of the token being deposited.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {string} outputAsset - The protocol identifier of the asset to deliver.
 * @property {number | bigint} inputAmount - The amount to deposit, in the input token's base unit.
 */

/**
 * The category of a fee charged by the protocol.
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
 * A non-binding estimate of the asset delivered for a given deposit.
 *
 * @typedef {Object} SdaDepositQuote
 * @property {Blockchain} inputChain - The chain the deposit originates from.
 * @property {string} inputToken - The protocol identifier of the deposited token.
 * @property {bigint} inputAmount - The amount deposited, in the input token's base unit.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {string} outputAsset - The protocol identifier of the delivered asset.
 * @property {bigint} outputAmount - The estimated amount delivered, in the destination asset's base unit.
 * @property {SdaFee[]} fees - Itemised fee breakdown.
 * @property {string} [rate] - The effective conversion rate as a string, to avoid precision loss.
 * @property {number} [expiry] - Unix timestamp (seconds) at which the quote expires.
 * @property {string} [id] - The protocol quote identifier, if the protocol issues one.
 */

/**
 * Options for creating a deposit address.
 *
 * @typedef {Object} SdaCreateDepositAddressOptions
 * @property {Blockchain[]} sourceChains - One or more source chains the address should accept deposits from. Protocols
 *   that issue one address per VM family use the full list; single-chain protocols use a one-element list.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {string} outputAsset - The protocol identifier of the asset to deliver (e.g., USDT).
 * @property {string} [destinationAddress] - The address that receives the delivered asset. Defaults to the bound
 *   account's address.
 */

/**
 * A deposit address plus its normalized descriptor: where it accepts deposits from, what it accepts, where it
 * delivers, and its lifecycle metadata.
 *
 * @typedef {Object} SdaDepositAddress
 * @property {string} address - The deposit address the user sends funds to.
 * @property {string} id - The protocol identifier for this SDA, used for status, recovery and disabling.
 * @property {Blockchain[]} sourceChains - The chains this address accepts deposits from.
 * @property {SdaToken[]} supportedInputTokens - The tokens this address accepts.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {SdaToken} outputAsset - The asset delivered to the destination.
 * @property {string} destinationAddress - The resolved address that receives the delivered asset.
 * @property {SdaDepositAddressLimits} [limits] - Deposit limits for this address.
 * @property {boolean} reusable - Whether the address can receive more than one deposit.
 * @property {number} [expiry] - Unix timestamp (seconds) at which the address's activation expires, when the protocol's
 *   address activation is time-limited.
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
 * @property {string} id - The protocol identifier for this transfer.
 * @property {SdaTransferStatus} status - The current status of the transfer.
 */

/**
 * Optional pagination/filtering for transfer history.
 *
 * @typedef {Object} SdaTransfersOptions
 * @property {Blockchain} [sourceChain] - The source chain of the deposit address, required by protocols that key
 *   addresses by (address, chain).
 * @property {number} [limit] - The maximum number of transfers to return.
 * @property {number} [skip] - The number of transfers to skip, for offset-based pagination.
 * @property {SdaTransferStatus} [status] - Restrict to transfers in this status.
 */

/**
 * Recover a deposit by the SDA identifier.
 *
 * @typedef {Object} SdaRecoverById
 * @property {string} id - The protocol SDA identifier (the `SdaDepositAddress.id`).
 */

/**
 * Recover a deposit by its deposit address.
 *
 * @typedef {Object} SdaRecoverByAddress
 * @property {string} address - The deposit address to reindex.
 * @property {Blockchain} [sourceChain] - The chain of the deposit address, required by protocols that key addresses by
 *   (address, chain).
 */

/**
 * Options for re-processing a deposit that was not picked up automatically (`reindex`). A caller identifies the
 * deposit either by SDA id or by its deposit address.
 *
 * @typedef {SdaRecoverById | SdaRecoverByAddress} SdaRecoveryOptions
 */

/**
 * The outcome of a recovery attempt.
 *
 * @typedef {Object} SdaRecoveryResult
 * @property {'reindexed' | 'pending' | 'failed'} status - The result of the reindex attempt.
 * @property {string} [address] - The address that was reindexed.
 * @property {string} [id] - The protocol SDA identifier.
 * @property {SdaTransfer} [transfer] - The transfer that was recovered, if one resulted.
 * @property {string} [message] - A human-readable description of the outcome.
 */

/**
 * Interface for "Smart Deposit Address" (SDA) protocols: services that issue a deposit address, accept a
 * stablecoin (or native token) from a supported source chain, convert it, and deliver a chosen asset (e.g., USDT)
 * to a chosen destination chain and address.
 *
 * The required core every protocol implements is route discovery and address creation; every other operation is
 * optional.
 *
 * @interface
 */
export class ISdaProtocol {
  /**
   * Lists the conversion routes the protocol supports: source chains, accepted input tokens, output assets and
   * per-route deposit limits. A protocol that discovers routes by blockchain pairs might require the `sourceChain`
   * and `destinationChain` options to be set.
   *
   * @param {SdaRoutesOptions} [options] - Optional filters for route discovery.
   * @returns {Promise<SdaRoute[]>} The supported routes.
   * @throws {ValueError} If the protocol discovers routes by blockchain pairs and the source or destination blockchain
   *   is not set.
   */
  async getSupportedRoutes (options) {
    throw new NotImplementedError('getSupportedRoutes(options)')
  }

  /**
   * Fetches a non-binding quote (estimate) for a deposit — what a given deposit would deliver.
   *
   * @param {SdaDepositOptions} options - The quote options.
   * @returns {Promise<SdaDepositQuote>} The quoted deposit details.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async quoteDeposit (options) {
    throw new NotImplementedError('quoteDeposit(options)')
  }

  /**
   * Creates deposit addresses for the given route and destination, ready to receive per the protocol's activation
   * lifecycle — a protocol that activates addresses also activates the created address so it is monitored. Returns
   * one entry per distinct address: a protocol that issues a single address across a chain family returns one entry
   * covering all of `sourceChains`, while a protocol that issues one address per source chain returns one entry each.
   *
   * @param {SdaCreateDepositAddressOptions} options - The address creation options.
   * @returns {Promise<SdaDepositAddress[]>} The created deposit addresses, one per distinct address.
   * @throws {ValueError} If `destinationAddress` is omitted and no account was bound at construction.
   */
  async createDepositAddress (options) {
    throw new NotImplementedError('createDepositAddress(options)')
  }

  /**
   * Derives a deposit address client-side, without any protocol call and without activating or monitoring it —
   * used to verify (derive + compare) or recover an address for a self-custodial protocol.
   *
   * @param {SdaCreateDepositAddressOptions} options - The same options passed to
   *   {@link ISdaProtocol#createDepositAddress}; a protocol needing extra derivation inputs declares them on its own
   *   options type (which extends `SdaCreateDepositAddressOptions`).
   * @returns {Promise<string>} The derived deposit address.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   * @throws {ValueError} If `destinationAddress` is omitted and no account was bound at construction.
   */
  async deriveDepositAddress (options) {
    throw new NotImplementedError('deriveDepositAddress(options)')
  }

  /**
   * Looks up an existing deposit address by its identifier — the `SdaDepositAddress.id` returned by
   * {@link ISdaProtocol#createDepositAddress}, which round-trips any chain context the protocol needs.
   *
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain
   *   context the protocol needs).
   * @returns {Promise<SdaDepositAddress>} The deposit address descriptor.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   * @throws {NoSuchElementError} If no such address exists.
   */
  async getDepositAddress (id) {
    throw new NotImplementedError('getDepositAddress(id)')
  }

  /**
   * Refreshes the activation of a deposit address so the protocol keeps monitoring it.
   *
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id`.
   * @returns {Promise<SdaDepositAddress>} The refreshed deposit address descriptor (with the new `expiry`).
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async renewDepositAddress (id) {
    throw new NotImplementedError('renewDepositAddress(id)')
  }

  /**
   * Lists the deposits observed at a deposit address.
   *
   * @param {string} address - The deposit address to list transfers for.
   * @param {SdaTransfersOptions} [options] - Optional pagination/filtering, plus `sourceChain` for protocols that key
   *   addresses by (address, chain).
   * @returns {Promise<SdaTransfer[]>} The transfers for the address.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async getTransfers (address, options) {
    throw new NotImplementedError('getTransfers(address, options)')
  }

  /**
   * Lists transfers aggregated by recipient — every deposit routed to the given recipient across all of that
   * recipient's deposit addresses and source chains.
   *
   * @param {Blockchain} destinationChain - The destination chain the transfers are delivered to.
   * @param {string} recipient - The recipient (destination) address to aggregate transfers for.
   * @param {SdaTransfersOptions} [options] - Optional pagination/filtering.
   * @returns {Promise<SdaTransfer[]>} The transfers routed to the recipient.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async getTransfersByRecipient (destinationChain, recipient, options) {
    throw new NotImplementedError('getTransfersByRecipient(destinationChain, recipient, options)')
  }

  /**
   * Retrieves a single transfer by its identifier.
   *
   * @param {string} id - The transfer identifier.
   * @returns {Promise<SdaTransfer>} The transfer's current status.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   * @throws {NoSuchElementError} If no such transfer exists.
   */
  async getTransfer (id) {
    throw new NotImplementedError('getTransfer(id)')
  }

  /**
   * Recovers a deposit or address that was not picked up automatically, using the protocol's recovery mode.
   *
   * @param {SdaRecoveryOptions} options - The recovery options.
   * @returns {Promise<SdaRecoveryResult>} The recovery outcome.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async recoverDepositAddress (options) {
    throw new NotImplementedError('recoverDepositAddress(options)')
  }

  /**
   * Disables a deposit address so it no longer accepts deposits.
   *
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain
   *   context the protocol needs).
   * @returns {Promise<void>} Resolves once the address has been disabled.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async disableDepositAddress (id) {
    throw new NotImplementedError('disableDepositAddress(id)')
  }
}

/**
 * Abstract base class for "Smart Deposit Address" (SDA) protocols.
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
     * The wallet account to use to interact with the protocol. The account's address is the default delivery
     * destination for created addresses.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount | undefined}
     */
    this._account = account
  }

  /**
   * Lists the conversion routes the protocol supports: source chains, accepted input tokens, output assets and
   * per-route deposit limits. A protocol that discovers routes by blockchain pairs might require the `sourceChain`
   * and `destinationChain` options to be set.
   *
   * @abstract
   * @param {SdaRoutesOptions} [options] - Optional filters for route discovery.
   * @returns {Promise<SdaRoute[]>} The supported routes.
   * @throws {ValueError} If the protocol discovers routes by blockchain pairs and the source or destination blockchain
   *   is not set.
   */
  async getSupportedRoutes (options) {
    throw new NotImplementedError('getSupportedRoutes(options)')
  }

  /**
   * Fetches a non-binding quote (estimate) for a deposit — what a given deposit would deliver.
   *
   * @param {SdaDepositOptions} options - The quote options.
   * @returns {Promise<SdaDepositQuote>} The quoted deposit details.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async quoteDeposit (options) {
    throw new UnsupportedOperationError('quoteDeposit(options)')
  }

  /**
   * Creates deposit addresses for the given route and destination, ready to receive per the protocol's activation
   * lifecycle — a protocol that activates addresses also activates the created address so it is monitored. Returns
   * one entry per distinct address: a protocol that issues a single address across a chain family returns one entry
   * covering all of `sourceChains`, while a protocol that issues one address per source chain returns one entry each.
   *
   * @abstract
   * @param {SdaCreateDepositAddressOptions} options - The address creation options.
   * @returns {Promise<SdaDepositAddress[]>} The created deposit addresses, one per distinct address.
   * @throws {ValueError} If `destinationAddress` is omitted and no account was bound at construction.
   */
  async createDepositAddress (options) {
    throw new NotImplementedError('createDepositAddress(options)')
  }

  /**
   * Derives a deposit address client-side, without any protocol call and without activating or monitoring it —
   * used to verify (derive + compare) or recover an address for a self-custodial protocol.
   *
   * @param {SdaCreateDepositAddressOptions} options - The same options passed to
   *   {@link ISdaProtocol#createDepositAddress}; a protocol needing extra derivation inputs declares them on its own
   *   options type (which extends `SdaCreateDepositAddressOptions`).
   * @returns {Promise<string>} The derived deposit address.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   * @throws {ValueError} If `destinationAddress` is omitted and no account was bound at construction.
   */
  async deriveDepositAddress (options) {
    throw new UnsupportedOperationError('deriveDepositAddress(options)')
  }

  /**
   * Looks up an existing deposit address by its identifier — the `SdaDepositAddress.id` returned by
   * {@link ISdaProtocol#createDepositAddress}, which round-trips any chain context the protocol needs.
   *
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain
   *   context the protocol needs).
   * @returns {Promise<SdaDepositAddress>} The deposit address descriptor.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   * @throws {NoSuchElementError} If no such address exists.
   */
  async getDepositAddress (id) {
    throw new UnsupportedOperationError('getDepositAddress(id)')
  }

  /**
   * Refreshes the activation of a deposit address so the protocol keeps monitoring it.
   *
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id`.
   * @returns {Promise<SdaDepositAddress>} The refreshed deposit address descriptor (with the new `expiry`).
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async renewDepositAddress (id) {
    throw new UnsupportedOperationError('renewDepositAddress(id)')
  }

  /**
   * Lists the deposits observed at a deposit address.
   *
   * @param {string} address - The deposit address to list transfers for.
   * @param {SdaTransfersOptions} [options] - Optional pagination/filtering, plus `sourceChain` for protocols that key
   *   addresses by (address, chain).
   * @returns {Promise<SdaTransfer[]>} The transfers for the address.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async getTransfers (address, options) {
    throw new UnsupportedOperationError('getTransfers(address, options)')
  }

  /**
   * Lists transfers aggregated by recipient — every deposit routed to the given recipient across all of that
   * recipient's deposit addresses and source chains.
   *
   * @param {Blockchain} destinationChain - The destination chain the transfers are delivered to.
   * @param {string} recipient - The recipient (destination) address to aggregate transfers for.
   * @param {SdaTransfersOptions} [options] - Optional pagination/filtering.
   * @returns {Promise<SdaTransfer[]>} The transfers routed to the recipient.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async getTransfersByRecipient (destinationChain, recipient, options) {
    throw new UnsupportedOperationError('getTransfersByRecipient(destinationChain, recipient, options)')
  }

  /**
   * Retrieves a single transfer by its identifier.
   *
   * @param {string} id - The transfer identifier.
   * @returns {Promise<SdaTransfer>} The transfer's current status.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   * @throws {NoSuchElementError} If no such transfer exists.
   */
  async getTransfer (id) {
    throw new UnsupportedOperationError('getTransfer(id)')
  }

  /**
   * Recovers a deposit or address that was not picked up automatically, using the protocol's recovery mode.
   *
   * @param {SdaRecoveryOptions} options - The recovery options.
   * @returns {Promise<SdaRecoveryResult>} The recovery outcome.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async recoverDepositAddress (options) {
    throw new UnsupportedOperationError('recoverDepositAddress(options)')
  }

  /**
   * Disables a deposit address so it no longer accepts deposits.
   *
   * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain
   *   context the protocol needs).
   * @returns {Promise<void>} Resolves once the address has been disabled.
   * @throws {UnsupportedOperationError} If the protocol does not support this operation.
   */
  async disableDepositAddress (id) {
    throw new UnsupportedOperationError('disableDepositAddress(id)')
  }
}
