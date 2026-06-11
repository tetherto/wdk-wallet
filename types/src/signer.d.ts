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
     * @throws {Error} If the signer does not support derivation.
     */
    derive(relPath: string): Promise<ISigner>;
    /**
     * Signs a transaction. Concrete signers narrow `tx` to their chain-specific shape.
     *
     * @param {unknown} tx - The transaction to sign.
     * @returns {Promise<unknown>} The signed transaction.
     */
    signTransaction(tx: unknown): Promise<unknown>;
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
