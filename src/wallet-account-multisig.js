// src/wallet-account-multisig.js

'use strict'

import { IWalletAccount } from './wallet-account.js'
import { NotImplementedError } from './errors.js'

/**
 * @typedef {Object} MultisigResult
 * @property {string} proposalId - Unique identifier for the created proposal
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold for execution
 */

/**
 * @typedef {Object} MultisigExecuteResult
 * @property {string} hash - The finalized on-chain transaction identifier
 */

/**
 * @typedef {Object} MessageProposal
 * @property {string} messageHash - Unique identifier for the message proposal
 * @property {string} signature - This signer's signature
 * @property {number} confirmations - Number of confirmations
 * @property {number} threshold - Required threshold
 * @property {string | null} combinedSignature - Final combined signature when threshold is met
 */

/** @interface */
export class IWalletAccountMultisig extends IWalletAccount {
  /**
   * Proposes signing a message with the multisig.
   * The proposer's signature is included automatically.
   *
   * @param {string} message - The message to sign
   * @returns {Promise<MessageProposal>} The message proposal result
   */
  async proposeMessage (message) {
    throw new NotImplementedError('proposeMessage(message)')
  }

  /**
   * Approves an existing message proposal.
   *
   * @param {string} messageHash - The message hash to approve
   * @returns {Promise<MessageProposal>} The approval result
   */
  async approveMessage (messageHash) {
    throw new NotImplementedError('approveMessage(messageHash)')
  }

  // ==========================================
  // Proposal Lifecycle
  // ==========================================
  /**
   * Creates a new proposal for a transaction.
   * The proposer's signature is included automatically.
   *
   *
   * @param {import('./wallet-account-read-only.js').Transaction} tx - The transaction to propose
   * @returns {Promise<MultisigResult>} The proposal result
   */
  async propose (tx) {
    throw new NotImplementedError('propose(tx)')
  }

  /**
   * Adds the current signer's approval to an existing proposal.
   *
   * @param {string} proposalId - The proposal identifier to approve
   * @returns {Promise<MultisigResult>} The approval result
   */
  async approve (proposalId) {
    throw new NotImplementedError('approve(proposalId)')
  }

  /**
   * Rejects a pending proposal.
   * Behavior is chain-specific: some chains support on-chain rejection,
   * others may create a competing proposal or simply record disapproval.
   *
   * @param {string} proposalId - The proposal identifier to reject
   * @returns {Promise<MultisigResult>} The rejection result
   */
  async reject (proposalId) {
    throw new NotImplementedError('reject(proposalId)')
  }

  /**
   * Submits a fully-signed proposal for on-chain execution.
   *
   * @param {string} proposalId - The proposal identifier to execute
   * @returns {Promise<MultisigExecuteResult>} The transaction hash
   */
  async execute (proposalId) {
    throw new NotImplementedError('execute(proposalId)')
  }

  // ==========================================
  // Owner Management
  // ==========================================

  /**
   * Proposes adding a new owner to the multisig.
   * throw NotImplementedError if not supported.
   *
   * @param {string} owner - The new owner's identifier (address/pubkey)
   * @param {number} [newThreshold] - Optional new threshold
   * @returns {Promise<MultisigResult>} The proposal result
   */
  async addOwner (owner, newThreshold) {
    throw new NotImplementedError('addOwner(owner, newThreshold)')
  }

  /**
   * Proposes removing an owner from the multisig.
   *
   * @param {string} owner - The owner's identifier to remove
   * @param {number} [newThreshold] - Optional new threshold
   * @returns {Promise<MultisigResult>} The proposal result
   */
  async removeOwner (owner, newThreshold) {
    throw new NotImplementedError('removeOwner(owner, newThreshold)')
  }

  /**
   * Proposes replacing one owner with another.
   *
   * @param {string} oldOwner - The owner to replace
   * @param {string} newOwner - The replacement owner
   * @returns {Promise<MultisigResult>} The proposal result
   */
  async swapOwner (oldOwner, newOwner) {
    throw new NotImplementedError('swapOwner(oldOwner, newOwner)')
  }

  /**
   * Proposes changing the signature threshold.
   *
   * @param {number} newThreshold - The new threshold
   * @returns {Promise<MultisigResult>} The proposal result
   */
  async changeThreshold (newThreshold) {
    throw new NotImplementedError('changeThreshold(newThreshold)')
  }
}
