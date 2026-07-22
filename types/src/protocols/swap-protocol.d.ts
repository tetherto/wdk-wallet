/** @interface */
export interface ISwapProtocol {
    /**
     * Swaps a pair of tokens.
     *
     * @param {SwapOptions} options - The swap's options.
     * @returns {Promise<SwapResult>} The swap's result.
     * @throws {AccountRequiredError} If the protocol requires a full account to perform a swap.
     * @throws {ValueError} If the swap options are not valid.
     * @throws {InvalidTokenError} If the input or output tokens are not valid ERC 20 token's addresses.
     * @throws {ProviderRequiredError} If the method requires a provider and none is set.
     * @throws {ProviderError} If the provider fails to perform the swap.
     * @throws {SwapError} If the swap fails with an error.
     * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the swap max. fee option.
     */
    swap(options: SwapOptions): Promise<SwapResult>;
    /**
     * Quotes the costs of a swap operation.
     *
     * @param {SwapOptions} options - The swap's options.
     * @returns {Promise<Omit<SwapResult, 'hash'>>} The swap's quotes.
     * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a swap.
     * @throws {ValueError} If the swap options are not valid.
     * @throws {InvalidTokenError} If the input or output tokens are not valid ERC 20 token's addresses.
     * @throws {ProviderRequiredError} If the method requires a provider and none is set.
     * @throws {ProviderError} If the provider fails to estimate the costs of the swap.
     * @throws {SwapError} If the swap fails with an error.
     */
    quoteSwap(options: SwapOptions): Promise<Omit<SwapResult, "hash">>;
}
/**
 * @abstract
 * @implements {ISwapProtocol}
 */
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
     * @throws {AccountRequiredError} If the protocol requires a full account to perform a swap.
     * @throws {ValueError} If the swap options are not valid.
     * @throws {InvalidTokenError} If the input or output tokens are not valid ERC 20 token's addresses.
     * @throws {ProviderRequiredError} If the method requires a provider and none is set.
     * @throws {ProviderError} If the provider fails to perform the swap.
     * @throws {SwapError} If the swap fails with an error.
     * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the swap max. fee option.
     */
    abstract swap(options: SwapOptions): Promise<SwapResult>;
    /**
     * Quotes the costs of a swap operation.
     *
     * @abstract
     * @param {SwapOptions} options - The swap's options.
     * @returns {Promise<Omit<SwapResult, 'hash'>>} The swap's quotes.
     * @throws {ValueError} If the swap options are not valid.
     * @throws {InvalidTokenError} If the input or output tokens are not valid ERC 20 token's addresses.
     * @throws {ProviderRequiredError} If the method requires a provider and none is set.
     * @throws {ProviderError} If the provider fails to estimate the costs of the swap.
     * @throws {SwapError} If the swap fails with an error.
     */
    abstract quoteSwap(options: SwapOptions): Promise<Omit<SwapResult, "hash">>;
}
export type IWalletAccountReadOnly = import("../wallet-account-read-only.js").IWalletAccountReadOnly;
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
export type AccountRequiredError = import("./errors.js").AccountRequiredError;
export type InvalidTokenError = import("./errors.js").InvalidTokenError;
export type MaximumFeeExceededError = import("./errors.js").MaximumFeeExceededError;
export type ReadOnlyAccountRequiredError = import("./errors.js").ReadOnlyAccountRequiredError;
export type ProviderError = import("./errors.js").ProviderError;
export type ProviderRequiredError = import("./errors.js").ProviderRequiredError;
export type SwapError = import("./errors.js").SwapError;
export type ValueError = import("./errors.js").ValueError;
export type SwapProtocolConfig = {
    /**
     * - The maximum fee amount for swap operations.
     */
    swapMaxFee?: number | bigint;
};
export type SwapOptions = SwapCommonOptions & (SwapBuyOptions | SwapSellOptions);
export type SwapCommonOptions = {
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
    /**
     * - The minimum acceptable amount of destination tokens to receive (in base unit).
     */
    minAmountOut?: number | bigint;
};
export type SwapBuyOptions = {
    /**
     * - The amount of input tokens to sell (in base unit).
     */
    tokenInAmount?: never;
    /**
     * - The amount of output tokens to buy (in base unit).
     */
    tokenOutAmount: number | bigint;
};
export type SwapSellOptions = {
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
