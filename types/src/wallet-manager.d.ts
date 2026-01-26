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
     * Creates a new wallet manager.
     *
     * @param {string | Uint8Array} seed - The wallet's [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrase.
     * @param {WalletConfig} [config] - The wallet configuration.
     */
    constructor(seed: string | Uint8Array, config?: WalletConfig);
    /** @private */
    private _seed;
    /**
     * The wallet configuration.
     *
     * @protected
     * @type {WalletConfig}
     */
    protected _config: WalletConfig;
    /**
     * A map between derivation paths and wallet accounts. The {@link dispose} method will automatically dispose
     * all the accounts in this map, so developers are encouraged to map all accounts accessed through the
     * {@link getAccount} and {@link getAccountByPath} methods.
     *
     * @protected
     * @type {{ [path: string]: IWalletAccount }}
     */
    protected _accounts: { [path: string]: IWalletAccount };
    /**
     * The seed phrase of the wallet.
     *
     * @type {Uint8Array}
     */
    get seed(): Uint8Array;
    /**
     * Returns the wallet account at a specific index (see [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)).
     *
     * @abstract
     * @param {number} [index] - The index of the account to get (default: 0).
     * @returns {Promise<IWalletAccount>} The account.
     */
    abstract getAccount(index?: number): Promise<IWalletAccount>;
    /**
     * Returns the wallet account at a specific [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) derivation path.
     *
     * @abstract
     * @param {string} path - The derivation path (e.g. "0'/0/0").
     * @returns {Promise<IWalletAccount>} The account.
     */
    abstract getAccountByPath(path: string): Promise<IWalletAccount>;
    /**
     * Returns the current fee rates.
     *
     * @abstract
     * @returns {Promise<FeeRates>} The fee rates (in base unit).
     */
    abstract getFeeRates(): Promise<FeeRates>;
    /**
     * Disposes all the wallet accounts, erasing their private keys from the memory.
     */
    dispose(): void;
}
export type IWalletAccount = import("./wallet-account.js").IWalletAccount;
export type WalletConfig = {
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
