/**
 * A minimal, cross-chain signer interface.
 *
 * @interface
 */
export class ISigner extends IDisposable {
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
     * The BIP 0044 derivation path.
     *
     * @type {string | null}
     */
    get path(): string | null;
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
     * Signs a message.
     *
     * @param {string} message - The message to sign.
     * @returns {Promise<string>} The message's signature.
     */
    sign(message: string): Promise<string>;
}
export type KeyPair = import("./wallet-account.js").KeyPair;
import { IDisposable } from "./disposable.js";
export type UnsupportedOperationError = import("./errors.js").UnsupportedOperationError;
export type ValueError = import("./errors.js").ValueError;
