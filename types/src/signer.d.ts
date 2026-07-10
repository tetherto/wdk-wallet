/**
 * A minimal, cross-chain signer interface.
 *
 * @interface
 */
export class ISigner {
    /**
     * Whether the signer supports account derivation via {@link derive}.
     *
     * @type {boolean}
     */
    get isDerivable(): boolean;
    /**
     * The signer's key pair, or null if the signer does not allow retrieving
     * key material (e.g. hardware signers).
     *
     * @type {KeyPair | null}
     */
    get keyPair(): KeyPair | null;
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
export type KeyPair = import("./wallet-account.js").KeyPair;
export type SignerError = import("./errors.js").SignerError;
