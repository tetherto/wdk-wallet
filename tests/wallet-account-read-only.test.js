import { describe, expect, test } from '@jest/globals'

import { AssertionError, WalletAccountReadOnly } from '../index.js'

class DummyWalletAccountReadOnly extends WalletAccountReadOnly {
  async getBalance () {
    return 0
  }

  async getTokenBalance () {
    return 0
  }

  async quoteSendTransaction (tx) {
    return { fee: 0 }
  }

  async quoteTransfer (options) {
    return { fee: 0 }
  }

  async getTransactionReceipt (hash) {
    return null
  }
}

const ADDRESS = '0xa460AEbce0d3A4BecAd8ccf9D6D4861296c503Bd'

describe('WalletAccountReadOnly', () => {
  describe('getAddress', () => {
    test('should return the correct address', async () => {
      const account = new DummyWalletAccountReadOnly(ADDRESS)
      const address = await account.getAddress()
      expect(address).toBe(ADDRESS)
    })

    test('should throw if the address is not set', async () => {
      const account = new DummyWalletAccountReadOnly()

      await expect(account.getAddress())
        .rejects.toThrow(new AssertionError("The account's address must be set to perform this operation."))
    })
  })
})
