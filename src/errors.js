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

/**
 * @typedef {Object} ProviderErrorOptions
 * @property {ProviderErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} TransactionErrorOptions
 * @property {TransactionErrorReason} reason - The error's reason.
 */

/**
 * @typedef {Object} TransferErrorOptions
 * @property {TransferErrorReason} reason - The error's reason.
 */

/**
 * Enum for provider error reasons.
 *
 * @readonly
 * @enum {number}
 */
export const ProviderErrorReason = {
  /**
   * Thrown when the client fails to establish a connection with the provider.
   */
  NETWORK_ERROR: 0,
  /**
   * Thrown when the client fails to authenticate to the provider.
   */
  UNAUTHORIZED: 401,
  /**
   * Thrown when the client doesn't have enough permissions to perform an operation.
   */
  FORBIDDEN: 403,
  /**
   * Thrown when the provider times out.
   */
  REQUEST_TIMEOUT: 408,
  /**
   * Thrown when the provider experiences an internal server error.
   */
  INTERNAL_SERVER_ERROR: 500
}

/**
 * Enum for transaction error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const TransactionErrorReason = {
  /**
   * Thrown when the account doesn't have enough funds to perform the transaction.
   */
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE'
}

/**
 * Enum for transfer error reasons.
 *
 * @readonly
 * @enum {string}
 */
export const TransferErrorReason = {
  /**
   * Thrown when the account doesn't have enough funds to cover the costs of the transfer.
   */
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  /**
   * Thrown when the account doesn't have enough funds to perform the transfer.
   */
  INSUFFICIENT_TOKEN_BALANCE: 'INSUFFICIENT_TOKEN_BALANCE'
}

/**
 * Super-class for errors thrown by wallet development kit's wallet and protocol modules.
 */
export class WdkError extends Error {
  /**
   * Creates a new wallet development kit error.
   *
   * @param {string} message - The error's message.
   * @param {ErrorOptions} [options] - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'WdkError'
  }
}

/**
 * Thrown when an abstract method is lacking implementation in the sub-class.
 */
export class NotImplementedError extends WdkError {
  /**
   * Creates a new not implemented error.
   *
   * @param {string} methodName - The method's name.
   */
  constructor (methodName) {
    super(`Method '${methodName}' is not implemented.`)

    this.name = 'NotImplementedError'
  }
}

/**
 * Thrown when an assertion fails.
 */
export class AssertionError extends WdkError {
  /**
   * Creates a new assertion error.
   *
   * @param {string} message - The error's message.
   */
  constructor (message) {
    super(message)

    this.name = 'AssertionError'
  }
}

/**
 * Thrown when an operation is not supported in the implementation of an interface or abstract class.
 */
export class UnsupportedOperationError extends WdkError {
  /**
   * Creates a new unsupported operation error.
   *
   * @param {string} method - The method's name.
   */
  constructor (method) {
    super(`Method '${method}' is not supported.`)

    this.name = 'UnsupportedOperationError'
  }
}

/**
 * Thrown when a method's argument holds an invalid value.
 */
export class ValueError extends WdkError {
  /**
   * Creates a new value error.
   *
   * @param {string} message - The error's message.
   * @param {ErrorOptions} [options] - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'ValueError'
  }
}

/**
 * Thrown when no element is found for the given identifier.
 */
export class NoSuchElementError extends WdkError {
  /**
   * Creates a new no such element error.
   *
   * @param {string} message - The error's message.
   * @param {ErrorOptions} [options] - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'NoSuchElementError'
  }
}

/**
 * Thrown when an operation rejects to use the given signer.
 */
export class InvalidSignerError extends WdkError {
  /**
   * Creates a new invalid signer error.
   *
   * @param {string} message - The error's message.
   * @param {ErrorOptions} [options] - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'InvalidSignerError'
  }
}

/**
 * Thrown when an address doesn't match an existing token.
 */
export class InvalidTokenError extends WdkError {
  /**
   * Creates a new invalid token error.
   *
   * @param {string} message - The error's message.
   * @param {ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'InvalidTokenError'
  }
}

/**
 * Thrown when an operation requires a provider.
 */
export class ProviderRequiredError extends WdkError {
  /**
   * Creates a new provider required error.
   *
   * @param {string} message - The error's message.
   */
  constructor (message) {
    super(message)

    this.name = 'ProviderRequiredError'
  }
}

/**
 * Thrown when a provider fails to perform an operation.
 */
export class ProviderError extends WdkError {
  /**
   * Creates a new provider error.
   *
   * @param {string} message - The error's message.
   * @param {ProviderErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'ProviderError'

    /**
     * The error's reason.
     *
     * @type {number}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a transaction fails with an error.
 */
export class TransactionError extends WdkError {
  /**
   * Creates a new transaction error.
   *
   * @param {string} message - The error's message.
   * @param {TransactionErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'TransactionError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when a transfer fails with an error.
 */
export class TransferError extends WdkError {
  /**
   * Creates a new transaction error.
   *
   * @param {string} message - The error's message.
   * @param {TransferErrorOptions & ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'TransferError'

    /**
     * The error's reason.
     *
     * @type {string}
     */
    this.reason = options.reason
  }
}

/**
 * Thrown when an operation exceeds its maximum fee threshold.
 */
export class MaximumFeeExceededError extends WdkError {
  /**
   * Creates a new maximum fee exceeded error.
   *
   * @param {string} message - The error's message.
   * @param {ErrorOptions} options - The error's options.
   */
  constructor (message, options) {
    super(message, options)

    this.name = 'MaximumFeeExceededError'
  }
}
