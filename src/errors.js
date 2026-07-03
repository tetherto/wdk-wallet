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

export class NotImplementedError extends Error {
  /**
   * Create a new not implemented error.
   *
   * @param {string} methodName - The method's name.
   */
  constructor (methodName) {
    super(`Method '${methodName}' must be implemented.`)

    this.name = 'NotImplementedError'
  }
}

export class SignerError extends Error {
  /**
   * Create a new signer error.
   *
   * @param {string} message - The error's message.
   */
  constructor (message) {
    super(message)

    this.name = 'SignerError'
  }
}

export class UnsupportedOperationError extends Error {
  /**
   * Create a new unsupported operation error. Thrown by an optional operation
   * that the concrete implementation deliberately does not support, so consumers
   * can distinguish "not supported here" from an abstract method left unimplemented.
   *
   * @param {string} operation - The name of the operation that is not supported.
   */
  constructor (operation) {
    super(`Operation '${operation}' is not supported by this protocol.`)

    this.name = 'UnsupportedOperationError'
  }
}

export class AccountRequiredError extends Error {
  /**
   * Create a new account required error. Thrown when an operation needs a wallet
   * account to run but none was bound at construction.
   *
   * @param {string} operation - The name of the operation that requires a wallet account.
   */
  constructor (operation) {
    super(`Operation '${operation}' requires a wallet account.`)

    this.name = 'AccountRequiredError'
  }
}
