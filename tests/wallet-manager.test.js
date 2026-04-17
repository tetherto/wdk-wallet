import * as bip39 from 'bip39'

import { describe, expect, test } from '@jest/globals'

import WalletManager from '../index.js'

class DummyWalletManager extends WalletManager {
  async getAccount (index = 0) {
    return null
  }

  async getAccountByPath (path) {
    return null
  }

  async getFeeRates () {
    return {
      normal: 0,
      fast: 0
    }
  }

  dispose () {

  }
}

const SEED_PHRASE = 'cook voyage document eight skate token alien guide drink uncle term abuse'

const INVALID_SEED_PHRASE = 'invalid seed phrase'

const SEED = bip39.mnemonicToSeedSync(SEED_PHRASE)

describe('WalletManager', () => {
  describe('constructor', () => {
    test('should successfully initialize a wallet manager for the given seed phrase', () => {
      const wallet = new DummyWalletManager(SEED_PHRASE)

      expect(wallet.seed).toEqual(SEED)
    })

    test('should successfully initialize a wallet manager for the given seed', () => {
      const wallet = new DummyWalletManager(SEED)

      expect(wallet.seed).toEqual(SEED)
    })

    test('should throw if the seed phrase is invalid', () => {
      // eslint-disable-next-line no-new
      expect(() => { new DummyWalletManager(INVALID_SEED_PHRASE) })
        .toThrow('The seed phrase is invalid.')
    })

    test('should set the provided signer as the default signer', () => {
      const signer = { name: 'dummy-signer' }
      const wallet = new DummyWalletManager(signer)

      expect(wallet.getSigner('default')).toBe(signer)
    })
  })

  describe('static getRandomSeedPhrase', () => {
    test('should generate a valid 12-word seed phrase by default', () => {
      const seedPhrase = WalletManager.getRandomSeedPhrase()

      const words = seedPhrase.trim()
        .split(/\s+/)

      expect(words).toHaveLength(12)

      words.forEach(word => {
        expect(bip39.wordlists.EN.includes(word))
          .not.toBe(-1)
      })
    })

    test('should generate a valid 12-word seed phrase', () => {
      const seedPhrase = WalletManager.getRandomSeedPhrase(12)
      const words = seedPhrase.trim().split(/\s+/)

      expect(words).toHaveLength(12)
      expect(WalletManager.isValidSeedPhrase(seedPhrase)).toBe(true)
    })

    test('should generate a valid 24-word seed phrase', () => {
      const seedPhrase = WalletManager.getRandomSeedPhrase(24)
      const words = seedPhrase.trim().split(/\s+/)

      expect(words).toHaveLength(24)
      expect(WalletManager.isValidSeedPhrase(seedPhrase)).toBe(true)
    })
  })

  describe('static isValidSeedPhrase', () => {
    test('should return true for a valid seed phrase', () => {
      expect(WalletManager.isValidSeedPhrase(SEED_PHRASE))
        .toBe(true)
    })

    test('should return false for an invalid seed phrase', () => {
      expect(WalletManager.isValidSeedPhrase(INVALID_SEED_PHRASE))
        .toBe(false)
    })

    test('should return false for an empty string', () => {
      expect(WalletManager.isValidSeedPhrase(''))
        .toBe(false)
    })
  })

  describe('getSigner', () => {
    test('should return the default signer when only default signer exists', () => {
      const signer = { name: 'default-signer' }
      const wallet = new DummyWalletManager(signer)

      expect(wallet.getSigner('default')).toBe(signer)
    })
  })
})
