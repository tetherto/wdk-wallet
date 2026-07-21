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
export function toTransportJson(value: unknown): unknown;
