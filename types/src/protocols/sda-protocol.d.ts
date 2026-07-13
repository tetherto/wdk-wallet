/** @interface */
export interface ISdaProtocol {
    /**
     * Lists the conversion routes the protocol supports: source chains, accepted input tokens, output assets and
     * per-route deposit limits. A protocol that discovers routes by blockchain pairs might require the `sourceChain`
     * and `destinationChain` options to be set.
     *
     * @param {SdaRoutesOptions} [options] - Optional filters for route discovery.
     * @returns {Promise<SdaRoute[]>} The supported routes.
     * @throws {ValueError} If the protocol discovers routes by blockchain pairs and the source or destination blockchain
     *   is not set.
     */
    getSupportedRoutes(options?: SdaRoutesOptions): Promise<SdaRoute[]>;
    /**
     * Fetches a non-binding quote (estimate) for a deposit — what a given deposit would deliver.
     *
     * @param {SdaDepositOptions} options - The quote options.
     * @returns {Promise<SdaDepositQuote>} The quoted deposit details.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    quoteDeposit(options: SdaDepositOptions): Promise<SdaDepositQuote>;
    /**
     * Creates deposit addresses for the given route and destination, ready to receive per the protocol's activation
     * lifecycle — a protocol that activates addresses also activates the created address so it is monitored. Returns
     * one entry per distinct address: a protocol that issues a single address across a chain family returns one entry
     * covering all of `sourceChains`, while a protocol that issues one address per source chain returns one entry each.
     *
     * @param {SdaCreateDepositAddressOptions} options - The address creation options.
     * @returns {Promise<SdaDepositAddress[]>} The created deposit addresses, one per distinct address.
     * @throws {ValueError} If `destinationAddress` is omitted and no account was bound at construction.
     */
    createDepositAddress(options: SdaCreateDepositAddressOptions): Promise<SdaDepositAddress[]>;
    /**
     * Derives a deposit address client-side, without any protocol call and without activating or monitoring it —
     * used to verify (derive + compare) or recover an address for a self-custodial protocol.
     *
     * @param {SdaCreateDepositAddressOptions} options - The same options passed to
     *   {@link ISdaProtocol#createDepositAddress}; a protocol needing extra derivation inputs declares them on its own
     *   options type (which extends `SdaCreateDepositAddressOptions`).
     * @returns {Promise<string>} The derived deposit address.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     * @throws {ValueError} If `destinationAddress` is omitted and no account was bound at construction.
     */
    deriveDepositAddress(options: SdaCreateDepositAddressOptions): Promise<string>;
    /**
     * Looks up an existing deposit address by its identifier — the `SdaDepositAddress.id` returned by
     * {@link ISdaProtocol#createDepositAddress}, which round-trips any chain context the protocol needs.
     *
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain
     *   context the protocol needs).
     * @returns {Promise<SdaDepositAddress>} The deposit address descriptor.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     * @throws {NoSuchElementError} If no such address exists.
     */
    getDepositAddress(id: string): Promise<SdaDepositAddress>;
    /**
     * Refreshes the activation of a deposit address so the protocol keeps monitoring it.
     *
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id`.
     * @returns {Promise<SdaDepositAddress>} The refreshed deposit address descriptor (with the new `expiry`).
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    renewDepositAddress(id: string): Promise<SdaDepositAddress>;
    /**
     * Lists the deposits observed at a deposit address.
     *
     * @param {string} address - The deposit address to list transfers for.
     * @param {SdaTransfersOptions} [options] - Optional pagination/filtering, plus `sourceChain` for protocols that key
     *   addresses by (address, chain).
     * @returns {Promise<SdaTransfer[]>} The transfers for the address.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    getTransfers(address: string, options?: SdaTransfersOptions): Promise<SdaTransfer[]>;
    /**
     * Lists transfers aggregated by recipient — every deposit routed to the given recipient across all of that
     * recipient's deposit addresses and source chains.
     *
     * @param {Blockchain} destinationChain - The destination chain the transfers are delivered to.
     * @param {string} recipient - The recipient (destination) address to aggregate transfers for.
     * @param {SdaTransfersOptions} [options] - Optional pagination/filtering.
     * @returns {Promise<SdaTransfer[]>} The transfers routed to the recipient.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    getTransfersByRecipient(destinationChain: Blockchain, recipient: string, options?: SdaTransfersOptions): Promise<SdaTransfer[]>;
    /**
     * Retrieves a single transfer by its identifier.
     *
     * @param {string} id - The transfer identifier.
     * @returns {Promise<SdaTransfer>} The transfer's current status.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     * @throws {NoSuchElementError} If no such transfer exists.
     */
    getTransfer(id: string): Promise<SdaTransfer>;
    /**
     * Recovers a deposit or address that was not picked up automatically, using the protocol's recovery mode.
     *
     * @param {SdaRecoveryOptions} options - The recovery options.
     * @returns {Promise<SdaRecoveryResult>} The recovery outcome.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    recoverDepositAddress(options: SdaRecoveryOptions): Promise<SdaRecoveryResult>;
    /**
     * Disables a deposit address so it no longer accepts deposits.
     *
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain
     *   context the protocol needs).
     * @returns {Promise<void>} Resolves once the address has been disabled.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    disableDepositAddress(id: string): Promise<void>;
}
/**
 * Abstract base class for "Smart Deposit Address" (SDA) protocols.
 *
 * @abstract
 * @implements {ISdaProtocol}
 */
export default abstract class SdaProtocol implements ISdaProtocol {
    /**
     * Creates a new SDA protocol without binding it to a wallet account.
     *
     * @overload
     * @param {undefined} [account] - The wallet account to use to interact with the protocol.
     */
    constructor(account?: undefined);
    /**
     * Creates a new read-only SDA protocol.
     *
     * @overload
     * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
     */
    constructor(account: IWalletAccountReadOnly);
    /**
     * Creates a new SDA protocol.
     *
     * @overload
     * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
     */
    constructor(account: IWalletAccount);
    /**
     * The wallet account to use to interact with the protocol. The account's address is the default delivery
     * destination for created addresses.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount | undefined}
     */
    protected _account: IWalletAccountReadOnly | IWalletAccount | undefined;
    /**
     * Lists the conversion routes the protocol supports: source chains, accepted input tokens, output assets and
     * per-route deposit limits. A protocol that discovers routes by blockchain pairs might require the `sourceChain`
     * and `destinationChain` options to be set.
     *
     * @abstract
     * @param {SdaRoutesOptions} [options] - Optional filters for route discovery.
     * @returns {Promise<SdaRoute[]>} The supported routes.
     * @throws {ValueError} If the protocol discovers routes by blockchain pairs and the source or destination blockchain
     *   is not set.
     */
    getSupportedRoutes(options?: SdaRoutesOptions): Promise<SdaRoute[]>;
    /**
     * Fetches a non-binding quote (estimate) for a deposit — what a given deposit would deliver.
     *
     * @param {SdaDepositOptions} options - The quote options.
     * @returns {Promise<SdaDepositQuote>} The quoted deposit details.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    quoteDeposit(options: SdaDepositOptions): Promise<SdaDepositQuote>;
    /**
     * Creates deposit addresses for the given route and destination, ready to receive per the protocol's activation
     * lifecycle — a protocol that activates addresses also activates the created address so it is monitored. Returns
     * one entry per distinct address: a protocol that issues a single address across a chain family returns one entry
     * covering all of `sourceChains`, while a protocol that issues one address per source chain returns one entry each.
     *
     * @abstract
     * @param {SdaCreateDepositAddressOptions} options - The address creation options.
     * @returns {Promise<SdaDepositAddress[]>} The created deposit addresses, one per distinct address.
     * @throws {ValueError} If `destinationAddress` is omitted and no account was bound at construction.
     */
    createDepositAddress(options: SdaCreateDepositAddressOptions): Promise<SdaDepositAddress[]>;
    /**
     * Derives a deposit address client-side, without any protocol call and without activating or monitoring it —
     * used to verify (derive + compare) or recover an address for a self-custodial protocol.
     *
     * @param {SdaCreateDepositAddressOptions} options - The same options passed to
     *   {@link ISdaProtocol#createDepositAddress}; a protocol needing extra derivation inputs declares them on its own
     *   options type (which extends `SdaCreateDepositAddressOptions`).
     * @returns {Promise<string>} The derived deposit address.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     * @throws {ValueError} If `destinationAddress` is omitted and no account was bound at construction.
     */
    deriveDepositAddress(options: SdaCreateDepositAddressOptions): Promise<string>;
    /**
     * Looks up an existing deposit address by its identifier — the `SdaDepositAddress.id` returned by
     * {@link ISdaProtocol#createDepositAddress}, which round-trips any chain context the protocol needs.
     *
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain
     *   context the protocol needs).
     * @returns {Promise<SdaDepositAddress>} The deposit address descriptor.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     * @throws {NoSuchElementError} If no such address exists.
     */
    getDepositAddress(id: string): Promise<SdaDepositAddress>;
    /**
     * Refreshes the activation of a deposit address so the protocol keeps monitoring it.
     *
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id`.
     * @returns {Promise<SdaDepositAddress>} The refreshed deposit address descriptor (with the new `expiry`).
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    renewDepositAddress(id: string): Promise<SdaDepositAddress>;
    /**
     * Lists the deposits observed at a deposit address.
     *
     * @param {string} address - The deposit address to list transfers for.
     * @param {SdaTransfersOptions} [options] - Optional pagination/filtering, plus `sourceChain` for protocols that key
     *   addresses by (address, chain).
     * @returns {Promise<SdaTransfer[]>} The transfers for the address.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    getTransfers(address: string, options?: SdaTransfersOptions): Promise<SdaTransfer[]>;
    /**
     * Lists transfers aggregated by recipient — every deposit routed to the given recipient across all of that
     * recipient's deposit addresses and source chains.
     *
     * @param {Blockchain} destinationChain - The destination chain the transfers are delivered to.
     * @param {string} recipient - The recipient (destination) address to aggregate transfers for.
     * @param {SdaTransfersOptions} [options] - Optional pagination/filtering.
     * @returns {Promise<SdaTransfer[]>} The transfers routed to the recipient.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    getTransfersByRecipient(destinationChain: Blockchain, recipient: string, options?: SdaTransfersOptions): Promise<SdaTransfer[]>;
    /**
     * Retrieves a single transfer by its identifier.
     *
     * @param {string} id - The transfer identifier.
     * @returns {Promise<SdaTransfer>} The transfer's current status.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     * @throws {NoSuchElementError} If no such transfer exists.
     */
    getTransfer(id: string): Promise<SdaTransfer>;
    /**
     * Recovers a deposit or address that was not picked up automatically, using the protocol's recovery mode.
     *
     * @param {SdaRecoveryOptions} options - The recovery options.
     * @returns {Promise<SdaRecoveryResult>} The recovery outcome.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    recoverDepositAddress(options: SdaRecoveryOptions): Promise<SdaRecoveryResult>;
    /**
     * Disables a deposit address so it no longer accepts deposits.
     *
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain
     *   context the protocol needs).
     * @returns {Promise<void>} Resolves once the address has been disabled.
     * @throws {UnsupportedOperationError} If the protocol does not support this operation.
     */
    disableDepositAddress(id: string): Promise<void>;
}
export type IWalletAccountReadOnly = import("../wallet-account-read-only.js").IWalletAccountReadOnly;
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
export type ValueError = import("../errors.js").ValueError;
export type NoSuchElementError = import("../errors.js").NoSuchElementError;
/**
 * A blockchain identifier: a numeric chain id (e.g. `1`) or a protocol-specific chain name (e.g. `'ethereum'`).
 */
export type Blockchain = string | number;
/**
 * A normalized token reference. `token` is the identifier the protocol expects in SDA calls; `address` is the
 * on-chain contract address when applicable (absent for native gas tokens).
 */
export type SdaToken = {
    /**
     * - The protocol-specific token identifier to use in SDA calls.
     */
    token: string;
    /**
     * - The chain on which the token lives.
     */
    chain: Blockchain;
    /**
     * - The token symbol (e.g., 'USDC', 'USDT').
     */
    symbol: string;
    /**
     * - The number of decimal places for the token's base unit.
     */
    decimals: number;
    /**
     * - The token contract address, if applicable.
     */
    address?: string;
    /**
     * - The token's full name.
     */
    name?: string;
};
/**
 * Per-route deposit limits, denominated in the base unit of the route's input token. Either bound may be absent
 * when the protocol does not enforce it; a protocol that only enforces limits in another denomination (e.g. USD)
 * omits `limits` rather than converting.
 */
export type SdaDepositAddressLimits = {
    /**
     * - Minimum deposit amount, in the input token's base unit.
     */
    min?: number | bigint;
    /**
     * - Maximum deposit amount, in the input token's base unit.
     */
    max?: number | bigint;
};
/**
 * Optional filters for narrowing route discovery.
 */
export type SdaRoutesOptions = {
    /**
     * - Restrict to routes that accept deposits from this chain.
     */
    sourceChain?: Blockchain;
    /**
     * - Restrict to routes that accept this input token.
     */
    sourceToken?: string;
    /**
     * - Restrict to routes that deliver to this chain.
     */
    destinationChain?: Blockchain;
    /**
     * - Restrict to routes that deliver this asset.
     */
    outputAsset?: string;
};
/**
 * A supported conversion route: one or more source chains and their accepted input tokens, the destination chain,
 * and the asset delivered there.
 */
export type SdaRoute = {
    /**
     * - The source chains this route accepts deposits from. A list because some
     * protocols issue one address valid across a VM family.
     */
    sourceChains: Blockchain[];
    /**
     * - The deposit tokens accepted on the source side.
     */
    inputTokens: SdaToken[];
    /**
     * - The chain the converted asset is delivered to.
     */
    destinationChain: Blockchain;
    /**
     * - The asset delivered to the destination (e.g., USDT).
     */
    outputAsset: SdaToken;
    /**
     * - Deposit limits for this route.
     */
    limits?: SdaDepositAddressLimits;
    /**
     * - Whether addresses issued for this route can receive more than one deposit.
     */
    reusable?: boolean;
    /**
     * - Typical end-to-end duration in seconds.
     */
    estimatedDuration?: number;
};
/**
 * Options for fetching a deposit quote — a non-binding estimate of what a given deposit would deliver.
 */
export type SdaDepositOptions = {
    /**
     * - The chain the deposit originates from.
     */
    sourceChain: Blockchain;
    /**
     * - The protocol identifier of the token being deposited.
     */
    inputToken: string;
    /**
     * - The chain the converted asset is delivered to.
     */
    destinationChain: Blockchain;
    /**
     * - The protocol identifier of the asset to deliver.
     */
    outputAsset: string;
    /**
     * - The amount to deposit, in the input token's base unit.
     */
    inputAmount: number | bigint;
};
/**
 * The category of a fee charged by the protocol.
 */
export type SdaFeeType = "network" | "protocol" | "affiliate" | "other";
/**
 * A single itemised fee.
 */
export type SdaFee = {
    /**
     * - The category of the fee.
     */
    type: SdaFeeType;
    /**
     * - The fee amount, in the fee token's base unit.
     */
    amount: bigint;
    /**
     * - The token in which the fee is denominated.
     */
    token: string;
    /**
     * - The chain on which the fee is charged.
     */
    chain?: Blockchain;
    /**
     * - Whether the fee is already reflected in the quoted output amount.
     */
    included?: boolean;
    /**
     * - A human-readable description of the fee.
     */
    description?: string;
};
/**
 * A non-binding estimate of the asset delivered for a given deposit.
 */
export type SdaDepositQuote = {
    /**
     * - The chain the deposit originates from.
     */
    inputChain: Blockchain;
    /**
     * - The protocol identifier of the deposited token.
     */
    inputToken: string;
    /**
     * - The amount deposited, in the input token's base unit.
     */
    inputAmount: bigint;
    /**
     * - The chain the converted asset is delivered to.
     */
    destinationChain: Blockchain;
    /**
     * - The protocol identifier of the delivered asset.
     */
    outputAsset: string;
    /**
     * - The estimated amount delivered, in the destination asset's base unit.
     */
    outputAmount: bigint;
    /**
     * - Itemised fee breakdown.
     */
    fees: SdaFee[];
    /**
     * - The effective conversion rate as a string, to avoid precision loss.
     */
    rate?: string;
    /**
     * - Unix timestamp (seconds) at which the quote expires.
     */
    expiry?: number;
    /**
     * - The protocol quote identifier, if the protocol issues one.
     */
    id?: string;
};
/**
 * Options for creating a deposit address.
 */
export type SdaCreateDepositAddressOptions = {
    /**
     * - One or more source chains the address should accept deposits from. Protocols
     * that issue one address per VM family use the full list; single-chain protocols use a one-element list.
     */
    sourceChains: Blockchain[];
    /**
     * - The chain the converted asset is delivered to.
     */
    destinationChain: Blockchain;
    /**
     * - The protocol identifier of the asset to deliver (e.g., USDT).
     */
    outputAsset: string;
    /**
     * - The address that receives the delivered asset. Defaults to the bound
     * account's address.
     */
    destinationAddress?: string;
};
/**
 * A deposit address plus its normalized descriptor: where it accepts deposits from, what it accepts, where it
 * delivers, and its lifecycle metadata.
 */
export type SdaDepositAddress = {
    /**
     * - The deposit address the user sends funds to.
     */
    address: string;
    /**
     * - The protocol identifier for this SDA, used for status, recovery and disabling.
     */
    id: string;
    /**
     * - The chains this address accepts deposits from.
     */
    sourceChains: Blockchain[];
    /**
     * - The tokens this address accepts.
     */
    supportedInputTokens: SdaToken[];
    /**
     * - The chain the converted asset is delivered to.
     */
    destinationChain: Blockchain;
    /**
     * - The asset delivered to the destination.
     */
    outputAsset: SdaToken;
    /**
     * - The resolved address that receives the delivered asset.
     */
    destinationAddress: string;
    /**
     * - Deposit limits for this address.
     */
    limits?: SdaDepositAddressLimits;
    /**
     * - Whether the address can receive more than one deposit.
     */
    reusable: boolean;
    /**
     * - Unix timestamp (seconds) at which the address's activation expires, when the protocol's
     * address activation is time-limited.
     */
    expiry?: number;
};
/**
 * The lifecycle status of a deposit/transfer through an SDA.
 */
export type SdaTransferStatus = "pending" | "detected" | "processing" | "completed" | "failed" | "refund-pending" | "refunded" | "expired";
/**
 * A single deposit observed at, and processed through, an SDA.
 */
export type SdaTransfer = {
    /**
     * - The protocol identifier for this transfer.
     */
    id: string;
    /**
     * - The current status of the transfer.
     */
    status: SdaTransferStatus;
};
/**
 * Optional pagination/filtering for transfer history.
 */
export type SdaTransfersOptions = {
    /**
     * - The source chain of the deposit address, required by protocols that key
     * addresses by (address, chain).
     */
    sourceChain?: Blockchain;
    /**
     * - The maximum number of transfers to return.
     */
    limit?: number;
    /**
     * - The number of transfers to skip, for offset-based pagination.
     */
    skip?: number;
    /**
     * - Restrict to transfers in this status.
     */
    status?: SdaTransferStatus;
};
/**
 * Recover a deposit by the SDA identifier.
 */
export type SdaRecoverById = {
    /**
     * - The protocol SDA identifier (the `SdaDepositAddress.id`).
     */
    id: string;
};
/**
 * Recover a deposit by its deposit address.
 */
export type SdaRecoverByAddress = {
    /**
     * - The deposit address to reindex.
     */
    address: string;
    /**
     * - The chain of the deposit address, required by protocols that key addresses by
     * (address, chain).
     */
    sourceChain?: Blockchain;
};
/**
 * Options for re-processing a deposit that was not picked up automatically (`reindex`). A caller identifies the
 * deposit either by SDA id or by its deposit address.
 */
export type SdaRecoveryOptions = SdaRecoverById | SdaRecoverByAddress;
/**
 * The outcome of a recovery attempt.
 */
export type SdaRecoveryResult = {
    /**
     * - The result of the reindex attempt.
     */
    status: "reindexed" | "pending" | "failed";
    /**
     * - The address that was reindexed.
     */
    address?: string;
    /**
     * - The protocol SDA identifier.
     */
    id?: string;
    /**
     * - The transfer that was recovered, if one resulted.
     */
    transfer?: SdaTransfer;
    /**
     * - A human-readable description of the outcome.
     */
    message?: string;
};
