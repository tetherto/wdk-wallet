/** @typedef {import('../wallet-account-read-only.js').IWalletAccountReadOnly} IWalletAccountReadOnly */
/** @typedef {import('../wallet-account.js').IWalletAccount} IWalletAccount */
/**
 * @typedef {'pending' | 'action-required' | 'completed' | 'failed'
 *          | 'refund-pending' | 'refunded' | 'cancelled' | 'expired' | 'partial'} SwidgeStatus
 */
/**
 * @typedef {'gas' | 'protocol' | 'bridge' | 'relayer'
 *          | 'application' | 'affiliate' | 'liquidity' | 'other'} SwidgeFeeType
 */
/**
 * @typedef {Object} SwidgeProtocolConfig
 * @property {bigint} [swidgeMaxFee] - The maximum total fee for swidge operations.
 * @property {bigint} [swidgeMaxProtocolFee] - The maximum protocol fee for swidge operations.
 */
/**
 * @typedef {SwidgeCommonOptions & (SwidgeExactInOptions | SwidgeExactOutOptions)} SwidgeOptions
 */
/**
 * @typedef {Object} SwidgeCommonOptions
 * @property {string} fromToken - The address of the source token.
 * @property {string} toToken - The address of the destination token.
 * @property {string | number} toChain - The identifier of the destination chain.
 * @property {string} [recipient] - The address that will receive the output tokens.
 * @property {number} [slippage] - The maximum acceptable slippage as a decimal (e.g., 0.01 for 1%).
 */
/**
 * @typedef {Object} SwidgeExactInOptions
 * @property {number | bigint} fromTokenAmount - The exact amount of source tokens to spend (in base unit).
 * @property {never} [toTokenAmount] - Not applicable for exact-in operations.
 */
/**
 * @typedef {Object} SwidgeExactOutOptions
 * @property {never} [fromTokenAmount] - Not applicable for exact-out operations.
 * @property {number | bigint} toTokenAmount - The exact amount of destination tokens to receive (in base unit).
 */
/**
 * @typedef {Object} SwidgeFee
 * @property {SwidgeFeeType} type - The category of the fee.
 * @property {bigint} amount - The fee amount in base units.
 * @property {string} token - The token in which the fee is denominated.
 * @property {string | number} [chain] - The chain on which the fee is charged.
 * @property {boolean} [included] - Whether the fee is already included in the quoted amounts.
 * @property {string} [description] - A human-readable description of the fee.
 */
/**
 * @typedef {Object} SwidgeTransaction
 * @property {string} hash - The transaction hash.
 * @property {string | number} [chain] - The chain on which the transaction occurred.
 * @property {'source' | 'destination' | 'approval' | 'refund' | 'other'} [type] - The role of the transaction within the swidge.
 */
/**
 * @typedef {Object} SwidgeQuote
 * @property {bigint} fromTokenAmount - The amount of source tokens to spend.
 * @property {bigint} toTokenAmount - The estimated amount of destination tokens to receive.
 * @property {bigint} toTokenAmountMin - The minimum guaranteed amount after slippage.
 * @property {bigint} [fee] - The total aggregated fee.
 * @property {bigint} [protocolFee] - The protocol-specific fee portion.
 * @property {SwidgeFee[]} [fees] - Itemized fee breakdown.
 * @property {number} [estimatedDuration] - Estimated duration in seconds.
 * @property {number} [expiry] - Unix timestamp (seconds) at which the quote expires.
 * @property {object} providerData - Opaque provider-specific data required to execute the swidge.
 */
/**
 * @typedef {Object} SwidgeResult
 * @property {string} id - The unique swidge execution identifier.
 * @property {string} [hash] - The primary transaction hash (if available immediately).
 * @property {bigint} [fee] - The total aggregated fee charged.
 * @property {bigint} [protocolFee] - The protocol-specific fee charged.
 * @property {SwidgeFee[]} [fees] - Itemized fee breakdown.
 * @property {SwidgeTransaction[]} [transactions] - Transactions produced by the swidge execution.
 * @property {bigint} fromTokenAmount - The actual amount of source tokens spent.
 * @property {bigint} toTokenAmount - The actual or expected amount of destination tokens.
 * @property {bigint} [toTokenAmountMin] - The minimum guaranteed amount after slippage.
 * @property {object} [providerData] - Opaque provider-specific data for status tracking.
 */
/**
 * @typedef {Object} SwidgeStatusOptions
 * @property {string | number} [fromChain] - The source chain identifier.
 * @property {string | number} [toChain] - The destination chain identifier.
 * @property {object} [providerData] - Opaque provider-specific data to assist status lookup.
 */
/**
 * @typedef {Object} SwidgeStatusResult
 * @property {SwidgeStatus} status - The current status of the swidge.
 * @property {SwidgeTransaction[]} [transactions] - Transactions associated with the swidge.
 * @property {object} [providerData] - Opaque provider-specific data.
 */
/** @interface */
export class ISwidgeProtocol {
    /**
     * Quotes a cross-chain swap/bridge operation.
     *
     * @param {SwidgeOptions} options - The swidge options.
     * @returns {Promise<SwidgeQuote>} The quoted swidge details.
     */
    quoteSwidge(options: SwidgeOptions): Promise<SwidgeQuote>;
    /**
     * Executes a previously quoted swidge.
     *
     * @param {SwidgeQuote} quote - The quote returned by quoteSwidge.
     * @param {SwidgeProtocolConfig} [config] - Optional fee limits for the execution.
     * @returns {Promise<SwidgeResult>} The swidge execution result.
     */
    executeSwidge(quote: SwidgeQuote, config?: SwidgeProtocolConfig): Promise<SwidgeResult>;
    /**
     * Retrieves the current status of an in-flight swidge.
     *
     * @param {string} id - The swidge execution identifier returned by executeSwidge.
     * @param {SwidgeStatusOptions} [options] - Optional hints to assist provider lookups.
     * @returns {Promise<SwidgeStatusResult>} The current swidge status.
     */
    getSwidgeStatus(id: string, options?: SwidgeStatusOptions): Promise<SwidgeStatusResult>;
}
/**
 * @abstract
 * @implements {ISwidgeProtocol}
 */
export default class SwidgeProtocol implements ISwidgeProtocol {
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
     * @type {IWalletAccountReadOnly | IWalletAccount}
     */
    protected _account: IWalletAccountReadOnly | IWalletAccount;
    /**
     * The swidge protocol configuration.
     *
     * @protected
     * @type {SwidgeProtocolConfig}
     */
    protected _config: SwidgeProtocolConfig;
    /**
     * Quotes a cross-chain swap/bridge operation.
     *
     * @abstract
     * @param {SwidgeOptions} options - The swidge options.
     * @returns {Promise<SwidgeQuote>} The quoted swidge details.
     */
    quoteSwidge(options: SwidgeOptions): Promise<SwidgeQuote>;
    /**
     * Executes a previously quoted swidge.
     *
     * @abstract
     * @param {SwidgeQuote} quote - The quote returned by quoteSwidge.
     * @param {SwidgeProtocolConfig} [config] - Optional fee limits for the execution.
     * @returns {Promise<SwidgeResult>} The swidge execution result.
     */
    executeSwidge(quote: SwidgeQuote, config?: SwidgeProtocolConfig): Promise<SwidgeResult>;
    /**
     * Retrieves the current status of an in-flight swidge.
     *
     * @abstract
     * @param {string} id - The swidge execution identifier returned by executeSwidge.
     * @param {SwidgeStatusOptions} [options] - Optional hints to assist provider lookups.
     * @returns {Promise<SwidgeStatusResult>} The current swidge status.
     */
    getSwidgeStatus(id: string, options?: SwidgeStatusOptions): Promise<SwidgeStatusResult>;
}
export type IWalletAccountReadOnly = import("../wallet-account-read-only.js").IWalletAccountReadOnly;
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
export type SwidgeStatus = "pending" | "action-required" | "completed" | "failed" | "refund-pending" | "refunded" | "cancelled" | "expired" | "partial";
export type SwidgeFeeType = "gas" | "protocol" | "bridge" | "relayer" | "application" | "affiliate" | "liquidity" | "other";
export type SwidgeProtocolConfig = {
    /**
     * - The maximum total fee for swidge operations.
     */
    swidgeMaxFee?: bigint | undefined;
    /**
     * - The maximum protocol fee for swidge operations.
     */
    swidgeMaxProtocolFee?: bigint | undefined;
};
export type SwidgeOptions = SwidgeCommonOptions & (SwidgeExactInOptions | SwidgeExactOutOptions);
export type SwidgeCommonOptions = {
    /**
     * - The address of the source token.
     */
    fromToken: string;
    /**
     * - The address of the destination token.
     */
    toToken: string;
    /**
     * - The identifier of the destination chain.
     */
    toChain: string | number;
    /**
     * - The address that will receive the output tokens.
     */
    recipient?: string | undefined;
    /**
     * - The maximum acceptable slippage as a decimal (e.g., 0.01 for 1%).
     */
    slippage?: number | undefined;
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
     * - The total aggregated fee.
     */
    fee?: bigint | undefined;
    /**
     * - The protocol-specific fee portion.
     */
    protocolFee?: bigint | undefined;
    /**
     * - Itemized fee breakdown.
     */
    fees?: SwidgeFee[] | undefined;
    /**
     * - Estimated duration in seconds.
     */
    estimatedDuration?: number | undefined;
    /**
     * - Unix timestamp (seconds) at which the quote expires.
     */
    expiry?: number | undefined;
    /**
     * - Opaque provider-specific data required to execute the swidge.
     */
    providerData: object;
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
     * - The total aggregated fee charged.
     */
    fee?: bigint | undefined;
    /**
     * - The protocol-specific fee charged.
     */
    protocolFee?: bigint | undefined;
    /**
     * - Itemized fee breakdown.
     */
    fees?: SwidgeFee[] | undefined;
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
    /**
     * - Opaque provider-specific data for status tracking.
     */
    providerData?: object | undefined;
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
    /**
     * - Opaque provider-specific data to assist status lookup.
     */
    providerData?: object | undefined;
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
    /**
     * - Opaque provider-specific data.
     */
    providerData?: object | undefined;
};
