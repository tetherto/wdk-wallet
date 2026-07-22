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

import { InvalidTokenError, MaximumFeeExceededError, ProviderError, ProviderRequiredError, ValueError, WdkError } from '../errors.js'

export { InvalidTokenError, MaximumFeeExceededError, ProviderError, ProviderRequiredError, ValueError, WdkError }

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
  LOWER_THAN_EXPECTED_OUTPUT: 'LOWER_THAN_EXPECTED_OUTPUT'
}

/**
 * @typedef {Object} SwapErrorOptions
 * @property {SwapErrorReason} reason - The error's reason.
 */

/**
 * Thrown when an operation requires a read-only account to be set.
 */
export class ReadOnlyAccountRequiredError extends WdkError {
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
