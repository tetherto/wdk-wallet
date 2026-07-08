/** @interface */
export interface ISwidgeProtocol extends ISwapProtocol, IBridgeProtocol {
    /**
     * Quotes the estimated costs and output of a cross-chain swap/bridge operation.
     * Returns a non-binding quote; the actual execution is performed
     * by {@link swidge}.
     *
     * @param {SwidgeOptions} options - The swidge options.
     * @returns {Promise<SwidgeQuote>} The quoted swidge details.
     */
    quoteSwidge(options: SwidgeOptions): Promise<SwidgeQuote>;
    /**
     * Executes a swidge operation.
     *
     * @param {SwidgeOptions} options - The swidge options.
     * @param {SwidgeProtocolConfig} [config] - Optional provider-specific execution configuration.
     * @returns {Promise<SwidgeResult>} The swidge execution result.
     */
    swidge(options: SwidgeOptions, config?: SwidgeProtocolConfig): Promise<SwidgeResult>;
    /**
     * Retrieves the current status of an in-flight swidge.
     *
     * @param {string} id - The swidge execution identifier returned by swidge.
     * @param {SwidgeStatusOptions} [options] - Optional hints to assist provider lookups.
     * @returns {Promise<SwidgeStatusResult>} The current swidge status.
     * @throws {Error} If the id is invalid, or no swidge exists with the given identifier.
     */
    getSwidgeStatus(id: string, options?: SwidgeStatusOptions): Promise<SwidgeStatusResult>;
    /**
     * Retrieves the chains supported by the provider for swidge operations.
     *
     * @returns {Promise<SwidgeSupportedChain[]>} The supported chains.
     */
    getSupportedChains(): Promise<SwidgeSupportedChain[]>;
    /**
     * Retrieves the tokens supported by the provider for swidge operations.
     *
     * @param {SwidgeSupportedTokensOptions} [options] - Optional filters for chain- or route-scoped token discovery.
     * @returns {Promise<SwidgeSupportedToken[]>} The supported tokens.
     */
    getSupportedTokens(options?: SwidgeSupportedTokensOptions): Promise<SwidgeSupportedToken[]>;
}
/** @abstract */
export default abstract class SwidgeProtocol implements ISwidgeProtocol, ISwapProtocol, IBridgeProtocol {
    /**
     * Creates a new swidge protocol without binding it to a wallet account.
     *
     * @overload
     * @param {undefined} [account] - The wallet account to use to interact with the protocol.
     * @param {SwidgeProtocolConfig} [config] - The swidge protocol configuration.
     */
    constructor(account?: undefined, config?: SwidgeProtocolConfig | undefined);
    /**
     * Creates a new read-only swidge protocol.
     *
     * @overload
     * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
     * @param {SwidgeProtocolConfig} [config] - The swidge protocol configuration.
     */
    constructor(account: IWalletAccountReadOnly, config?: SwidgeProtocolConfig | undefined);
    /**
     * Creates a new swidge protocol.
     *
     * @overload
     * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
     * @param {SwidgeProtocolConfig} [config] - The swidge protocol configuration.
     */
    constructor(account: IWalletAccount, config?: SwidgeProtocolConfig | undefined);
    /**
     * The wallet account to use to interact with the protocol.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount | undefined}
     */
    protected _account: IWalletAccountReadOnly | IWalletAccount | undefined;
    /**
     * The swidge protocol configuration.
     *
     * @protected
     * @type {SwidgeProtocolConfig}
     */
    protected _config: SwidgeProtocolConfig;
    /**
     * Swaps a pair of tokens by delegating to {@link swidge}.
     *
     * @param {SwapOptions} options - The swap's options.
     * @returns {Promise<SwapResult>} The swap's result.
     */
    swap(options: SwapOptions): Promise<SwapResult>;
    /**
     * Quotes the costs of a swap operation by delegating to {@link quoteSwidge}.
     *
     * @param {SwapOptions} options - The swap's options.
     * @returns {Promise<Omit<SwapResult, 'hash'>>} The swap's quotes.
     */
    quoteSwap(options: SwapOptions): Promise<Omit<SwapResult, "hash">>;
    /**
     * Bridges a token to a different blockchain by delegating to {@link swidge}.
     *
     * @param {BridgeOptions} options - The bridge's options.
     * @returns {Promise<BridgeResult>} The bridge's result.
     */
    bridge(options: BridgeOptions): Promise<BridgeResult>;
    /**
     * Quotes the costs of a bridge operation by delegating to {@link quoteSwidge}.
     *
     * @param {BridgeOptions} options - The bridge's options.
     * @returns {Promise<Omit<BridgeResult, 'hash'>>} The bridge's quotes.
     */
    quoteBridge(options: BridgeOptions): Promise<Omit<BridgeResult, "hash">>;
    /**
     * Quotes the estimated costs and output of a swidge operation.
     * Returns a non-binding quote; the actual execution is performed
     * by {@link swidge}.
     *
     * @abstract
     * @param {SwidgeOptions} options - The swidge options.
     * @returns {Promise<SwidgeQuote>} The quoted swidge details.
     */
    abstract quoteSwidge(options: SwidgeOptions): Promise<SwidgeQuote>;
    /**
     * Executes a swidge operation.
     *
     * @abstract
     * @param {SwidgeOptions} options - The swidge options.
     * @param {SwidgeProtocolConfig} [config] - Optional provider-specific execution configuration.
     * @returns {Promise<SwidgeResult>} The swidge execution result.
     */
    abstract swidge(options: SwidgeOptions, config?: SwidgeProtocolConfig): Promise<SwidgeResult>;
    /**
     * Retrieves the current status of an in-flight swidge.
     *
     * @abstract
     * @param {string} id - The swidge execution identifier returned by swidge.
     * @param {SwidgeStatusOptions} [options] - Optional hints to assist provider lookups.
     * @returns {Promise<SwidgeStatusResult>} The current swidge status.
     * @throws {Error} If the id is invalid, or no swidge exists with the given identifier.
     */
    abstract getSwidgeStatus(id: string, options?: SwidgeStatusOptions): Promise<SwidgeStatusResult>;
    /**
     * Retrieves the chains supported by the provider for swidge operations.
     *
     * @abstract
     * @returns {Promise<SwidgeSupportedChain[]>} The supported chains.
     */
    abstract getSupportedChains(): Promise<SwidgeSupportedChain[]>;
    /**
     * Retrieves the tokens supported by the provider for swidge operations.
     *
     * @abstract
     * @param {SwidgeSupportedTokensOptions} [options] - Optional filters for chain- or route-scoped token discovery.
     * @returns {Promise<SwidgeSupportedToken[]>} The supported tokens.
     */
    abstract getSupportedTokens(options?: SwidgeSupportedTokensOptions): Promise<SwidgeSupportedToken[]>;
}
export type IWalletAccountReadOnly = import("../wallet-account-read-only.js").IWalletAccountReadOnly;
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
export type ISwapProtocol = import("./swap-protocol.js").ISwapProtocol;
export type SwapOptions = import("./swap-protocol.js").SwapOptions;
export type SwapResult = import("./swap-protocol.js").SwapResult;
export type IBridgeProtocol = import("./bridge-protocol.js").IBridgeProtocol;
export type BridgeOptions = import("./bridge-protocol.js").BridgeOptions;
export type BridgeResult = import("./bridge-protocol.js").BridgeResult;
export type SwidgeStatus = "pending" | "action-required" | "completed" | "failed" | "refund-pending" | "refunded" | "cancelled" | "expired" | "partial";
export type SwidgeFeeType = "network" | "protocol" | "affiliate" | "other";
export type SwidgeProtocolConfig = {
    /**
     * - Maximum acceptable network fee in basis points of the input amount.
     */
    maxNetworkFeeBps?: number | bigint | undefined;
    /**
     * - Maximum acceptable protocol fee in basis points of the input amount.
     */
    maxProtocolFeeBps?: number | bigint | undefined;
};
export type SwidgeOptions = SwidgeCommonOptions & (SwidgeExactInOptions | SwidgeExactOutOptions);
export type SwidgeCommonOptions = {
    /**
     * - The provider-specific identifier or address of the source token.
     */
    fromToken: string;
    /**
     * - The provider-specific identifier or address of the destination token.
     */
    toToken: string;
    /**
     * - The identifier of the destination chain. If omitted, defaults to the source chain (same-chain swap).
     */
    toChain?: string | number | undefined;
    /**
     * - The address that will receive the output tokens.
     */
    recipient?: string | undefined;
    /**
     * - The address that will receive refunds if the tx cannot complete.
     */
    refundAddress?: string | undefined;
    /**
     * - The maximum acceptable slippage as a decimal (e.g., 0.01 for 1%).
     */
    slippage?: number | undefined;
    /**
     * - The minimum acceptable amount of destination tokens to receive (in base unit).
     */
    minAmountOut?: number | bigint;
};
export type SwidgeExactInOptions = {
    /**
     * - The exact amount of source tokens to spend (in base unit).
     */
    fromTokenAmount: number | bigint;
    /**
     * - Not applicable for exact-in operations.
     */
    toTokenAmount?: undefined;
};
export type SwidgeExactOutOptions = {
    /**
     * - Not applicable for exact-out operations.
     */
    fromTokenAmount?: undefined;
    /**
     * - The exact amount of destination tokens to receive (in base unit).
     */
    toTokenAmount: number | bigint;
};
export type SwidgeFee = {
    /**
     * - The category of the fee.
     */
    type: SwidgeFeeType;
    /**
     * - The fee amount in base units.
     */
    amount: bigint;
    /**
     * - The token in which the fee is denominated.
     */
    token: string;
    /**
     * - The chain on which the fee is charged.
     */
    chain?: string | number | undefined;
    /**
     * - Whether the fee is already included in the quoted amounts.
     */
    included?: boolean | undefined;
    /**
     * - A human-readable description of the fee.
     */
    description?: string | undefined;
};
export type SwidgeTransaction = {
    /**
     * - The transaction hash.
     */
    hash: string;
    /**
     * - The chain on which the transaction occurred.
     */
    chain?: string | number | undefined;
    /**
     * - The role of the transaction within the swidge.
     */
    type?: "other" | "source" | "destination" | "approval" | "refund" | undefined;
};
export type SwidgeQuote = {
    /**
     * - The amount of source tokens to spend.
     */
    fromTokenAmount: bigint;
    /**
     * - The estimated amount of destination tokens to receive.
     */
    toTokenAmount: bigint;
    /**
     * - The minimum guaranteed amount after slippage.
     */
    toTokenAmountMin: bigint;
    /**
     * - Itemised fee breakdown.
     */
    fees: SwidgeFee[];
    /**
     * - Estimated duration in seconds.
     */
    estimatedDuration?: number | undefined;
    /**
     * - Unix timestamp (seconds) at which the quote expires.
     */
    expiry?: number | undefined;
    /**
     * - Provider-reported estimated price impact as a decimal (e.g., 0.01 for 1%).
     */
    priceImpact?: number | undefined;
};
export type SwidgeResult = {
    /**
     * - The unique swidge execution identifier.
     */
    id: string;
    /**
     * - The primary transaction hash (if available immediately).
     */
    hash?: string | undefined;
    /**
     * - Itemised fee breakdown.
     */
    fees: SwidgeFee[];
    /**
     * - Transactions produced by the swidge execution.
     */
    transactions?: SwidgeTransaction[] | undefined;
    /**
     * - The actual amount of source tokens spent.
     */
    fromTokenAmount: bigint;
    /**
     * - The actual or expected amount of destination tokens.
     */
    toTokenAmount: bigint;
    /**
     * - The minimum guaranteed amount after slippage.
     */
    toTokenAmountMin?: bigint | undefined;
};
export type SwidgeStatusOptions = {
    /**
     * - The source chain identifier.
     */
    fromChain?: string | number | undefined;
    /**
     * - The destination chain identifier.
     */
    toChain?: string | number | undefined;
};
export type SwidgeStatusResult = {
    /**
     * - The current status of the swidge.
     */
    status: SwidgeStatus;
    /**
     * - Transactions associated with the swidge.
     */
    transactions?: SwidgeTransaction[] | undefined;
};
export type SwidgeSupportedChain = {
    /**
     * - The provider-specific chain identifier.
     */
    id: string | number;
    /**
     * - The human-readable chain name.
     */
    name: string;
    /**
     * - The chain or virtual machine type (e.g., 'evm', 'svm', 'utxo').
     */
    type: string;
    /**
     * - The symbol of the chain's native token.
     */
    nativeToken: string;
};
export type SwidgeSupportedToken = {
    /**
     * - The provider-specific token identifier to use in swidge operations.
     */
    token: string;
    /**
     * - The chain on which the token is available.
     */
    chain: string | number;
    /**
     * - The token symbol.
     */
    symbol: string;
    /**
     * - The number of decimal places for the token's base unit.
     */
    decimals: number;
    /**
     * - The token contract address, if applicable.
     */
    address?: string | undefined;
    /**
     * - The token's full name.
     */
    name?: string | undefined;
};
export type SwidgeSupportedTokensOptions = {
    /**
     * - The optional source chain for route-scoped discovery.
     */
    fromChain?: string | number | undefined;
    /**
     * - The optional source token for route-scoped discovery.
     */
    fromToken?: string | undefined;
    /**
     * - The optional destination chain for route-scoped discovery.
     */
    toChain?: string | number | undefined;
};
