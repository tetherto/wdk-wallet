/**
 * A minimal, cross-chain signer interface.
 *
 * @interface
 */
export class ISigner {
    /**
     * Derive a child signer using a relative path (e.g., "0'/0/0").
     *
     * @param {string} path - The relative derivation path.
     * @returns {Promise<ISigner>} The derived signer.
     * @throws {UnsupportedOperationError} If the signer does not support account derivation.
     * @throws {ValueError} If the path is not valid.
     */
    derive(path: string): Promise<ISigner>;
    /**
     * Returns the signer's address.
     *
     * @returns {Promise<string>} The address.
     */
    getAddress(): Promise<string>;
    /**
     * Disposes the signer and clears any secret material from memory.
     */
    dispose(): void;
}
export type UnsupportedOperationError = import("./errors.js").UnsupportedOperationError;
export type ValueError = import("./errors.js").ValueError;
