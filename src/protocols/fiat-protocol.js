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
/** @typedef {import('./errors.js').BuyError} BuyError */
/** @typedef {import('./errors.js').MaximumFeeExceededError} MaximumFeeExceededError */
/** @typedef {import('./errors.js').NoSuchElementError} NoSuchElementError */
/** @typedef {import('./errors.js').ReadOnlyAccountRequiredError} ReadOnlyAccountRequiredError */
/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').SellError} SellError */
/** @typedef {import('./errors.js').ValueError} ValueError */

/**
 * Standardized status for an on/off-ramp transaction.
 *
 * @typedef {'in_progress' | 'failed' | 'completed'} FiatTransactionStatus
 */

/**
 * A protocol-agnostic, standardized object representing the details of an on/off-ramp transaction.
 *
 * @typedef {Object} FiatTransactionDetail
 * @property {FiatTransactionStatus} status - The current status of the transaction.
 * @property {string} cryptoAsset - The provider-specific code of the crypto asset (e.g., 'btc').
 * @property {string} fiatCurrency - The currency's ISO 4217 code (e.g., 'USD').
 */

/**
 * A protocol-agnostic, standardized object representing a supported crypto asset.
 *
 * @typedef {Object} SupportedCryptoAsset
 * @property {string} code - Provider-specific asset code for the crypto asset.
 * @property {string} networkCode - The network code for the asset, if applicable (e.g., 'ethereum', 'tron').
 * @property {number} decimals - The on-chain number of decimal places for the asset's base unit (e.g., 18 for ETH).
 * @property {string} [name] - The asset's full name (e.g., 'Bitcoin').
 */

/**
 * A protocol-agnostic, standardized object representing a supported fiat currency.
 * @typedef {Object} SupportedFiatCurrency
 * @property {string} code - The currency's ISO 4217 code (e.g., 'USD').
 * @property {number} decimals - The number of decimal places for the currency's smallest unit (e.g., 2 for USD, 0 for JPY).
 * @property {string} [name] - The currency's full name (e.g., 'United States Dollar').
 */

/**
 * A protocol-agnostic, standardized object representing a supported country.
 * @typedef {Object} SupportedCountry
 * @property {string} code - The country's ISO 3166-1 alpha-2 or alpha-3 code.
 * @property {boolean} isBuyAllowed - Whether buying is supported in this country.
 * @property {boolean} isSellAllowed - Whether selling is supported in this country.
 * @property {string} [name] - The country's common name.
 */

/**
 * @typedef {BuyCommonOptions & (BuyExactCryptoAmountOptions | BuyWithFiatAmountOptions)} BuyOptions
 */

/**
 * @typedef {Object} BuyCommonOptions
 * @property {string} cryptoAsset - The provider-specific code of the crypto asset to purchase.
 * @property {string} fiatCurrency - The currency's ISO 4217 code (e.g., 'USD').
 * @property {string} [recipient] - The wallet address to receive the purchased crypto asset. Defaults to the account's address.
 */

/**
 * @typedef {Object} BuyExactCryptoAmountOptions
 * @property {number | bigint} cryptoAmount - The amount of crypto asset to buy, in its base unit (e.g., wei for ETH).
 * @property {never} [fiatAmount] - The amount of fiat currency to spend, in its smallest unit (e.g., cents for USD).
 */

/**
 * @typedef {Object} BuyWithFiatAmountOptions
 * @property {number | bigint} fiatAmount - The amount of fiat currency to spend, in its smallest unit (e.g., cents for USD).
 * @property {never} [cryptoAmount] - The amount of crypto asset to buy, in its base unit (e.g., wei for ETH).
 */

/**
 * @typedef {Object} BuyResult
 * @property {string} buyUrl - The URL for the user to complete the purchase.
 */

/**
 * @typedef {SellCommonOptions & (SellExactCryptoAmountOptions | SellForFiatAmountOptions)} SellOptions
 */

/**
 * @typedef {Object} SellCommonOptions
 * @property {string} cryptoAsset - The provider-specific code of the crypto asset to sell.
 * @property {string} fiatCurrency - The currency's ISO 4217 code (e.g., 'USD').
 * @property {string} [refundAddress] - The wallet address to receive refunds in case of failure. Defaults to the account's address.
 */

/**
 * @typedef {Object} SellExactCryptoAmountOptions
 * @property {number | bigint} cryptoAmount - The amount of crypto asset to sell, in its base unit (e.g., wei for ETH).
 * @property {never} [fiatAmount] - The amount of fiat currency to receive, in its smallest unit (e.g., cents for USD).
 */

/**
 * @typedef {Object} SellForFiatAmountOptions
 * @property {number | bigint} fiatAmount - The amount of fiat currency to receive, in its smallest unit (e.g., cents for USD).
 * @property {never} [cryptoAmount] - The amount of crypto asset to sell, in its base unit (e.g., wei for ETH).
 */

/**
 * @typedef {Object} SellResult
 * @property {string} sellUrl - The URL for the user to complete the sale.
 */

/**
 * A protocol-agnostic, standardized object representing a quote for an on/off-ramp transaction.
 *
 * @typedef {Object} FiatQuote
 * @property {bigint} cryptoAmount - The amount of the crypto asset, in its base unit (e.g., wei).
 * @property {bigint} fiatAmount - The amount of the fiat currency, in its smallest unit (e.g., cents).
 * @property {bigint} fee - The fee charged for the transaction, denominated in the smallest unit of the fiat currency.
 * @property {string} rate - The effective exchange rate, expressed as a string to avoid precision loss (e.g., a rate of "3000.50" for ETH/USD means 1 ETH = 3000.50 USD). Note: This rate applies to the standard units (e.g., ETH and USD).
 */

/** @interface */
export class IFiatProtocol {
  /**
   * Gets a quote for a crypto asset purchase.
   *
   * @param {Omit<BuyOptions, 'recipient'>} options - The options for the buy operation.
   * @returns {Promise<FiatQuote>} A quote for the transaction.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a purchase.
   * @throws {ValueError} If the buy options are not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the purchase.
   * @throws {BuyError} If the purchase fails with an error.
   */
  async quoteBuy (options) {
    throw new NotImplementedError('quoteBuy(options)')
  }

  /**
   * Generates a widget URL for a user to purchase a crypto asset with fiat currency.
   *
   * @param {BuyOptions} options - The options for the buy operation.
   * @returns {Promise<BuyResult>} The operation's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a purchase.
   * @throws {ValueError} If the buy options are not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the purchase.
   * @throws {BuyError} If the purchase fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the purchase exceeds the buy max. fee option.
   */
  async buy (options) {
    throw new NotImplementedError('buy(options)')
  }

  /**
   * Gets a quote for a crypto asset sale.
   *
   * @param {Omit<SellOptions, 'refundAddress'>} options - The options for the sell operation.
   * @returns {Promise<FiatQuote>} A quote for the transaction.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a sale.
   * @throws {ValueError} If the sell options are not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the sale.
   * @throws {SellError} If the sale fails with an error.
   */
  async quoteSell (options) {
    throw new NotImplementedError('quoteSell(options)')
  }

  /**
   * Generates a widget URL for a user to sell a crypto asset for fiat currency.
   *
   * @param {SellOptions} options - The options for the sell operation.
   * @returns {Promise<SellResult>} The operation's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a sale.
   * @throws {ValueError} If the buy options are not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the sale.
   * @throws {SellError} If the sale fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the sale exceeds the sell max. fee option.
   */
  async sell (options) {
    throw new NotImplementedError('sell(options)')
  }

  /**
   * Retrieves the details of a specific transaction from the provider.
   *
   * @param {string} txId - The unique identifier of the transaction.
   * @returns {Promise<FiatTransactionDetail>} The transaction details.
   * @throws {ValueError} If the transaction's id is not valid.
   * @throws {NoSuchElementError} If no transaction exists for the given id.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the transaction's details.
   */
  async getTransactionDetail (txId) {
    throw new NotImplementedError('getTransactionDetail(txId)')
  }

  /**
   * Retrieves a list of supported crypto assets from the provider.
   *
   * @returns {Promise<SupportedCryptoAsset[]>} An array of supported crypto assets.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available crypto assets.
   */
  async getSupportedCryptoAssets () {
    throw new NotImplementedError('getSupportedCryptoAssets()')
  }

  /**
   * Retrieves a list of supported fiat currencies from the provider.
   *
   * @returns {Promise<SupportedFiatCurrency[]>} An array of supported fiat currencies.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available fiat currencies.
   */
  async getSupportedFiatCurrencies () {
    throw new NotImplementedError('getSupportedFiatCurrencies()')
  }

  /**
   * Retrieves a list of supported countries from the provider.
   *
   * @returns {Promise<SupportedCountry[]>} An array of supported countries.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available countries.
   */
  async getSupportedCountries () {
    throw new NotImplementedError('getSupportedCountries()')
  }
}

/**
 * @abstract
 * @implements {IFiatProtocol}
 */
export default class FiatProtocol {
  /**
   * Creates a new interface to the protocol without binding it to a wallet account.
   *
   * @overload
   * @param {undefined} [account] - The wallet account to use to interact with the protocol.
   */
  /**
   * Creates a new read-only interface to the protocol.
   *
   * @overload
   * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
   */
  /**
   * Creates a new interface to the protocol.
   *
   * @overload
   * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
   */
  constructor (account) {
    /**
     * The wallet account to use to interact with the protocol.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount | undefined}
     */
    this._account = account
  }

  /**
   * Gets a quote for a crypto asset purchase.
   *
   * @abstract
   * @param {Omit<BuyOptions, 'recipient'>} options - The options for the buy operation.
   * @returns {Promise<FiatQuote>} A quote for the transaction.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a purchase.
   * @throws {ValueError} If the buy options are not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the purchase.
   * @throws {BuyError} If the purchase fails with an error.
   */
  async quoteBuy (options) {
    throw new NotImplementedError('quoteBuy(options)')
  }

  /**
   * Generates a URL for a user to purchase a crypto asset with fiat currency.
   *
   * @abstract
   * @param {BuyOptions} options - The options for the buy operation.
   * @returns {Promise<BuyResult>} The URL for the user to complete the purchase.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a purchase.
   * @throws {ValueError} If the buy options are not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the purchase.
   * @throws {BuyError} If the purchase fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the purchase exceeds the buy max. fee option.
   */
  async buy (options) {
    throw new NotImplementedError('buy(options)')
  }

  /**
   * Gets a quote for a crypto asset sale.
   *
   * @abstract
   * @param {Omit<SellOptions, 'refundAddress'>} options - The options for the sell operation.
   * @returns {Promise<FiatQuote>} A quote for the transaction.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a sale.
   * @throws {ValueError} If the sell options are not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the sale.
   * @throws {SellError} If the sale fails with an error.
   */
  async quoteSell (options) {
    throw new NotImplementedError('quoteSell(options)')
  }

  /**
   * Generates a URL for a user to sell a crypto asset for fiat currency.
   *
   * @abstract
   * @param {SellOptions} options - The options for the sell operation.
   * @returns {Promise<SellResult>} The URL for the user to complete the sale.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a sale.
   * @throws {ValueError} If the buy options are not valid.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the sale.
   * @throws {SellError} If the sale fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the sale exceeds the sell max. fee option.
   */
  async sell (options) {
    throw new NotImplementedError('sell(options)')
  }

  /**
   * Retrieves the details of a specific transaction from the provider.
   *
   * @abstract
   * @param {string} txId - The unique identifier of the transaction.
   * @returns {Promise<FiatTransactionDetail>} The transaction details.
   * @throws {ValueError} If the transaction's id is not valid.
   * @throws {NoSuchElementError} If no transaction exists for the given id.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the transaction's details.
   */
  async getTransactionDetail (txId) {
    throw new NotImplementedError('getTransactionDetail(txId)')
  }

  /**
   * Retrieves a list of supported crypto assets from the provider.
   *
   * @abstract
   * @returns {Promise<SupportedCryptoAsset[]>} An array of supported crypto assets.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available crypto assets.
   */
  async getSupportedCryptoAssets () {
    throw new NotImplementedError('getSupportedCryptoAssets()')
  }

  /**
   * Retrieves a list of supported fiat currencies from the provider.
   *
   * @abstract
   * @returns {Promise<SupportedFiatCurrency[]>} An array of supported fiat currencies.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available fiat currencies.
   */
  async getSupportedFiatCurrencies () {
    throw new NotImplementedError('getSupportedFiatCurrencies()')
  }

  /**
   * Retrieves a list of supported countries or regions from the provider.
   *
   * @abstract
   * @returns {Promise<SupportedCountry[]>} An array of supported countries.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the available countries.
   */
  async getSupportedCountries () {
    throw new NotImplementedError('getSupportedCountries()')
  }
}
