import { describe, expect, test } from '@jest/globals'

import { WalletIndexerClient } from '../index.js'

const ADDRESS = '0xa460AEbce0d3A4BecAd8ccf9D6D4861296c503Bd'

class DummyWalletIndexerClient extends WalletIndexerClient {
  async getPortfolio (address) {
    return {
      address,
      currency: 'usd',
      totalValue: 0,
      change24hAbsolute: 0,
      change24hPercent: 0,
      walletValue: 0,
      depositedValue: 0,
      stakedValue: 0,
      borrowedValue: 0,
      byChain: []
    }
  }
}

class EmptyWalletIndexerClient extends WalletIndexerClient {}

describe('WalletIndexerClient', () => {
  describe('getPortfolio', () => {
    test('should return the portfolio summary from the implementation', async () => {
      const client = new DummyWalletIndexerClient()
      const portfolio = await client.getPortfolio(ADDRESS)
      expect(portfolio.address).toBe(ADDRESS)
      expect(portfolio.currency).toBe('usd')
      expect(portfolio.byChain).toEqual([])
    })

    test('should throw NotImplementedError if not implemented', async () => {
      const client = new EmptyWalletIndexerClient()
      await expect(client.getPortfolio(ADDRESS))
        .rejects.toThrow("Method 'getPortfolio(address)' must be implemented.")
    })
  })

  describe('getPositions', () => {
    test('should throw NotImplementedError if not implemented', async () => {
      const client = new EmptyWalletIndexerClient()
      await expect(client.getPositions(ADDRESS))
        .rejects.toThrow("Method 'getPositions(address, options)' must be implemented.")
    })
  })

  describe('getTransactions', () => {
    test('should throw NotImplementedError if not implemented', async () => {
      const client = new EmptyWalletIndexerClient()
      await expect(client.getTransactions(ADDRESS))
        .rejects.toThrow("Method 'getTransactions(address, options)' must be implemented.")
    })
  })

  describe('getNfts', () => {
    test('should throw NotImplementedError if not implemented', async () => {
      const client = new EmptyWalletIndexerClient()
      await expect(client.getNfts(ADDRESS))
        .rejects.toThrow("Method 'getNfts(address, options)' must be implemented.")
    })
  })

  describe('getPnl', () => {
    test('should throw NotImplementedError if not implemented', async () => {
      const client = new EmptyWalletIndexerClient()
      await expect(client.getPnl(ADDRESS))
        .rejects.toThrow("Method 'getPnl(address)' must be implemented.")
    })
  })
})
