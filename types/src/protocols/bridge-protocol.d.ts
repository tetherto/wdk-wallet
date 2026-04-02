/** @interface */
export interface IBridgeProtocol {
    /**
     * Bridges a token to a different blockchain.
     *
     * @param {BridgeOptions} options - The bridge's options.
     * @returns {Promise<BridgeResult>} The bridge's result.
     */
    bridge(options: BridgeOptions): Promise<BridgeResult>;
    /**
     * Quotes the costs of a bridge operation.
     *
     * @param {BridgeOptions} options - The bridge's options.
     * @returns {Promise<Omit<BridgeResult, 'hash'>>} The bridge's quotes.
     */
    quoteBridge(options: BridgeOptions): Promise<Omit<BridgeResult, "hash">>;
}
/** @abstract */
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
     * @type {IWalletAccount}
     */
    protected _account: IWalletAccount;
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
     */
    abstract bridge(options: BridgeOptions): Promise<BridgeResult>;
    /**
     * Quotes the costs of a bridge operation.
     *
     * @abstract
     * @param {BridgeOptions} options - The bridge's options.
     * @returns {Promise<Omit<BridgeResult, 'hash'>>} The bridge's quotes.
     */
    abstract quoteBridge(options: BridgeOptions): Promise<Omit<BridgeResult, "hash">>;
}
export type IWalletAccountReadOnly = import("../wallet-account-read-only.js").IWalletAccountReadOnly;
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
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
