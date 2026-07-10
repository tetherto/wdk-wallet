/** @abstract */
export default abstract class WalletManager {
    /**
     * Returns a random [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrase.
     *
     * @param {12 | 24} [wordCount=12] - The number of words in the seed phrase.
     * @returns {string} The seed phrase.
     */
    static getRandomSeedPhrase(wordCount?: 12 | 24): string;
    /**
     * Checks if a seed phrase is valid.
     *
     * @param {string} seedPhrase - The seed phrase.
     * @returns {boolean} True if the seed phrase is valid.
     */
    static isValidSeedPhrase(seedPhrase: string): boolean;
    /**
     * Creates a new wallet manager from a BIP-39 seed.
     *
     * @param {string | Uint8Array} seed - The BIP-39 seed phrase or raw seed bytes.
     * @param {WalletConfig} [config] - The wallet configuration.
     * @throws {Error} If the seed phrase is invalid.
     */
    constructor(seed: string | Uint8Array, config?: WalletConfig);
    /**
     * Creates a new wallet manager from a default signer.
     *
     * @param {ISigner} signer - The default signer.
     * @param {WalletConfig} [config] - The wallet configuration.
     * @throws {SignerError} If the default signer does not support account derivation.
     */
    constructor(signer: ISigner, config?: WalletConfig);
    /** @private */
    private _seed: Uint8Array | undefined;
    /**
     * The default signer provided at construction. Accessed via {@link getSigner}
     * with no arguments.
     *
     * @protected
     * @type {ISigner | undefined}
     */
    protected _defaultSigner: ISigner | undefined;
    /**
     * A map between signer names and signers added via {@link addSigner}.
     *
     * @protected
     * @type {Record<string, ISigner>}
     */
    protected _signers: Record<string, ISigner>;
    /**
     * A map between derivation paths and wallet accounts. The {@link dispose} method will automatically dispose
     * all the accounts in this map, so developers are encouraged to map all accounts accessed through the
     * {@link getAccount} and {@link getAccountByPath} methods.
     *
     * @protected
     * @type {Record<string, IWalletAccount>}
     */
    protected _accounts: Record<string, IWalletAccount>;
    /**
     * The wallet configuration.
     *
     * @protected
     * @type {WalletConfig}
     */
    protected _config: WalletConfig;
    /**
     * The seed of the wallet.
     *
     * @type {Uint8Array | undefined}
     */
    get seed(): Uint8Array | undefined;
    /**
     * Registers a signer under the given name.
     *
     * @param {string} signerName - The signer name.
     * @param {ISigner} signer - The signer.
     * @returns {WalletManager} The wallet manager.
     * @throws {Error} If `signerName` is an empty or blank string.
     */
    addSigner(signerName: string, signer: ISigner): WalletManager;
    /**
     * Returns a signer. With no arguments, returns the default signer provided
     * at construction. With a name, returns the signer registered under that
     * name via {@link addSigner}.
     *
     * @param {string} [signerName] - The signer name. Omit to get the default.
     * @returns {ISigner} The signer.
     * @throws {Error} If called with no arguments and no default signer was
     * provided at construction, or if called with a name that is not registered.
     */
    getSigner(signerName?: string): ISigner;
    /**
     * Returns a shallow copy of the map of signers registered via {@link addSigner}.
     * The default signer is not included; use {@link getSigner} with no arguments
     * to retrieve it.
     *
     * @returns {Record<string, ISigner>} A map of signer names to signers. Empty if no signers have been registered.
     */
    getSigners(): Record<string, ISigner>;
    /**
     * Returns the wallet account at a specific index (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
     *
     * @param {number} [index] - The index of the account to get (default: 0).
     * @param {Object} [options] - Account options.
     * @param {string} [options.signerName] - The signer name. Omit to use the default signer.
     * @returns {Promise<IWalletAccount>} The account.
     * @throws {Error} If a signer name is given but no signer exists with that name.
     * @throws {SignerError} If the signer doesn't support account derivation.
     */
    abstract getAccount(
        index?: number,
        options?: {
            signerName?: string;
        },
    ): Promise<IWalletAccount>;
    /**
     * Returns the wallet account associated with a registered signer. For
     * non-derivable signers (e.g., private-key signers), returns the signer's
     * single account. For derivable signers, returns the wallet account at the
     * signer's root, with no further derivation.
     *
     * @param {string} signerName - The signer name registered via {@link addSigner}.
     * @returns {Promise<IWalletAccount>} The account.
     * @throws {Error} If no signer exists with the given name.
     */
    abstract getAccount(signerName: string): Promise<IWalletAccount>;
    /**
     * Returns the wallet account at a specific [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) derivation path.
     *
     * @abstract
     * @param {string} path - The derivation path (e.g. "0'/0/0").
     * @param {Object} [options] - Account options.
     * @param {string} [options.signerName] - The signer name. Omit to use the default signer.
     * @returns {Promise<IWalletAccount>} The account.
     * @throws {Error} If a signer name is given but no signer exists with that name.
     * @throws {SignerError} If the signer doesn't support account derivation.
     */
    abstract getAccountByPath(
        path: string,
        options?: {
            signerName?: string;
        },
    ): Promise<IWalletAccount>;
    /**
     * Returns the current fee rates.
     *
     * @abstract
     * @returns {Promise<FeeRates>} The fee rates (in base unit).
     */
    abstract getFeeRates(): Promise<FeeRates>;
    /**
     * Disposes all wallet accounts and signers, clearing secret material from memory.
     */
    dispose(): void;
}
export type IWalletAccount = import("./wallet-account.js").IWalletAccount;
export type ISigner = import("./signer.js").ISigner;
export type SignerError = import("./errors.js").SignerError;
export type WalletConfig = {
    /**
     * - The maximum fee amount for transfer operations.
     */
    transferMaxFee?: number | bigint;
    /**
     * - The maximum fee amount for sendTransaction and signTransaction operations.
     */
    transactionMaxFee?: number | bigint;
};
export type FeeRates = {
    /**
     * - The fee rate for transaction sent with normal priority.
     */
    normal: bigint;
    /**
     * - The fee rate for transaction sent with fast priority.
     */
    fast: bigint;
};
