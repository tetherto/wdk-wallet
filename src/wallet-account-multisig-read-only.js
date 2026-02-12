// src/wallet-account-multisig-read-only.js

'use strict'

import { NotImplementedError } from './errors.js'

/**
 * A chain-agnostic proposal object representing a pending multisig transaction.
 *
 * @typedef {Object} MultisigProposal
 * @property {string} proposalId - Unique identifier for the created proposal
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold for execution
 */

/** @interface */
export class IWalletAccountMultisigReadOnly {

  /**
   * Returns the address/identifier of the signer associated with this account
   * (the individual key, not the multisig address).
   * Returns null if no signer is associated.
   *
   * @returns {Promise<string | null>} The signer's identifier
   */
  async getSignerAddress () {
    throw new NotImplementedError('getSignerAddress()')
  }

  /**
   * Returns the list of owners/co-signers of the multisig wallet.
   * The format of each entry is chain-specific (address, pubkey, etc).
   *
   * @returns {Promise<string[]>} Array of owner identifiers
   */
  async getOwners () {
    throw new NotImplementedError('getOwners()')
  }

  /**
   * Returns the number of required signatures to execute a transaction.
   *
   * @returns {Promise<number>} The threshold
   */
  async getThreshold () {
    throw new NotImplementedError('getThreshold()')
  }

  /**
   * Returns a proposal by its identifier.
   *
   * @param {string} proposalId - The proposal identifier
   * @returns {Promise<MultisigProposal | null>} The proposal details, or null if not found
   */
  async getProposal (proposalId) {
    throw new NotImplementedError('getProposal(proposalId)')
  }

  /**
   * Checks if a proposal has enough signatures to be executed.
   *
   * @param {string} proposalId - The proposal identifier
   * @returns {Promise<boolean>} True if ready to execute
   */
  async isReadyToExecute (proposalId) {
    throw new NotImplementedError('isReadyToExecute(proposalId)')
  }
}