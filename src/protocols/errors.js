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

import { InvalidTokenError, MaximumFeeExceededError, NoSuchElementError, NotImplementedError, ProviderError, ProviderRequiredError, UnsupportedOperationError, ValueError, WdkError } from '../errors.js'

export { InvalidTokenError, MaximumFeeExceededError, NoSuchElementError, NotImplementedError, ProviderError, ProviderRequiredError, UnsupportedOperationError, ValueError, WdkError }

/**
 * @typedef {Object} SwapErrorOptions
 * @property {SwapErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} BridgeErrorOptions
 * @property {BridgeErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} SupplyErrorOptions
 * @property {SupplyErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} WithdrawErrorOptions
 * @property {WithdrawErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} BorrowErrorOptions
 * @property {BorrowErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} RepayErrorOptions
 * @property {RepayErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} BuyErrorOptions
 * @property {BuyErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} SellErrorOptions
 * @property {SellErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} SwidgeErrorOptions
 * @property {SwidgeErrorReason} reason - The error's reason.
 */

/**
 * Enum for swap error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const SwapErrorReason = {
  /**
   * Thrown when the account doesn't have enough funds to cover the costs of the swap.
   */
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  /**
   * Thrown when the account doesn't have enough funds to perform the swap.
   */
  INSUFFICIENT_TOKEN_BALANCE: 'INSUFFICIENT_TOKEN_BALANCE',
  /**
   * Thrown when the output amount is lower than the min. amount out option.
   */
  COULD_NOT_MET_THRESHOLD: 'COULD_NOT_MET_THRESHOLD'
}

/**
 * Enum for bridge error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const BridgeErrorReason = {
  /**
   * Thrown when the account doesn't have enough funds to cover the costs of the bridge.
   */
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  /**
   * Thrown when the account doesn't have enough funds to perform the bridge.
   */
  INSUFFICIENT_TOKEN_BALANCE: 'INSUFFICIENT_TOKEN_BALANCE'
}

/**
 * Enum for supply error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const SupplyErrorReason = {
  /**
   * Thrown when the account doesn't have enough funds to cover the costs of the supply.
   */
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  /**
   * Thrown when the account doesn't have enough funds to perform the supply.
   */
  INSUFFICIENT_TOKEN_BALANCE: 'INSUFFICIENT_TOKEN_BALANCE'
}

/**
 * Enum for withdraw error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const WithdrawErrorReason = {
  /**
   * Thrown when the account doesn't have enough funds to cover the costs of the withdraw.
   */
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  /**
   * Thrown when the account doesn't have enough funds to perform the withdraw.
   */
  INSUFFICIENT_TOKEN_BALANCE: 'INSUFFICIENT_TOKEN_BALANCE'
}

/**
 * Enum for borrow error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const BorrowErrorReason = {
  /**
   * Thrown when the account doesn't have enough funds to cover the costs of the borrow.
   */
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  /**
   * Thrown when the account doesn't have enough funds to perform the borrow.
   */
  INSUFFICIENT_TOKEN_BALANCE: 'INSUFFICIENT_TOKEN_BALANCE'
}

/**
 * Enum for repay error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const RepayErrorReason = {
  /**
   * Thrown when the account doesn't have enough funds to cover the costs of the repay.
   */
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  /**
   * Thrown when the account doesn't have enough funds to perform the repay.
   */
  INSUFFICIENT_TOKEN_BALANCE: 'INSUFFICIENT_TOKEN_BALANCE'
}

/**
 * Enum for buy error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const BuyErrorReason = {
  /**
   * Thrown when the user doesn't have enough funds to perform the purchase.
   */
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS'
}

/**
 * Enum for sell error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const SellErrorReason = {
  /**
   * Thrown when the user doesn't have enough funds to perform the sale.
   */
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS'
}

/**
 * Enum for swidge error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const SwidgeErrorReason = {
  /**
   * Thrown when the account doesn't have enough funds to cover the costs of the swidge.
   */
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  /**
   * Thrown when the account doesn't have enough funds to perform the swidge.
   */
  INSUFFICIENT_TOKEN_BALANCE: 'INSUFFICIENT_TOKEN_BALANCE',
  /**
   * Thrown when the output amount is lower than the min. amount out option.
   */
  COULD_NOT_MET_THRESHOLD: 'COULD_NOT_MET_THRESHOLD',
  /**
   * Thrown when the actual slippage is higher than the slippage option.
   */
  SLIPPAGE_TOO_HIGH: 'SLIPPAGE_TOO_HIGH'
}

/**
 * Thrown when an operation requires an account to be set.
 */
export class AccountRequiredError extends WdkError {
  /**
   * Creates a new account required error.
   *
   * @param {string} message - The error's message.
   */
  constructor (message) {
    super(message)

    this.name = 'AccountRequiredError'
  }
}

/**
 * Thrown when an operation requires a read-only account to be set.
 */
export class ReadOnlyAccountRequiredError extends AccountRequiredError {
  /**
   * Creates a new read-only account required error.
   *
   * @param {string} message - The error's message.
   */
  constructor (message) {
    super(message)

    this.name = 'ReadOnlyAccountRequiredError'
  }
}

/**
 * Thrown when a swap fails with an error.
 */
export class SwapError extends WdkError {
  /**
   * Creates a new swap error.
   *
   * @param {string} message - The error's message.
   * @param {SwapErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'SwapError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a bridge fails with an error.
 */
export class BridgeError extends WdkError {
  /**
   * Creates a new bridge error.
   *
   * @param {string} message - The error's message.
   * @param {BridgeErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'BridgeError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a supply fails with an error.
 */
export class SupplyError extends WdkError {
  /**
   * Creates a new supply error.
   *
   * @param {string} message - The error's message.
   * @param {BridgeErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'SupplyError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a withdraw fails with an error.
 */
export class WithdrawError extends WdkError {
  /**
   * Creates a new withdraw error.
   *
   * @param {string} message - The error's message.
   * @param {WithdrawErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'WithdrawError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a borrow fails with an error.
 */
export class BorrowError extends WdkError {
  /**
   * Creates a new borrow error.
   *
   * @param {string} message - The error's message.
   * @param {BorrowErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'BorrowError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a repay fails with an error.
 */
export class RepayError extends WdkError {
  /**
   * Creates a new repay error.
   *
   * @param {string} message - The error's message.
   * @param {RepayErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'RepayError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a purchase fails with an error.
 */
export class BuyError extends WdkError {
  /**
   * Creates a new buy error.
   *
   * @param {string} message - The error's message.
   * @param {BuyErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'BuyError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a sale fails with an error.
 */
export class SellError extends WdkError {
  /**
   * Creates a new sell error.
   *
   * @param {string} message - The error's message.
   * @param {SellErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'SellError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a swidge fails with an error.
 */
export class SwidgeError extends WdkError {
  /**
   * Creates a new swidge error.
   *
   * @param {string} message - The error's message.
   * @param {SwidgeErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'SwidgeError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}
