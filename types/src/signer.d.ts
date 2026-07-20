/**
 * A minimal, cross-chain signer interface.
 *
 * @interface
 */
export class ISigner {
    /**
     * Derive a child signer using a relative path (e.g., "0'/0/0").
     *
     * @param {string} relPath - The relative derivation path.
     * @returns {Promise<ISigner>} The derived signer.
     * @throws {SignerError} If the signer does not support derivation.
     */
    derive(relPath: string): Promise<ISigner>;
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
export type SignerError = import("./errors.js").SignerError;
