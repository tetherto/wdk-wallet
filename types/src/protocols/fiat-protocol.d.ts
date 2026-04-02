/**
 * @interface
 */
export interface IFiatProtocol {
    /**
     * Gets a quote for a crypto asset purchase.
     * @param {Omit<BuyOptions, 'recipient'>} options - The options for the buy operation.
     * @returns {Promise<FiatQuote>} A quote for the transaction.
     */
    quoteBuy(options: Omit<BuyOptions, "recipient">): Promise<FiatQuote>;
    /**
     * Generates a widget URL for a user to purchase a crypto asset with fiat currency.
     * @param {BuyOptions} options - The options for the buy operation.
     * @returns {Promise<BuyResult>} The operation's result.
     */
    buy(options: BuyOptions): Promise<BuyResult>;
    /**
     * Gets a quote for a crypto asset sale.
     * @param {Omit<SellOptions, 'refundAddress'>} options - The options for the sell operation.
     * @returns {Promise<FiatQuote>} A quote for the transaction.
     */
    quoteSell(options: Omit<SellOptions, "refundAddress">): Promise<FiatQuote>;
    /**
     * Generates a widget URL for a user to sell a crypto asset for fiat currency.
     * @param {SellOptions} options - The options for the sell operation.
     * @returns {Promise<SellResult>} The operation's result.
     */
    sell(options: SellOptions): Promise<SellResult>;
    /**
     * Retrieves the details of a specific transaction from the provider.
     * @param {string} txId - The unique identifier of the transaction.
     * @returns {Promise<FiatTransactionDetail>} The transaction details.
     */
    getTransactionDetail(txId: string): Promise<FiatTransactionDetail>;
    /**
     * Retrieves a list of supported crypto assets from the provider.
     * @returns {Promise<SupportedCryptoAsset[]>} An array of supported crypto assets.
     */
    getSupportedCryptoAssets(): Promise<SupportedCryptoAsset[]>;
    /**
     * Retrieves a list of supported fiat currencies from the provider.
     * @returns {Promise<SupportedFiatCurrency[]>} An array of supported fiat currencies.
     */
    getSupportedFiatCurrencies(): Promise<SupportedFiatCurrency[]>;
    /**
     * Retrieves a list of supported countries from the provider.
     * @returns {Promise<SupportedCountry[]>} An array of supported countries.
     */
    getSupportedCountries(): Promise<SupportedCountry[]>;
}
/**
 * @abstract
 * @implements {IFiatProtocol}
 */
export default abstract class FiatProtocol implements IFiatProtocol {
    /**
     * Creates a new fiat protocol with read-only account.
     *
     * @overload
     * @param {IWalletAccountReadOnly} [account] - The wallet account to use to interact with the protocol.
     */
    constructor(account?: IWalletAccountReadOnly);
    /**
     * Creates a new fiat protocol with read-only account.
     *
     * @overload
     * @param {IWalletAccount} [account] - The wallet account to use to interact with the protocol.
     */
    constructor(account?: IWalletAccount);
    /**
     * The wallet account to use to interact with the protocol.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount | undefined}
     */
    protected _account: IWalletAccountReadOnly | IWalletAccount | undefined;
    /**
     * Gets a quote for a crypto asset purchase.
     * @abstract
     * @param {Omit<BuyOptions, 'recipient'>} options - The options for the buy operation.
     * @returns {Promise<FiatQuote>} A quote for the transaction.
     */
    abstract quoteBuy(options: Omit<BuyOptions, "recipient">): Promise<FiatQuote>;
    /**
     * Generates a URL for a user to purchase a crypto asset with fiat currency.
     * @abstract
     * @param {BuyOptions} options - The options for the buy operation.
     * @returns {Promise<BuyResult>} The URL for the user to complete the purchase.
     */
    abstract buy(options: BuyOptions): Promise<BuyResult>;
    /**
     * Gets a quote for a crypto asset sale.
     * @abstract
     * @param {Omit<SellOptions, 'refundAddress'>} options - The options for the sell operation.
     * @returns {Promise<FiatQuote>} A quote for the transaction.
     */
    abstract quoteSell(options: Omit<SellOptions, "refundAddress">): Promise<FiatQuote>;
    /**
     * Generates a URL for a user to sell a crypto asset for fiat currency.
     * @abstract
     * @param {SellOptions} options - The options for the sell operation.
     * @returns {Promise<SellResult>} The URL for the user to complete the sale.
     */
    abstract sell(options: SellOptions): Promise<SellResult>;
    /**
     * Retrieves the details of a specific transaction from the provider.
     * @abstract
     * @param {string} txId - The unique identifier of the transaction.
     * @returns {Promise<FiatTransactionDetail>} The transaction details.
     */
    abstract getTransactionDetail(txId: string): Promise<FiatTransactionDetail>;
    /**
     * Retrieves a list of supported crypto assets from the provider.
     * @abstract
     * @returns {Promise<SupportedCryptoAsset[]>} An array of supported crypto assets.
     */
    abstract getSupportedCryptoAssets(): Promise<SupportedCryptoAsset[]>;
    /**
     * Retrieves a list of supported fiat currencies from the provider.
     * @abstract
     * @returns {Promise<SupportedFiatCurrency[]>} An array of supported fiat currencies.
     */
    abstract getSupportedFiatCurrencies(): Promise<SupportedFiatCurrency[]>;
    /**
     * Retrieves a list of supported countries or regions from the provider.
     * @abstract
     * @returns {Promise<SupportedCountry[]>} An array of supported countries.
     */
    abstract getSupportedCountries(): Promise<SupportedCountry[]>;
}
export type IWalletAccountReadOnly = import("../wallet-account-read-only.js").IWalletAccountReadOnly;
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
/**
 * Standardized status for an on/off-ramp transaction.
 */
export type FiatTransactionStatus = "in_progress" | "failed" | "completed";
/**
 * A protocol-agnostic, standardized object representing the details of an on/off-ramp transaction.
 */
export type FiatTransactionDetail = {
    /**
     * - The current status of the transaction.
     */
    status: FiatTransactionStatus;
    /**
     * - The provider-specific code of the crypto asset (e.g., 'btc').
     */
    cryptoAsset: string;
    /**
     * - The currency's ISO 4217 code (e.g., 'USD').
     */
    fiatCurrency: string;
};
/**
 * A protocol-agnostic, standardized object representing a supported crypto asset.
 */
export type SupportedCryptoAsset = {
    /**
     * - Provider-specific asset code for the crypto asset.
     */
    code: string;
    /**
     * - The network code for the asset, if applicable (e.g., 'ethereum', 'tron').
     */
    networkCode: string;
    /**
     * - The on-chain number of decimal places for the asset's base unit (e.g., 18 for ETH).
     */
    decimals: number;
    /**
     * - The asset's full name (e.g., 'Bitcoin').
     */
    name?: string;
};
/**
 * A protocol-agnostic, standardized object representing a supported fiat currency.
 */
export type SupportedFiatCurrency = {
    /**
     * - The currency's ISO 4217 code (e.g., 'USD').
     */
    code: string;
    /**
     * - The number of decimal places for the currency's smallest unit (e.g., 2 for USD, 0 for JPY).
     */
    decimals: number;
    /**
     * - The currency's full name (e.g., 'United States Dollar').
     */
    name?: string;
};
/**
 * A protocol-agnostic, standardized object representing a supported country.
 */
export type SupportedCountry = {
    /**
     * - The country's ISO 3166-1 alpha-2 or alpha-3 code.
     */
    code: string;
    /**
     * - Whether buying is supported in this country.
     */
    isBuyAllowed: boolean;
    /**
     * - Whether selling is supported in this country.
     */
    isSellAllowed: boolean;
    /**
     * - The country's common name.
     */
    name?: string;
};
export type BuyOptions = BuyCommonOptions & (BuyExactCryptoAmountOptions | BuyWithFiatAmountOptions);
export type BuyCommonOptions = {
    /**
     * - The provider-specific code of the crypto asset to purchase.
     */
    cryptoAsset: string;
    /**
     * - The currency's ISO 4217 code (e.g., 'USD').
     */
    fiatCurrency: string;
    /**
     * - The wallet address to receive the purchased crypto asset. Defaults to the account's address.
     */
    recipient?: string;
};
export type BuyExactCryptoAmountOptions = {
    /**
     * - The amount of crypto asset to buy, in its base unit (e.g., wei for ETH).
     */
    cryptoAmount: number | bigint;
    /**
     * - The amount of fiat currency to spend, in its smallest unit (e.g., cents for USD).
     */
    fiatAmount?: never;
};
export type BuyWithFiatAmountOptions = {
    /**
     * - The amount of fiat currency to spend, in its smallest unit (e.g., cents for USD).
     */
    fiatAmount: number | bigint;
    /**
     * - The amount of crypto asset to buy, in its base unit (e.g., wei for ETH).
     */
    cryptoAmount?: never;
};
export type BuyResult = {
    /**
     * - The URL for the user to complete the purchase.
     */
    buyUrl: string;
};
export type SellOptions = SellCommonOptions & (SellExactCryptoAmountOptions | SellForFiatAmountOptions);
export type SellCommonOptions = {
    /**
     * - The provider-specific code of the crypto asset to sell.
     */
    cryptoAsset: string;
    /**
     * - The currency's ISO 4217 code (e.g., 'USD').
     */
    fiatCurrency: string;
    /**
     * - The wallet address to receive refunds in case of failure. Defaults to the account's address.
     */
    refundAddress?: string;
};
export type SellExactCryptoAmountOptions = {
    /**
     * - The amount of crypto asset to sell, in its base unit (e.g., wei for ETH).
     */
    cryptoAmount: number | bigint;
    /**
     * - The amount of fiat currency to receive, in its smallest unit (e.g., cents for USD).
     */
    fiatAmount?: never;
};
export type SellForFiatAmountOptions = {
    /**
     * - The amount of fiat currency to receive, in its smallest unit (e.g., cents for USD).
     */
    fiatAmount: number | bigint;
    /**
     * - The amount of crypto asset to sell, in its base unit (e.g., wei for ETH).
     */
    cryptoAmount?: never;
};
export type SellResult = {
    /**
     * - The URL for the user to complete the sale.
     */
    sellUrl: string;
};
/**
 * A protocol-agnostic, standardized object representing a quote for an on/off-ramp transaction.
 */
export type FiatQuote = {
    /**
     * - The amount of the crypto asset, in its base unit (e.g., wei).
     */
    cryptoAmount: bigint;
    /**
     * - The amount of the fiat currency, in its smallest unit (e.g., cents).
     */
    fiatAmount: bigint;
    /**
     * - The fee charged for the transaction, denominated in the smallest unit of the fiat currency.
     */
    fee: bigint;
    /**
     * - The effective exchange rate, expressed as a string to avoid precision loss (e.g., a rate of "3000.50" for ETH/USD means 1 ETH = 3000.50 USD). Note: This rate applies to the standard units (e.g., ETH and USD).
     */
    rate: string;
};
