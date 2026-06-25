// Copyright 2024 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict'

/**
 * Converts a byte array to a 0x-prefixed lowercase hex string.
 *
 * @param {Uint8Array} bytes - The byte array to encode.
 * @returns {string} The 0x-prefixed hex encoding.
 */
function bytesToHex (bytes) {
  let hex = '0x'
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, '0')
  }
  return hex
}

/**
 * Recursively converts a value into a JSON-safe form so it survives JSON.stringify: every BigInt
 * becomes its decimal string and every byte array (Uint8Array, including Buffer) becomes a
 * 0x-prefixed lowercase hex string. Arrays and plain objects are converted entry by entry; all
 * other values are returned unchanged.
 *
 * The conversion is one-way: there is no generic inverse, so a consumer that needs the original
 * types back restores them per field (it knows which fields are amounts, byte strings, etc.).
 *
 * @param {unknown} value - The value to convert (object, array, or primitive).
 * @returns {unknown} A JSON-safe copy of the value.
 */
export function toTransportJson (value) {
  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (value instanceof Uint8Array) {
    return bytesToHex(value)
  }

  if (Array.isArray(value)) {
    return value.map(toTransportJson)
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toTransportJson(entry)])
    )
  }

  return value
}
