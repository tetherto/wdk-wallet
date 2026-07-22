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
/** @typedef {import('./errors.js').BorrowError} BorrowError */
/** @typedef {import('./errors.js').InvalidTokenError} InvalidTokenError */
/** @typedef {import('./errors.js').MaximumFeeExceededError} MaximumFeeExceededError */
/** @typedef {import('./errors.js').ReadOnlyAccountRequiredError} ReadOnlyAccountRequiredError */
/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').RepayError} RepayError */
/** @typedef {import('./errors.js').SupplyError} SupplyError */
/** @typedef {import('./errors.js').ValueError} ValueError */
/** @typedef {import('./errors.js').WithdrawError} WithdrawError */

/**
 * @typedef {Object} SupplyOptions
 * @property {string} token - The address of the token to supply.
 * @property {number | bigint} amount - The amount of tokens to supply (in base unit).
 * @property {string} [onBehalfOf] - The address on behalf of which the supply operation should be performed. If not set, the supply operation will be performed on behalf of the account itself.
 */

/**
 * @typedef {Object} SupplyResult
 * @property {string} hash - The hash of the supply operation.
 * @property {bigint} fee - The gas cost.
 */

/**
 * @typedef {Object} WithdrawOptions
 * @property {string} token - The address of the token to withdraw.
 * @property {number | bigint} amount - The amount of tokens to withdraw (in base unit).
 * @property {string} [to] - The address that should receive the tokens. If not set, the account itself will receive the funds.
 */

/**
 * @typedef {Object} WithdrawResult
 * @property {string} hash - The hash of the withdraw operation.
 * @property {bigint} fee - The gas cost.
 */

/**
 * @typedef {Object} BorrowOptions
 * @property {string} token - The address of the token to borrow.
 * @property {number | bigint} amount - The amount of tokens to borrow (in base unit).
 * @property {string} [onBehalfOf] - The address on behalf of which the borrow operation should be performed. If not set, the borrow operation will be performed on behalf of the account itself.
 */

/**
 * @typedef {Object} BorrowResult
 * @property {string} hash - The hash of the borrow operation.
 * @property {bigint} fee - The gas cost.
 */

/**
 * @typedef {Object} RepayOptions
 * @property {string} token - The address of the token to repay.
 * @property {number | bigint} amount - The amount of tokens to repay (in base unit).
 * @property {string} [onBehalfOf] - The address on behalf of which the repay operation should be performed. If not set, the repay operation will be performed on behalf of the account itself.
 */

/**
 * @typedef {Object} RepayResult
 * @property {string} hash - The hash of the repay operation.
 * @property {bigint} fee - The gas cost.
 */

/** @interface */
export class ILendingProtocol {
  /**
   * Supplies a specific token amount to the lending pool.
   *
   * @param {SupplyOptions} options - The supply's options.
   * @returns {Promise<SupplyResult>} The supply's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a supply.
   * @throws {ValueError} If the supply options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the supply.
   * @throws {SupplyError} If the supply fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the supply max. fee option.
   */
  async supply (options) {
    throw new NotImplementedError('supply(options)')
  }

  /**
   * Quotes the costs of a supply operation.
   *
   * @param {SupplyOptions} options - The supply's options.
   * @returns {Promise<Omit<SupplyResult, 'hash'>>} The supply's costs.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a supply.
   * @throws {ValueError} If the supply options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the supply.
   * @throws {SupplyError} If the supply fails with an error.
   */
  async quoteSupply (options) {
    throw new NotImplementedError('quoteSupply(options)')
  }

  /**
   * Withdraws a specific token amount from the pool.
   *
   * @param {WithdrawOptions} options - The withdraw's options.
   * @returns {Promise<WithdrawResult>} The withdraw's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a withdraw.
   * @throws {ValueError} If the withdraw options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the withdraw.
   * @throws {WithdrawError} If the withdraw fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the withdraw max. fee option.
   */
  async withdraw (options) {
    throw new NotImplementedError('withdraw(options)')
  }

  /**
   * Quotes the costs of a withdraw operation.
   *
   * @param {WithdrawOptions} options - The withdraw's options.
   * @returns {Promise<Omit<WithdrawResult, 'hash'>>} The withdraw's costs.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a supply.
   * @throws {ValueError} If the withdraw options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the withdraw.
   * @throws {WithdrawError} If the withdraw fails with an error.
   */
  async quoteWithdraw (options) {
    throw new NotImplementedError('quoteWithdraw(options)')
  }

  /**
   * Borrows a specific token amount.
   *
   * @param {BorrowOptions} options - The borrow's options.
   * @returns {Promise<BorrowResult>} The borrow's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a borrow.
   * @throws {ValueError} If the borrow options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the borrow.
   * @throws {BorrowError} If the borrow fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the borrow max. fee option.
   */
  async borrow (options) {
    throw new NotImplementedError('borrow(options)')
  }

  /**
   * Quotes the costs of a borrow operation.
   *
   * @param {BorrowOptions} options - The borrow's options.
   * @returns {Promise<Omit<BorrowResult, 'hash'>>} The borrow's costs.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a borrow.
   * @throws {ValueError} If the borrow options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the borrow.
   * @throws {BorrowError} If the borrow fails with an error.
   */
  async quoteBorrow (options) {
    throw new NotImplementedError('quoteBorrow(options)')
  }

  /**
   * Repays a specific token amount.
   *
   * @param {RepayOptions} options - The repay's options.
   * @returns {Promise<RepayResult>} The repay's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a repay.
   * @throws {ValueError} If the repay options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the repay.
   * @throws {RepayError} If the repay fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the repay max. fee option.
   */
  async repay (options) {
    throw new NotImplementedError('repay(options)')
  }

  /**
   * Quotes the costs of a repay operation.
   *
   * @param {RepayOptions} options - The repay's options.
   * @returns {Promise<Omit<RepayResult, 'hash'>>} The repay's costs.
   * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a repay.
   * @throws {ValueError} If the repay options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the repay.
   * @throws {RepayError} If the repay fails with an error.
   */
  async quoteRepay (options) {
    throw new NotImplementedError('quoteRepay(options)')
  }
}

/**
 * @abstract
 * @implements {ILendingProtocol}
 */
export default class LendingProtocol {
  /**
   * Creates a new read-only lending protocol.
   *
   * @overload
   * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
   */

  /**
   * Creates a new lending protocol.
   *
   * @overload
   * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
   */
  constructor (account) {
    /**
     * The wallet account to use to interact with the protocol.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount}
     */
    this._account = account
  }

  /**
   * Supplies a specific token amount to the lending pool.
   *
   * @abstract
   * @param {SupplyOptions} options - The supply's options.
   * @returns {Promise<SupplyResult>} The supply's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a supply.
   * @throws {ValueError} If the supply options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the supply.
   * @throws {SupplyError} If the supply fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the supply max. fee option.
   */
  async supply (options) {
    throw new NotImplementedError('supply(options)')
  }

  /**
   * Quotes the costs of a supply operation.
   *
   * @abstract
   * @param {SupplyOptions} options - The supply's options.
   * @returns {Promise<Omit<SupplyResult, 'hash'>>} The supply's costs.
   * @throws {ValueError} If the supply options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the supply.
   * @throws {SupplyError} If the supply fails with an error.
   */
  async quoteSupply (options) {
    throw new NotImplementedError('quoteSupply(options)')
  }

  /**
   * Withdraws a specific token amount from the pool.
   *
   * @abstract
   * @param {WithdrawOptions} options - The withdraw's options.
   * @returns {Promise<WithdrawResult>} The withdraw's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a withdraw.
   * @throws {ValueError} If the withdraw options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the withdraw.
   * @throws {WithdrawError} If the withdraw fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the withdraw max. fee option.
   */
  async withdraw (options) {
    throw new NotImplementedError('withdraw(options)')
  }

  /**
   * Quotes the costs of a withdraw operation.
   *
   * @abstract
   * @param {WithdrawOptions} options - The withdraw's options.
   * @returns {Promise<Omit<WithdrawResult, 'hash'>>} The withdraw's costs.
   * @throws {ValueError} If the withdraw options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the withdraw.
   * @throws {WithdrawError} If the withdraw fails with an error.
   */
  async quoteWithdraw (options) {
    throw new NotImplementedError('quoteWithdraw(options)')
  }

  /**
   * Borrows a specific token amount.
   *
   * @abstract
   * @param {BorrowOptions} options - The borrow's options.
   * @returns {Promise<BorrowResult>} The borrow's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a borrow.
   * @throws {ValueError} If the borrow options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the borrow.
   * @throws {BorrowError} If the borrow fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the borrow max. fee option.
   */
  async borrow (options) {
    throw new NotImplementedError('borrow(options)')
  }

  /**
   * Quotes the costs of a borrow operation.
   *
   * @abstract
   * @param {BorrowOptions} options - The borrow's options.
   * @returns {Promise<Omit<BorrowResult, 'hash'>>} The borrow's costs.
   * @throws {ValueError} If the borrow options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the borrow.
   * @throws {BorrowError} If the borrow fails with an error.
   */
  async quoteBorrow (options) {
    throw new NotImplementedError('quoteBorrow(options)')
  }

  /**
   * Repays a specific token amount.
   *
   * @abstract
   * @param {RepayOptions} options - The borrow's options.
   * @returns {Promise<RepayResult>} The repay's result.
   * @throws {AccountRequiredError} If the protocol requires a full account to perform a repay.
   * @throws {ValueError} If the repay options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to perform the repay.
   * @throws {RepayError} If the repay fails with an error.
   * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the repay max. fee option.
   */
  async repay (options) {
    throw new NotImplementedError('repay(options)')
  }

  /**
   * Quotes the costs of a repay operation.
   *
   * @abstract
   * @param {RepayOptions} options - The repay's options.
   * @returns {Promise<Omit<RepayResult, 'hash'>>} The repay's costs.
   * @throws {ValueError} If the repay options are not valid.
   * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the repay.
   * @throws {RepayError} If the repay fails with an error.
   */
  async quoteRepay (options) {
    throw new NotImplementedError('quoteRepay(options)')
  }
}
