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

import { MaximumFeeExceededError, NoSuchElementError, NotImplementedError, ProviderError, ProviderRequiredError, TransactionError, TransactionErrorReason, ValueError, WdkError } from '../errors.js'

export { MaximumFeeExceededError, NoSuchElementError, NotImplementedError, ProviderError, ProviderRequiredError, TransactionError, TransactionErrorReason, ValueError, WdkError }

/**
 * @typedef {import('../errors.js').TransactionErrorOptions} TransactionErrorOptions
 */

/**
 * Thrown when the account is not an owner of the multisig wallet.
 */
export class AccountNotOwnerError extends WdkError {
  /**
   * Creates a new account not owner error.
   *
   * @param {string} message - The error's message.
   */
  constructor (message) {
    super(message)

    this.name = 'AccountNotOwnerError'
  }
}

/**
 * Thrown when the account attempts to execute a proposal but its threshold has not been met yet.
 */
export class ThresholdNotMetError extends WdkError {
  /**
   * Creates a new threshold not met error.
   *
   * @param {string} message - The error's message.
   */
  constructor (message) {
    super(message)

    this.name = 'ThresholdNotMetError'
  }
}
