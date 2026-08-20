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

import { IWalletAccountReadOnlySimple } from '../wallet-account-read-only-simple.js'

import { NotImplementedError } from './errors.js'

/** @typedef {import('../wallet-account-read-only.js').TransactionResult} TransactionResult */

/** @typedef {import('./errors.js').NoSuchElementError} NoSuchElementError */
/** @typedef {import('./errors.js').ProviderError} ProviderError */
/** @typedef {import('./errors.js').ProviderRequiredError} ProviderRequiredError */
/** @typedef {import('./errors.js').TransactionError} TransactionError */
/** @typedef {import('./errors.js').ValueError} ValueError */

/**
 * @typedef {Object} MultisigInfo
 * @property {string} address - The multisig wallet account address.
 * @property {string[]} owners - The owners of the multisig wallet account.
 * @property {number} threshold - The minimum amount of signatures to execute a transaction.
 */

/**
 *
 * @typedef {Object} MultisigProposal
 * @property {string} proposalId - The proposal's id.
 * @property {number} confirmations - The current number of confirmations.
 * @property {number} threshold - The minimum amount of confirmations to execute the transaction.
 * @property {'pending' | 'executed'} status - The proposal's lifecycle state: `'pending'` while it still awaits confirmations or on-chain execution, `'executed'` once it has been executed on-chain.
 */

/** @interface */
export class IWalletAccountReadOnlyMultisig extends IWalletAccountReadOnlySimple {
  /**
   * Returns the multisig wallet account info.
   *
   * @returns {Promise<MultisigInfo>} The info.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the multisig wallet's info.
  */
  async getMultisigInfo () {
    throw new NotImplementedError('getMultisigInfo()')
  }

  /**
   * Returns a list of proposals by their identifiers.
   *
   * @param {string[]} proposalIds - The list of proposal's identifiers.
   * @returns {Promise<Record<string, MultisigProposal | null>>} For each proposal id, the proposal details or
   *   null if the proposal has not been found.
   * @throws {ValueError} If the list of proposal's identifiers contains an invalid id.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the proposals.
   */
  async getProposals (proposalIds) {
    throw new NotImplementedError('getProposals(proposalIds)')
  }

  /**
   * Returns a proposal by its identifier.
   *
   * @param {string} proposalId - The proposal's identifier.
   * @returns {Promise<MultisigProposal | null>} The proposal details, or null if it has not been found.
   * @throws {ValueError} If the proposal's identifier is not a valid id.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to fetch the proposal.
   */
  async getProposal (proposalId) {
    throw new NotImplementedError('getProposal(proposalId)')
  }

  /**
   * Quotes the on-chain cost of executing a pending proposal.
   *
   * @param {string} proposalId - The proposal's id.
   * @returns {Promise<Omit<TransactionResult, 'hash'>>} The execution cost estimate.
   * @throws {ValueError} If the proposal's identifier is not a valid id.
   * @throws {NoSuchElementError} If no proposal exists for the given id.
   * @throws {ProviderRequiredError} If the method requires a provider.
   * @throws {ProviderError} If the provider fails to estimate the costs of the transaction.
   * @throws {TransactionError} If the transaction fails with an error.
   */
  async quoteExecuteProposal (proposalId) {
    throw new NotImplementedError('quoteExecuteProposal(proposalId)')
  }
}
