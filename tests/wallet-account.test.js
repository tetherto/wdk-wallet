import { describe, expect, test } from '@jest/globals'

import { IWalletAccount } from '../index.js'

describe('IWalletAccount', () => {
  describe('index', () => {
    test('should throw if not implemented', () => {
      const account = new IWalletAccount()

      expect(() => account.index)
        .toThrow("Method 'index' must be implemented.")
    })
  })

  describe('path', () => {
    test('should throw if not implemented', () => {
      const account = new IWalletAccount()

      expect(() => account.path)
        .toThrow("Method 'path' must be implemented.")
    })
  })

  describe('keyPair', () => {
    test('should throw if not implemented', () => {
      const account = new IWalletAccount()

      expect(() => account.keyPair)
        .toThrow("Method 'keyPair' must be implemented.")
    })
  })

  describe('sign', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.sign('message'))
        .rejects.toThrow("Method 'sign(message)' must be implemented.")
    })
  })

  describe('signTransaction', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.signTransaction({}))
        .rejects.toThrow("Method 'signTransaction(tx)' must be implemented.")
    })
  })

  describe('verify', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.verify('message', 'signature'))
        .rejects.toThrow("Method 'verify(message, signature)' must be implemented.")
    })
  })

  describe('sendTransaction', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.sendTransaction({}))
        .rejects.toThrow("Method 'sendTransaction(tx)' must be implemented.")
    })
  })

  describe('quoteSendTransaction', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.quoteSendTransaction({}))
        .rejects.toThrow("Method 'quoteSendTransaction(tx)' must be implemented.")
    })
  })

  describe('transfer', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.transfer({}))
        .rejects.toThrow("Method 'transfer(options)' must be implemented.")
    })
  })

  describe('toReadOnlyAccount', () => {
    test('should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.toReadOnlyAccount())
        .rejects.toThrow("Method 'toReadOnlyAccount()' must be implemented.")
    })
  })

  describe('dispose', () => {
    test('should throw if not implemented', () => {
      const account = new IWalletAccount()

      expect(() => account.dispose())
        .toThrow("Method 'dispose()' must be implemented.")
    })
  })

  describe('inherited members', () => {
    test('getAddress should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.getAddress())
        .rejects.toThrow("Method 'getAddress()' must be implemented.")
    })

    test('getBalance should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.getBalance())
        .rejects.toThrow("Method 'getBalance()' must be implemented.")
    })

    test('getTokenBalance should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.getTokenBalance('0xtoken'))
        .rejects.toThrow("Method 'getTokenBalance(tokenAddress)' must be implemented.")
    })

    test('getTransactionReceipt should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.getTransactionReceipt('0xhash'))
        .rejects.toThrow("Method 'getTransactionReceipt(hash)' must be implemented.")
    })

    test('quoteTransfer should throw if not implemented', async () => {
      const account = new IWalletAccount()

      await expect(account.quoteTransfer({}))
        .rejects.toThrow("Method 'quoteTransfer(options)' must be implemented.")
    })
  })
})
