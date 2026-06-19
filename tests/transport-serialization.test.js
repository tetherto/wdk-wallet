import { describe, expect, test } from '@jest/globals'

import { toTransportJson } from '../src/multisig/index.js'

describe('toTransportJson', () => {
  test('converts a top-level BigInt to its decimal string', () => {
    expect(toTransportJson(10n)).toBe('10')
  })

  test('converts nested BigInts inside objects and arrays', () => {
    const payload = {
      maxFeePerGas: 1000000000n,
      nested: { callGasLimit: 50000n },
      values: [1n, 2n, { preVerificationGas: 21000n }]
    }

    expect(toTransportJson(payload)).toEqual({
      maxFeePerGas: '1000000000',
      nested: { callGasLimit: '50000' },
      values: ['1', '2', { preVerificationGas: '21000' }]
    })
  })

  test('leaves JSON-native values untouched', () => {
    const payload = { to: '0xabc', value: 0, ok: true, missing: null }

    expect(toTransportJson(payload)).toEqual(payload)
  })

  test('produces output that survives JSON.stringify', () => {
    expect(JSON.stringify(toTransportJson({ gas: 42n }))).toBe('{"gas":"42"}')
  })

  test('does not mutate the input object', () => {
    const payload = { gas: 7n }

    toTransportJson(payload)

    expect(payload.gas).toBe(7n)
  })
})
