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

export class ValueError extends Error {
  /**
   * Create a new value error. Thrown when an argument has the correct type but
   * violates a validation rule.
   *
   * @param {string} message - The error's message.
   */
  constructor (message) {
    super(message)

    this.name = 'ValueError'
  }
}

export class NoSuchElementError extends Error {
  /**
   * Create a new no such element error. Thrown when a lookup finds no element for
   * the given identifier.
   *
   * @param {string} message - The error's message.
   */
  constructor (message) {
    super(message)

    this.name = 'NoSuchElementError'
  }
}
