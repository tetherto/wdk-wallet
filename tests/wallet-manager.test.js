import * as bip39 from 'bip39'

import { describe, expect, jest, test } from '@jest/globals'

import WalletManager from '../index.js'

class DummySigner {
  async derive (relPath) {
    return this
  }

  async signTransaction (tx) {
    return null
  }

  async getAddress () {
    return 'dummy-address'
  }

  dispose () {}
}

class DummyWalletManager extends WalletManager {
  async getAccount (index = 0) {
    return null
  }

  async getAccountByPath (path) {
    return null
  }

  async getFeeRates () {
    return {
      normal: 0n,
      fast: 0n
    }
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
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(signer)

      expect(wallet.getSigner()).toBe(signer)
    })

    test('should throw when requesting the default signer on a seed-based manager', () => {
      const wallet = new DummyWalletManager(SEED_PHRASE)

      expect(() => wallet.getSigner())
        .toThrow('No default signer registered.')
    })
    test('should store both transferMaxFee and transactionMaxFee in config', () => {
      const wallet = new DummyWalletManager(SEED_PHRASE, { transferMaxFee: 100, transactionMaxFee: 500 })

      expect(wallet._config.transferMaxFee).toBe(100)
      expect(wallet._config.transactionMaxFee).toBe(500)
    })
  })

  describe('static getRandomSeedPhrase', () => {
    test('should generate a valid 12-word seed phrase by default', () => {
      const seedPhrase = WalletManager.getRandomSeedPhrase()

      const words = seedPhrase.trim()
        .split(/\s+/)

      expect(words).toHaveLength(12)

      words.forEach(word => {
        expect(bip39.wordlists.EN.includes(word)).toBe(true)
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

  describe('addSigner', () => {
    test('should register a signer that can be retrieved by name', () => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(SEED_PHRASE)

      wallet.addSigner('ledger', signer)

      expect(wallet.getSigner('ledger')).toBe(signer)
    })

    test('should throw when the signer name is empty', () => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(SEED_PHRASE)

      expect(() => wallet.addSigner('', signer))
        .toThrow('Signer name is required.')
    })

    test('should throw when the signer name is blank', () => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(SEED_PHRASE)

      expect(() => wallet.addSigner('   ', signer))
        .toThrow('Signer name is required.')
    })

    test('should throw when the signer name is not a string', () => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(SEED_PHRASE)

      expect(() => wallet.addSigner(null, signer))
        .toThrow('Signer name is required.')
    })
  })

  describe('getSigner', () => {
    test('should throw when requesting an unknown signer name', () => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(signer)

      expect(() => wallet.getSigner('ledger'))
        .toThrow('No signer registered with name "ledger".')
    })
  })

  describe('dispose', () => {
    test('should delegate to WalletManager.dispose and clear signer maps', () => {
      const signer = new DummySigner()
      const disposeSpy = jest.spyOn(signer, 'dispose')
      const wallet = new DummyWalletManager(signer)

      expect(wallet.getSigner()).toBe(signer)

      wallet.dispose()

      expect(disposeSpy).toHaveBeenCalledTimes(1)
      expect(() => wallet.getSigner())
        .toThrow('No default signer registered.')
    })
  })
})
