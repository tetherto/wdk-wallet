/** @interface */
export interface IBridgeProtocol {
    /**
     * Bridges a token to a different blockchain.
     *
     * @param {BridgeOptions} options - The bridge's options.
     * @returns {Promise<BridgeResult>} The bridge's result.
     * @throws {AccountRequiredError} If the protocol requires a full account to perform a bridge.
     * @throws {ValueError} If the bridge options are not valid.
     * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to perform the bridge.
     * @throws {BridgeError} If the bridge fails with an error.
     * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the bridge max. fee option.
     */
    bridge(options: BridgeOptions): Promise<BridgeResult>;
    /**
     * Quotes the costs of a bridge operation.
     *
     * @param {BridgeOptions} options - The bridge's options.
     * @returns {Promise<Omit<BridgeResult, 'hash'>>} The bridge's quotes.
     * @throws {ReadOnlyAccountRequiredError} If the protocol requires a read-only or full account to quote the costs of a swap.
     * @throws {ValueError} If the bridge options are not valid.
     * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to perform the bridge.
     * @throws {BridgeError} If the bridge fails with an error.
     */
    quoteBridge(options: BridgeOptions): Promise<Omit<BridgeResult, "hash">>;
}
/**
 * @abstract
 * @implements {IBridgeProtocol}
 */
export default abstract class BridgeProtocol implements IBridgeProtocol {
    /**
     * Creates a new read-only bridge protocol.
     *
     * @overload
     * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
     * @param {BridgeProtocolConfig} [config] - The bridge protocol configuration.
     */
    constructor(account: IWalletAccountReadOnly, config?: BridgeProtocolConfig);
    /**
     * Creates a new bridge protocol.
     *
     * @overload
     * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
     * @param {BridgeProtocolConfig} [config] - The bridge protocol configuration.
     */
    constructor(account: IWalletAccount, config?: BridgeProtocolConfig);
    /**
     * The wallet account to use to interact with the protocol.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount}
     */
    protected _account: IWalletAccountReadOnly | IWalletAccount;
    /**
     * The bridge protocol configuration.
     *
     * @protected
     * @type {BridgeProtocolConfig}
     */
    protected _config: BridgeProtocolConfig;
    /**
     * Bridges a token to a different blockchain.
     *
     * @abstract
     * @param {BridgeOptions} options - The bridge's options.
     * @returns {Promise<BridgeResult>} The bridge's result.
     * @throws {AccountRequiredError} If the protocol requires a full account to perform a bridge.
     * @throws {ValueError} If the bridge options are not valid.
     * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to perform the bridge.
     * @throws {BridgeError} If the bridge fails with an error.
     * @throws {MaximumFeeExceededError} If the the costs of the transaction exceeds the bridge max. fee option.
     */
    abstract bridge(options: BridgeOptions): Promise<BridgeResult>;
    /**
     * Quotes the costs of a bridge operation.
     *
     * @abstract
     * @param {BridgeOptions} options - The bridge's options.
     * @returns {Promise<Omit<BridgeResult, 'hash'>>} The bridge's quotes.
     * @throws {ValueError} If the bridge options are not valid.
     * @throws {InvalidTokenError} If the token is not a valid ERC 20 token's address.
     * @throws {ProviderRequiredError} If the method requires a provider.
     * @throws {ProviderError} If the provider fails to perform the bridge.
     * @throws {BridgeError} If the bridge fails with an error.
     */
    abstract quoteBridge(options: BridgeOptions): Promise<Omit<BridgeResult, "hash">>;
}
export type IWalletAccountReadOnly = import("../wallet-account-read-only.js").IWalletAccountReadOnly;
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
export type AccountRequiredError = import("./errors.js").AccountRequiredError;
export type BridgeError = import("./errors.js").BridgeError;
export type InvalidTokenError = import("./errors.js").InvalidTokenError;
export type MaximumFeeExceededError = import("./errors.js").MaximumFeeExceededError;
export type ReadOnlyAccountRequiredError = import("./errors.js").ReadOnlyAccountRequiredError;
export type ProviderError = import("./errors.js").ProviderError;
export type ProviderRequiredError = import("./errors.js").ProviderRequiredError;
export type ValueError = import("./errors.js").ValueError;
export type BridgeProtocolConfig = {
    /**
     * - The maximum fee amount for bridge operations.
     */
    bridgeMaxFee?: number | bigint;
};
export type BridgeOptions = {
    /**
     * - The identifier of the destination blockchain (e.g., "arbitrum").
     */
    targetChain: string;
    /**
     * - The address of the recipient.
     */
    recipient: string;
    /**
     * - The address of the token to bridge.
     */
    token: string;
    /**
     * - The amount of tokenss to bridge to the destination chain (in base unit).
     */
    amount: number | bigint;
};
export type BridgeResult = {
    /**
     * - The hash of the bridge operation.
     */
    hash: string;
    /**
     * - The gas cost.
     */
    fee: bigint;
    /**
     * - The amount of native tokens paid to the bridge protocol.
     */
    bridgeFee: bigint;
};
