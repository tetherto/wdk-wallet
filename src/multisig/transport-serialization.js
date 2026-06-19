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
 * Recursively converts a transport payload into a JSON-safe value by turning every BigInt into
 * its decimal string form, so the payload survives JSON.stringify.
 *
 * Transports that serialize the proposal/message themselves (rather than delegating to an SDK
 * that handles it) can use this instead of reimplementing the conversion. Non-JSON-native values
 * other than BigInt (e.g. byte arrays) should be normalized by the transport for its chain's
 * encoding before calling this.
 *
 * @param {unknown} value - The value to convert (object, array, or primitive).
 * @returns {unknown} A JSON-safe copy with every BigInt converted to a decimal string.
 */
export function toTransportJson (value) {
  if (typeof value === 'bigint') {
    return value.toString()
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
