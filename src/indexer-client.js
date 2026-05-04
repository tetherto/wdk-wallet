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

/**
 * @typedef {Object} PortfolioByChain
 * @property {string} chain - The chain identifier (e.g. "ethereum", "arbitrum", "solana").
 * @property {number} value - The total value held on this chain in the settlement currency.
 */

/**
 * @typedef {Object} PortfolioSummary
 * @property {string} address - The account's address.
 * @property {string} currency - The settlement currency (e.g. "usd").
 * @property {number} totalValue - The total portfolio value across all chains.
 * @property {number} change24hAbsolute - Absolute portfolio value change over the last 24 hours.
 * @property {number} change24hPercent - Percentage portfolio value change over the last 24 hours.
 * @property {number} walletValue - Value held directly in the wallet (non-DeFi).
 * @property {number} depositedValue - Value held in DeFi deposits.
 * @property {number} stakedValue - Value held in staking positions.
 * @property {number} borrowedValue - Value of outstanding borrow positions (negative contribution).
 * @property {PortfolioByChain[]} byChain - Per-chain portfolio breakdown.
 */

/**
 * @typedef {Object} TokenPosition
 * @property {string} chain - The chain the position is held on.
 * @property {string | null} contract - The token's contract address, or null for native tokens.
 * @property {string} symbol - The token's symbol.
 * @property {string} name - The token's name.
 * @property {number} decimals - The token's decimals.
 * @property {string} quantity - The held quantity as a decimal string (precision-safe).
 * @property {number} priceUsd - The current price in the settlement currency.
 * @property {number} valueUsd - The total value of the position in the settlement currency.
 * @property {string} type - Position type (e.g. "wallet", "deposit", "staked", "borrowed", "reward").
 * @property {string | null} protocol - The protocol the position belongs to, or null for plain wallet holdings.
 */

/**
 * @typedef {Object} PositionsResult
 * @property {TokenPosition[]} positions - The list of positions.
 * @property {string | null} [nextCursor] - Opaque cursor for the next page, or null when no more pages.
 */

/**
 * @typedef {Object} PositionsOptions
 * @property {string[]} [chains] - Restrict to these chain identifiers.
 * @property {string[]} [positionTypes] - Restrict to these position types.
 * @property {string} [cursor] - Opaque cursor returned from a previous page.
 * @property {number} [limit] - Maximum number of positions to return.
 */

/**
 * @typedef {Object} InterpretedTransfer
 * @property {'in' | 'out' | 'self'} direction - Direction of the transfer relative to the account.
 * @property {string} symbol - The transferred token's symbol.
 * @property {string} quantity - The transferred quantity as a decimal string (precision-safe).
 * @property {number} valueUsd - The value of the transfer in the settlement currency.
 * @property {string | null} contract - The token's contract address, or null for native tokens.
 */

/**
 * @typedef {Object} InterpretedTransaction
 * @property {string} hash - The on-chain transaction hash.
 * @property {string} chain - The chain the transaction occurred on.
 * @property {number} timestamp - The block timestamp in milliseconds since epoch.
 * @property {string} type - Interpreted transaction type (e.g. "trade", "send", "receive", "approve").
 * @property {string | null} protocol - The protocol the transaction interacted with, or null.
 * @property {string} status - The transaction status (e.g. "confirmed", "failed").
 * @property {InterpretedTransfer[]} transfers - The decoded token transfers in this transaction.
 * @property {bigint | null} fee - The fee paid in native token base units, or null if unavailable.
 */

/**
 * @typedef {Object} TransactionsResult
 * @property {InterpretedTransaction[]} transactions - The list of interpreted transactions.
 * @property {string | null} nextCursor - Opaque cursor for the next page, or null when no more pages.
 */

/**
 * @typedef {Object} TransactionsOptions
 * @property {string[]} [chains] - Restrict to these chain identifiers.
 * @property {number} [limit] - Maximum number of transactions to return.
 * @property {string} [cursor] - Opaque cursor returned from a previous page.
 */

/**
 * @typedef {Object} NftPosition
 * @property {string} chain - The chain the NFT is held on.
 * @property {string} contract - The NFT contract address.
 * @property {string} tokenId - The NFT's token ID.
 * @property {string | null} name - The NFT's name, or null if unknown.
 * @property {string | null} collection - The collection name, or null if unknown.
 * @property {number | null} floorPriceUsd - The collection floor price in the settlement currency, or null.
 * @property {number | null} lastSalePriceUsd - The NFT's last sale price in the settlement currency, or null.
 * @property {string | null} imageUrl - A URL to the NFT's image, or null if unavailable.
 */

/**
 * @typedef {Object} NftsResult
 * @property {NftPosition[]} nfts - The list of NFT positions.
 * @property {string | null} nextCursor - Opaque cursor for the next page, or null when no more pages.
 */

/**
 * @typedef {Object} NftsOptions
 * @property {string[]} [chains] - Restrict to these chain identifiers.
 * @property {number} [limit] - Maximum number of NFTs to return.
 * @property {string} [cursor] - Opaque cursor returned from a previous page.
 */

/**
 * @typedef {Object} PnlSummary
 * @property {string} address - The account's address.
 * @property {string} currency - The settlement currency.
 * @property {number} realizedPnlUsd - Realized profit and loss in the settlement currency.
 * @property {number} unrealizedPnlUsd - Unrealized profit and loss in the settlement currency.
 * @property {number} totalPnlUsd - Total (realized + unrealized) profit and loss.
 * @property {number} netInvestedUsd - Net amount invested in the settlement currency.
 * @property {number} totalFeesUsd - Total fees paid in the settlement currency.
 */

/** @interface */
export class IWalletIndexerClient {
  /**
   * Returns a multi-chain portfolio summary for an account.
   *
   * @param {string} address - The account's address.
   * @returns {Promise<PortfolioSummary>} The portfolio summary.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getPortfolio (address) {
    throw new NotImplementedError('getPortfolio(address)')
  }

  /**
   * Returns the decoded token and DeFi positions held by an account.
   *
   * @param {string} address - The account's address.
   * @param {PositionsOptions} [options] - Optional filters and pagination cursor.
   * @returns {Promise<PositionsResult>} The list of positions.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getPositions (address, options) {
    throw new NotImplementedError('getPositions(address, options)')
  }

  /**
   * Returns interpreted (decoded) transactions for an account.
   *
   * @param {string} address - The account's address.
   * @param {TransactionsOptions} [options] - Optional filters and pagination cursor.
   * @returns {Promise<TransactionsResult>} The list of interpreted transactions.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getTransactions (address, options) {
    throw new NotImplementedError('getTransactions(address, options)')
  }

  /**
   * Returns the NFTs held by an account.
   *
   * @param {string} address - The account's address.
   * @param {NftsOptions} [options] - Optional filters and pagination cursor.
   * @returns {Promise<NftsResult>} The list of NFT positions.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getNfts (address, options) {
    throw new NotImplementedError('getNfts(address, options)')
  }

  /**
   * Returns realized and unrealized profit and loss for an account.
   *
   * @param {string} address - The account's address.
   * @returns {Promise<PnlSummary>} The PnL summary.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getPnl (address) {
    throw new NotImplementedError('getPnl(address)')
  }
}

/**
 * Base class for indexer clients that provide interpreted multi-chain wallet
 * data (portfolio, positions, transactions, NFTs, PnL) for any wallet account.
 *
 * Concrete implementations live in their own packages, e.g.
 * `@zerion/wdk-indexer-zerion`, mirroring the `PricingClient` pattern.
 *
 * @abstract
 * @implements {IWalletIndexerClient}
 */
export default class WalletIndexerClient {
  /**
   * Returns a multi-chain portfolio summary for an account.
   *
   * @abstract
   * @param {string} address - The account's address.
   * @returns {Promise<PortfolioSummary>} The portfolio summary.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getPortfolio (address) {
    throw new NotImplementedError('getPortfolio(address)')
  }

  /**
   * Returns the decoded token and DeFi positions held by an account.
   *
   * @abstract
   * @param {string} address - The account's address.
   * @param {PositionsOptions} [options] - Optional filters and pagination cursor.
   * @returns {Promise<PositionsResult>} The list of positions.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getPositions (address, options) {
    throw new NotImplementedError('getPositions(address, options)')
  }

  /**
   * Returns interpreted (decoded) transactions for an account.
   *
   * @abstract
   * @param {string} address - The account's address.
   * @param {TransactionsOptions} [options] - Optional filters and pagination cursor.
   * @returns {Promise<TransactionsResult>} The list of interpreted transactions.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getTransactions (address, options) {
    throw new NotImplementedError('getTransactions(address, options)')
  }

  /**
   * Returns the NFTs held by an account.
   *
   * @abstract
   * @param {string} address - The account's address.
   * @param {NftsOptions} [options] - Optional filters and pagination cursor.
   * @returns {Promise<NftsResult>} The list of NFT positions.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getNfts (address, options) {
    throw new NotImplementedError('getNfts(address, options)')
  }

  /**
   * Returns realized and unrealized profit and loss for an account.
   *
   * @abstract
   * @param {string} address - The account's address.
   * @returns {Promise<PnlSummary>} The PnL summary.
   * @throws {Error} If the indexer client is not able to provide an implementation for the method.
   */
  async getPnl (address) {
    throw new NotImplementedError('getPnl(address)')
  }
}
