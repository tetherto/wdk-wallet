/**
 * A minimal, cross-chain signer interface. Chain-specific signers can extend
 * this contract with additional capabilities (e.g., signTransaction, signPsbt),
 * which are intentionally kept out of the base to remain chain-agnostic.
 *
 * @interface
 */
export class ISigner {
    /**
     * Derive a child signer using a relative path (e.g., "0'/0/0").
     *
     * @param {string} relPath - The relative derivation path.
     * @param {unknown} [config] - Optional chain-specific configuration.
     * @returns {Promise<ISigner>} The derived signer.
     */
    derive(relPath: string, config?: unknown): Promise<ISigner>;
    /**
     * Returns the signer's address.
     *
     * @returns {Promise<string>} The address.
     */
    getAddress(): Promise<string>;
    /**
     * Disposes the signer and clears any secret material from memory.
     * Implementations should be idempotent (safe to call more than once).
     */
    dispose(): void;
}
