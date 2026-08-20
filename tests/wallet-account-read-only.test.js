import { describe, expect, test } from '@jest/globals'

import { AssertionError, FINALITY, TimeoutError, NoSuchElementError, WalletAccountReadOnly } from '../index.js'

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

/**
 * A dummy account whose getTransaction returns a scripted sequence of receipts,
 * so the shared waitForTransaction loop can be exercised deterministically.
 */
class ScriptedWalletAccountReadOnly extends DummyWalletAccountReadOnly {
  constructor (sequence) {
    super(ADDRESS)
    this._sequence = sequence
    this.calls = 0
  }

  async getTransaction (hash) {
    const item = this._sequence[Math.min(this.calls, this._sequence.length - 1)]
    this.calls += 1
    if (item === null) {
      throw new NoSuchElementError(`No transaction found for '${hash}'.`)
    }
    return item
  }

  get defaultWaitInterval () {
    return 1
  }

  get defaultWaitTimeout () {
    return 50
  }
}

const ADDRESS = '0xa460AEbce0d3A4BecAd8ccf9D6D4861296c503Bd'
const HASH = '0xabc'

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

  describe('FINALITY', () => {
    test('orders finalities so stronger settlement compares higher', () => {
      expect(FINALITY.pending).toBeLessThan(FINALITY.confirmed)
      expect(FINALITY.confirmed).toBeLessThan(FINALITY.final)
    })
  })

  describe('waitForTransaction', () => {
    test('resolves once the confirmed target is reached', async () => {
      const confirmed = { hash: HASH, finality: 'confirmed', success: true }
      const account = new ScriptedWalletAccountReadOnly([
        null,
        { hash: HASH, finality: 'pending', success: undefined },
        confirmed
      ])

      const receipt = await account.waitForTransaction(HASH)
      expect(receipt).toBe(confirmed)
      expect(account.calls).toBe(3)
    })

    test("keeps polling past 'confirmed' when target is 'final'", async () => {
      const final = { hash: HASH, finality: 'final', success: true }
      const account = new ScriptedWalletAccountReadOnly([
        { hash: HASH, finality: 'confirmed', success: true },
        final
      ])

      const receipt = await account.waitForTransaction(HASH, { target: 'final' })
      expect(receipt).toBe(final)
    })

    test('returns the receipt when the transaction reverts, without throwing', async () => {
      const failed = { hash: HASH, finality: 'final', success: false }
      const account = new ScriptedWalletAccountReadOnly([failed])

      const receipt = await account.waitForTransaction(HASH)
      expect(receipt).toBe(failed)
    })

    test('returns the receipt when the transaction is dropped on consecutive polls', async () => {
      const dropped = { hash: HASH, finality: 'dropped', success: undefined }
      const account = new ScriptedWalletAccountReadOnly([dropped])

      const receipt = await account.waitForTransaction(HASH)
      expect(receipt).toBe(dropped)
    })

    test('debounces a transient drop that recovers to confirmed', async () => {
      const confirmed = { hash: HASH, finality: 'confirmed', success: true }
      const account = new ScriptedWalletAccountReadOnly([
        { hash: HASH, finality: 'dropped', success: undefined },
        confirmed
      ])

      const receipt = await account.waitForTransaction(HASH)
      expect(receipt).toBe(confirmed)
      expect(account.calls).toBe(2)
    })

    test('throws TimeoutError when the target is not reached in time', async () => {
      const pending = { hash: HASH, finality: 'pending', success: undefined }
      const account = new ScriptedWalletAccountReadOnly([pending])

      await expect(account.waitForTransaction(HASH, { timeout: 10, interval: 1 }))
        .rejects.toThrow(TimeoutError)
    })

    test('throws TimeoutError when the transaction is never seen', async () => {
      const account = new ScriptedWalletAccountReadOnly([null])

      await expect(account.waitForTransaction(HASH, { timeout: 10, interval: 1 }))
        .rejects.toThrow(TimeoutError)
    })
  })
})
