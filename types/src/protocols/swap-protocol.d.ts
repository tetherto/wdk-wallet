/** @interface */
export interface ISwapProtocol {
    /**
     * Swaps a pair of tokens.
     *
     * @param {SwapOptions} options - The swap's options.
     * @returns {Promise<SwapResult>} The swap's result.
     */
    swap(options: SwapOptions): Promise<SwapResult>;
    /**
     * Quotes the costs of a swap operation.
     *
     * @param {SwapOptions} options - The swap's options.
     * @returns {Promise<Omit<SwapResult, 'hash'>>} The swap's quotes.
     */
    quoteSwap(options: SwapOptions): Promise<Omit<SwapResult, "hash">>;
}
/** @abstract */
export default abstract class SwapProtocol implements ISwapProtocol {
    /**
     * Creates a new read-only swap protocol.
     *
     * @overload
     * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
     * @param {SwapProtocolConfig} [config] - The swap protocol configuration.
     */
    constructor(account: IWalletAccountReadOnly, config?: SwapProtocolConfig);
    /**
     * Creates a new swap protocol.
     *
     * @overload
     * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
     * @param {SwapProtocolConfig} [config] - The swap protocol configuration.
     */
    constructor(account: IWalletAccount, config?: SwapProtocolConfig);
    /**
     * The wallet account to use to interact with the protocol.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount}
     */
    protected _account: IWalletAccountReadOnly | IWalletAccount;
    /**
     * The swap protocol configuration.
     *
     * @protected
     * @type {SwapProtocolConfig}
     */
    protected _config: SwapProtocolConfig;
    /**
     * Swaps a pair of tokens.
     *
     * @abstract
     * @param {SwapOptions} options - The swap's options.
     * @returns {Promise<SwapResult>} The swap's result.
     */
    abstract swap(options: SwapOptions): Promise<SwapResult>;
    /**
     * Quotes the costs of a swap operation.
     *
     * @abstract
     * @param {SwapOptions} options - The swap's options.
     * @returns {Promise<Omit<SwapResult, 'hash'>>} The swap's quotes.
     */
    abstract quoteSwap(options: SwapOptions): Promise<Omit<SwapResult, "hash">>;
}
export type IWalletAccountReadOnly = import("../wallet-account-read-only.js").IWalletAccountReadOnly;
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
export type SwapProtocolConfig = {
    /**
     * - The maximum fee amount for swap operations.
     */
    swapMaxFee?: number | bigint;
};
export type SwapOptions = SwapCommonOptions & (SwapBuyOptions | SwapSellOptions);
type SwapCommonOptions = {
    /**
     * - The address of the token to sell.
     */
    tokenIn: string;
    /**
     * - The address of the token to buy.
     */
    tokenOut: string;
    /**
     * - The address that will receive the output tokens. If not set, the account itself will receive the funds.
     */
    to?: string;
};
type SwapBuyOptions = {
    /**
     * - The amount of input tokens to sell (in base unit).
     */
    tokenInAmount?: never;
    /**
     * - The amount of output tokens to buy (in base unit).
     */
    tokenOutAmount: number | bigint;
};
type SwapSellOptions = {
    /**
     * - The amount of input tokens to sell (in base unit).
     */
    tokenInAmount: number | bigint;
    /**
     * - The amount of output tokens to buy (in base unit).
     */
    tokenOutAmount?: never;
};
export type SwapResult = {
    /**
     * - The hash of the swap operation.
     */
    hash: string;
    /**
     * - The gas cost.
     */
    fee: bigint;
    /**
     * - The amount of input tokens sold.
     */
    tokenInAmount: bigint;
    /**
     * - The amount of output tokens bought.
     */
    tokenOutAmount: bigint;
};
