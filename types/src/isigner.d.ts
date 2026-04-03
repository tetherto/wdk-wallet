/** @typedef {import('./wallet-manager.js').WalletConfig} WalletConfig */
/**
 * A minimal, cross-chain signer interface.
 *
 * Only the universally-required surface is enforced here:
 *  - derive: create a child signer from a relative derivation path
 *  - getAddress: return the public address for this signer
 *  - dispose: clear any secret material from memory
 *
 * Chain-specific signers (EVM, BTC, Tron, Solana, etc.) can extend this
 * contract with additional capabilities (e.g., signTransaction, signTypedData,
 * signPsbt), but those are intentionally not included here to keep the base
 * interface chain-agnostic.
 *
 * Common optional fields/methods implementers may provide:
 *  - index: number | undefined
 *  - path: string | undefined
 *  - address: string | undefined
 *
 * @interface
 */
export class ISigner {
    /**
     * Derive a child signer using a relative path.
     *
     * Example formats (chain-dependent):
     *  - BIP-32/BIP-44 relative paths like "0'/0/0"
     *  - Implementation-specific segmenting, as applicable
     *
     * @param {string} relPath - The relative derivation path.
     * @param {WalletConfig} [cfg] - Optional chain-specific configuration.
     * @returns {ISigner} The derived signer.
     */
    derive(relPath: string, cfg?: WalletConfig): ISigner;
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
export type WalletConfig = import("./wallet-manager.js").WalletConfig;
