import * as bip39 from 'bip39'

import { describe, expect, jest, test } from '@jest/globals'

import WalletManager, { DisposalError, InvalidSignerError, NoSuchElementError, ValueError } from '../index.js'

class DummySigner {
  get isDerivable () {
    return true
  }

  async derive (relPath) {
    return this
  }

  async getAddress () {
    return 'dummy-address'
  }

  dispose () {}
}

class NonDerivableSigner extends DummySigner {
  get isDerivable () {
    return false
  }
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
        .toThrow(new ValueError('Invalid seed phrase.'))
    })

    test('should set the provided signer as the default signer', () => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(signer)

      expect(wallet.getSigner()).toBe(signer)
    })

    test('should throw if the default signer is not derivable', () => {
      // eslint-disable-next-line no-new
      expect(() => { new DummyWalletManager(new NonDerivableSigner()) })
        .toThrow(new InvalidSignerError('The default signer must be derivable. Non-derivable signers (e.g. private-key signers) can only be registered by name via addSigner.'))
    })

    test('should throw when requesting the default signer on a seed-based manager', () => {
      const wallet = new DummyWalletManager(SEED_PHRASE)

      expect(() => wallet.getSigner())
        .toThrow(new NoSuchElementError('No default signer set.'))
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
        .toThrow(new ValueError('The signer name cannot be an empty or blank string.'))
    })

    test('should throw when the signer name is blank', () => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(SEED_PHRASE)

      expect(() => wallet.addSigner('   ', signer))
        .toThrow(new ValueError('The signer name cannot be an empty or blank string.'))
    })

    test('should throw when the wallet manager has been disposed', () => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(SEED_PHRASE)

      wallet.dispose()

      expect(() => wallet.addSigner('ledger', signer))
        .toThrow(new DisposalError('The wallet manager has been disposed.'))
    })

    test.each(['constructor', 'toString', '__proto__'])('should register a signer named "%s"', (signerName) => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(SEED_PHRASE)

      wallet.addSigner(signerName, signer)

      expect(wallet.getSigner(signerName)).toBe(signer)

      const signers = wallet.getSigners()

      expect(Object.keys(signers)).toEqual([signerName])
      expect(Object.hasOwn(signers, signerName)).toBe(true)
      expect(signers[signerName]).toBe(signer)
    })
  })

  describe('getSigner', () => {
    test('should throw when requesting an unknown signer name', () => {
      const signer = new DummySigner()
      const wallet = new DummyWalletManager(signer)

      expect(() => wallet.getSigner('ledger'))
        .toThrow(new NoSuchElementError('No signer found with name "ledger".'))
    })

    test.each(['constructor', 'toString', 'hasOwnProperty', '__proto__'])('should throw when requesting an unregistered signer named "%s"', (signerName) => {
      const wallet = new DummyWalletManager(new DummySigner())

      expect(() => wallet.getSigner(signerName))
        .toThrow(new NoSuchElementError(`No signer found with name "${signerName}".`))
    })
  })

  describe('getSigners', () => {
    test('should return an empty map when no signers have been registered', () => {
      const wallet = new DummyWalletManager(new DummySigner())

      expect(wallet.getSigners()).toEqual({})
    })
  })

  describe('dispose', () => {
    test('should expose the disposed state', () => {
      const wallet = new DummyWalletManager(new DummySigner())

      expect(wallet.disposed).toBe(false)

      wallet.dispose()

      expect(wallet.disposed).toBe(true)
    })

    test('should keep the account map free of inherited properties after disposal', () => {
      const wallet = new DummyWalletManager(new DummySigner())

      expect(wallet._accounts.constructor).toBeUndefined()

      wallet.dispose()

      expect(wallet._accounts.constructor).toBeUndefined()
      expect(Object.keys(wallet._accounts)).toEqual([])
    })
  })
})
