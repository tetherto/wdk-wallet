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
export function toTransportJson(value: unknown): unknown;
