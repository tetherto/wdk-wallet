import { describe, expect, test } from '@jest/globals'

import { IWalletAccountReadOnlyMultisig } from '../src/multisig/index.js'

describe('IWalletAccountReadOnlyMultisig', () => {
  describe('getMultisigInfo', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.getMultisigInfo())
        .rejects.toThrow("Method 'getMultisigInfo()' must be implemented.")
    })
  })

  describe('getProposals', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.getProposals(['proposal-1']))
        .rejects.toThrow("Method 'getProposals(proposalIds)' must be implemented.")
    })
  })

  describe('getProposal', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.getProposal('proposal-1'))
        .rejects.toThrow("Method 'getProposal(proposalId)' must be implemented.")
    })
  })

  describe('getMessageProposals', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.getMessageProposals(['message-1']))
        .rejects.toThrow("Method 'getMessageProposals(messageIds)' must be implemented.")
    })
  })

  describe('getMessageProposal', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.getMessageProposal('message-1'))
        .rejects.toThrow("Method 'getMessageProposal(messageId)' must be implemented.")
    })
  })

  describe('quoteExecuteProposal', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.quoteExecuteProposal('proposal-1'))
        .rejects.toThrow("Method 'quoteExecuteProposal(proposalId)' must be implemented.")
    })
  })

  describe('inherited members', () => {
    test('getAddress should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.getAddress())
        .rejects.toThrow("Method 'getAddress()' must be implemented.")
    })

    test('verify should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.verify('message', 'signature'))
        .rejects.toThrow("Method 'verify(message, signature)' must be implemented.")
    })

    test('getBalance should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.getBalance())
        .rejects.toThrow("Method 'getBalance()' must be implemented.")
    })

    test('getTokenBalance should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.getTokenBalance('0xtoken'))
        .rejects.toThrow("Method 'getTokenBalance(tokenAddress)' must be implemented.")
    })

    test('getTransactionReceipt should throw if not implemented', async () => {
      const account = new IWalletAccountReadOnlyMultisig()

      await expect(account.getTransactionReceipt('0xhash'))
        .rejects.toThrow("Method 'getTransactionReceipt(hash)' must be implemented.")
    })
  })
})
