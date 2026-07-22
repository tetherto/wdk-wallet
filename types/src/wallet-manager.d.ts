/** @abstract */
export default abstract class WalletManager {
    /**
     * Returns a random [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrase.
     *
     * @param {12 | 24} [wordCount] - The number of words in the seed phrase (default: 12).
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
     * @overload
     * @param {string | Uint8Array} seed - The BIP-39 seed phrase or raw seed bytes.
     * @param {WalletConfig} [config] - The wallet configuration.
     * @throws {ValueError} If the seed is not a valid seed or BIP-39 seed phrase.
     */
    constructor(seed: string | Uint8Array, config?: WalletConfig);
    /**
     * Creates a new wallet manager from a default signer.
     *
     * @overload
     * @param {ISigner} signer - The default signer.
     * @param {WalletConfig} [config] - The wallet configuration.
     * @throws {InvalidSignerError} If the given signer doesn't support account derivation.
     */
    constructor(signer: ISigner, config?: WalletConfig);
    /** @private */
    private _seed;
    /**
     * The default signer.
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
     * Registers a signer with the given name.
     *
     * @param {string} signerName - The signer name.
     * @param {ISigner} signer - The signer.
     * @returns {WalletManager} The wallet manager.
     * @throws {ValueError} If the signer name is an empty or blank string.
     */
    addSigner(signerName: string, signer: ISigner): WalletManager;
    /**
     * Returns the default signer, or the signer with the given name.
     *
     * @param {string} [signerName] - If set, returns the signer with the given name.
     * @returns {ISigner} The signer.
     * @throws {NoSuchElementError} If the default signer is not set, or no signers are found for the given name.
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
     * @overload
     * @param {number} [index] - The index of the account to get (default: 0).
     * @param {Object} [options] - Account options.
     * @param {string} [options.signerName] - The signer name.
     * @returns {Promise<IWalletAccount>} The account.
     * @throws {ValueError} If the index is not valid.
     * @throws {NoSuchElementError} If a signer name is given but no signer exists with that name.
     * @throws {InvalidSignerError} If the signer doesn't support account derivation.
     */
    abstract getAccount(index?: number, options?: {
        signerName?: string;
    }): Promise<IWalletAccount>;
    /**
     * Returns the wallet account associated with a registered signer. For
     * non-derivable signers (e.g., private-key signers), returns the signer's
     * single account. For derivable signers, returns the wallet account at the
     * signer's root, with no further derivation.
     *
     * @overload
     * @param {string} signerName - The signer name registered via {@link addSigner}.
     * @returns {Promise<IWalletAccount>} The account.
     * @throws {NoSuchElementError} If no signer exists with the given name.
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
     * @throws {ValueError} If the path is not valid.
     * @throws {NoSuchElementError} If a signer name is given but no signer exists with that name.
     * @throws {InvalidSignerError} If the signer doesn't support account derivation.
     */
    abstract getAccountByPath(path: string, options?: {
        signerName?: string;
    }): Promise<IWalletAccount>;
    /**
     * Returns the current fee rates.
     *
     * @abstract
     * @returns {Promise<FeeRates>} The fee rates (in base unit).
     * @throws {ProviderRequiredError} If the method requires a provider and none is set.
     * @throws {ProviderError} If the provider fails to fetch fee rates.
     */
    abstract getFeeRates(): Promise<FeeRates>;
    /**
     * Disposes all wallet accounts and signers, clearing secret material from memory.
     */
    dispose(): void;
}
export type IWalletAccount = import("./wallet-account.js").IWalletAccount;
export type ISigner = import("./signer.js").ISigner;
export type InvalidSignerError = import("./errors.js").InvalidSignerError;
export type ProviderError = import("./errors.js").ProviderError;
export type ProviderRequiredError = import("./errors.js").ProviderRequiredError;
export type WalletConfig = {
    /**
     * - The maximum fee amount for sending transactions.
     */
    transactionMaxFee?: number | bigint;
    /**
     * - The maximum fee amount for transfer operations.
     */
    transferMaxFee?: number | bigint;
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
