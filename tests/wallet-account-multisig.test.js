import { describe, expect, test } from '@jest/globals'

import { IWalletAccountMultisig } from '../src/multisig/index.js'

describe('IWalletAccountMultisig', () => {
  describe('index', () => {
    test('should throw if not implemented', () => {
      const account = new IWalletAccountMultisig()

      expect(() => account.index)
        .toThrow("Method 'index' must be implemented.")
    })
  })

  describe('path', () => {
    test('should throw if not implemented', () => {
      const account = new IWalletAccountMultisig()

      expect(() => account.path)
        .toThrow("Method 'path' must be implemented.")
    })
  })

  describe('keyPair', () => {
    test('should throw if not implemented', () => {
      const account = new IWalletAccountMultisig()

      expect(() => account.keyPair)
        .toThrow("Method 'keyPair' must be implemented.")
    })
  })

  describe('getSignerAddress', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getSignerAddress())
        .rejects.toThrow("Method 'getSignerAddress()' must be implemented.")
    })
  })

  describe('propose', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.propose({}))
        .rejects.toThrow("Method 'propose(tx, transactionOptions)' must be implemented.")
    })
  })

  describe('proposeMessage', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.proposeMessage('message'))
        .rejects.toThrow("Method 'proposeMessage(message)' must be implemented.")
    })
  })

  describe('approveMessageProposal', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.approveMessageProposal('message-1'))
        .rejects.toThrow("Method 'approveMessageProposal(messageId)' must be implemented.")
    })
  })

  describe('approveProposal', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.approveProposal('proposal-1'))
        .rejects.toThrow("Method 'approveProposal(proposalId)' must be implemented.")
    })
  })

  describe('rejectProposal', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.rejectProposal('proposal-1'))
        .rejects.toThrow("Method 'rejectProposal(proposalId)' must be implemented.")
    })
  })

  describe('executeProposal', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.executeProposal('proposal-1'))
        .rejects.toThrow("Method 'executeProposal(proposalId)' must be implemented.")
    })
  })

  describe('inherited members', () => {
    test('getMultisigInfo should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getMultisigInfo())
        .rejects.toThrow("Method 'getMultisigInfo()' must be implemented.")
    })

    test('getProposals should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getProposals(['proposal-1']))
        .rejects.toThrow("Method 'getProposals(proposalIds)' must be implemented.")
    })

    test('getProposal should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getProposal('proposal-1'))
        .rejects.toThrow("Method 'getProposal(proposalId)' must be implemented.")
    })

    test('getMessageProposals should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getMessageProposals(['message-1']))
        .rejects.toThrow("Method 'getMessageProposals(messageIds)' must be implemented.")
    })

    test('getMessageProposal should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getMessageProposal('message-1'))
        .rejects.toThrow("Method 'getMessageProposal(messageId)' must be implemented.")
    })

    test('quoteExecuteProposal should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.quoteExecuteProposal('proposal-1'))
        .rejects.toThrow("Method 'quoteExecuteProposal(proposalId)' must be implemented.")
    })

    test('getAddress should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getAddress())
        .rejects.toThrow("Method 'getAddress()' must be implemented.")
    })

    test('verify should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.verify('message', 'signature'))
        .rejects.toThrow("Method 'verify(message, signature)' must be implemented.")
    })

    test('getBalance should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getBalance())
        .rejects.toThrow("Method 'getBalance()' must be implemented.")
    })

    test('getTokenBalance should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getTokenBalance('0xtoken'))
        .rejects.toThrow("Method 'getTokenBalance(tokenAddress)' must be implemented.")
    })

    test('getTransactionReceipt should throw if not implemented', async () => {
      const account = new IWalletAccountMultisig()

      await expect(account.getTransactionReceipt('0xhash'))
        .rejects.toThrow("Method 'getTransactionReceipt(hash)' must be implemented.")
    })
  })
})
