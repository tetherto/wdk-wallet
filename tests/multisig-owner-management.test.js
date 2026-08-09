import { describe, expect, test } from '@jest/globals'

import { IMultisigOwnerManagement } from '../src/multisig/index.js'

describe('IMultisigOwnerManagement', () => {
  describe('addOwner', () => {
    test('should throw if not implemented', async () => {
      const management = new IMultisigOwnerManagement()

      await expect(management.addOwner('0xowner'))
        .rejects.toThrow("Method 'addOwner(owner, options)' must be implemented.")
    })
  })

  describe('removeOwner', () => {
    test('should throw if not implemented', async () => {
      const management = new IMultisigOwnerManagement()

      await expect(management.removeOwner('0xowner'))
        .rejects.toThrow("Method 'removeOwner(owner, options)' must be implemented.")
    })
  })

  describe('swapOwner', () => {
    test('should throw if not implemented', async () => {
      const management = new IMultisigOwnerManagement()

      await expect(management.swapOwner('0xold', '0xnew'))
        .rejects.toThrow("Method 'swapOwner(oldOwner, newOwner)' must be implemented.")
    })
  })

  describe('changeThreshold', () => {
    test('should throw if not implemented', async () => {
      const management = new IMultisigOwnerManagement()

      await expect(management.changeThreshold(2))
        .rejects.toThrow("Method 'changeThreshold(newThreshold)' must be implemented.")
    })
  })
})
