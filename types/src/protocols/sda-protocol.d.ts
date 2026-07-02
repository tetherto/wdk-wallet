/** @typedef {import('../wallet-account-read-only.js').IWalletAccountReadOnly} IWalletAccountReadOnly */
/** @typedef {import('../wallet-account.js').IWalletAccount} IWalletAccount */
/**
 * A blockchain identifier: a numeric chain id (e.g. `1`) or a provider-specific
 * chain name (e.g. `'ethereum'`).
 *
 * @typedef {string | number} Blockchain
 */
/**
 * Describes which optional parts of the SDA interface a provider implements, so
 * consumers can adapt their UI/flow without trial-and-error. The required core
 * (`getSupportedRoutes`, `createDepositAddress`) is always available and
 * therefore not listed here.
 *
 * @typedef {Object} SdaCapabilities
 * @property {boolean} quoting - Whether {@link ISdaProtocol#quoteDeposit} is supported.
 * @property {boolean} quoteRequired - Whether a quote must be fetched (via {@link ISdaProtocol#quoteDeposit}) and passed to {@link ISdaProtocol#createDepositAddress} via `options.quote` before an address can be issued (e.g., Relay, whose deposit address is bound to a quote/amount).
 * @property {boolean} reusableAddresses - Whether issued addresses can receive more than one deposit.
 * @property {boolean} multiChainAddress - Whether a single address is valid across several source chains of the same VM family.
 * @property {SdaCustodyModel} custodyModel - Who controls deposited funds while in flight: `'trusted-operator'` (the provider holds the address and funds) or `'self-custodial'` (the address is an on-chain contract with withdrawal rights fixed in code, so funds are recoverable on-chain without the provider).
 * @property {boolean} clientDerivableAddress - Whether the deposit address is deterministically derivable and verifiable client-side, before any provider call (via {@link ISdaProtocol#deriveDepositAddress}).
 * @property {SdaActivationModel} activation - The address activation lifecycle: `'none'` (live as soon as it is created), `'required'` (must be activated before the provider monitors it), or `'ttl'` (activation expires and must be refreshed via {@link ISdaProtocol#renewDepositAddress}).
 * @property {SdaRouteDiscoveryMode} routeDiscovery - How routes can be listed: `'full'` (all routes returnable with no filters) or `'by-chain-pair'` (a source and destination chain must be supplied to {@link ISdaProtocol#getSupportedRoutes}).
 * @property {boolean} getAddress - Whether {@link ISdaProtocol#getDepositAddress} (look up an existing SDA) is supported.
 * @property {boolean} transferStatus - Whether {@link ISdaProtocol#getTransferStatus} (status by transfer id) is supported.
 * @property {boolean} historyByAddress - Whether {@link ISdaProtocol#getDepositAddressTransfers} (pull-based deposit history, keyed by deposit address) is supported. Push-only providers (webhook-based) report `false`.
 * @property {boolean} historyByRecipient - Whether {@link ISdaProtocol#getTransfersByRecipient} (history aggregated by recipient across all of that user's deposit addresses and source chains) is supported.
 * @property {SdaRecoveryMode} recovery - How the provider re-processes a missed/undetected deposit (see {@link ISdaProtocol#recoverDepositAddress}): `'reindex'` or `'none'`. This describes provider-side reprocessing only — it does NOT say whether deposited funds can be recovered; that is governed by {@link SdaCapabilities#custodyModel} (a `'self-custodial'` provider's funds are recoverable on-chain even when `recovery` is `'none'`). Keep-alive of an expired address is the activation lifecycle (`activation: 'ttl'`), not recovery.
 * @property {boolean} disableAddress - Whether {@link ISdaProtocol#disableDepositAddress} is supported.
 * @property {boolean} refund - Whether the provider honours a `refundAddress`.
 */
/**
 * How a provider re-processes a deposit that was not picked up automatically.
 * `reindex` re-scans a known source transaction (Orchestra, Relay); `none` means
 * no such call is exposed. This is about provider-side reprocessing of a missed
 * deposit, not about fund custody — whether deposited funds are recoverable is
 * governed by {@link SdaCapabilities#custodyModel}. Re-enabling an idle/expired
 * address is the activation lifecycle ({@link SdaActivationModel} `'ttl'` +
 * {@link ISdaProtocol#renewDepositAddress}), not recovery.
 *
 * @typedef {'reindex' | 'none'} SdaRecoveryMode
 */
/**
 * The activation lifecycle of a deposit address. `'none'` — the address is live
 * as soon as it is created. `'required'` — the address must be activated (so the
 * provider starts monitoring it) before it can receive deposits. `'ttl'` —
 * activation expires and must be refreshed via {@link ISdaProtocol#renewDepositAddress}.
 *
 * @typedef {'none' | 'required' | 'ttl'} SdaActivationModel
 */
/**
 * Who controls deposited funds while a deposit is in flight. `'trusted-operator'`
 * — the provider holds the deposit address and the funds (recovery means asking
 * the provider to reprocess). `'self-custodial'` — the address is an on-chain
 * contract whose withdrawal rights are fixed in code (e.g. the recipient can
 * withdraw immediately, an optional custodial withdrawer only after a timelock),
 * so funds are recoverable on-chain without the provider.
 *
 * @typedef {'self-custodial' | 'trusted-operator'} SdaCustodyModel
 */
/**
 * How a provider lets routes be discovered. `'full'` means
 * {@link ISdaProtocol#getSupportedRoutes} returns every route with no filters;
 * `'by-chain-pair'` means a source and destination chain must be supplied.
 *
 * @typedef {'full' | 'by-chain-pair'} SdaRouteDiscoveryMode
 */
/**
 * Connection and default settings shared by every SDA provider. Concrete
 * providers extend this with their own fields (endpoints, credentials, etc.).
 *
 * @typedef {Object} SdaProtocolConfig
 * @property {string} [apiUrl] - Overrides the provider's API base URL.
 * @property {string} [apiKey] - Provider API key or credentials, when required.
 * @property {string} [defaultRefundAddress] - Refund address used when a call omits one.
 */
/**
 * A normalized, protocol-agnostic token reference. `token` is the identifier
 * the provider expects in SDA calls; `address` is the on-chain contract address
 * when applicable (absent for native gas tokens).
 *
 * @typedef {Object} SdaToken
 * @property {string} token - The provider-specific token identifier to use in SDA calls.
 * @property {Blockchain} chain - The chain on which the token lives.
 * @property {string} symbol - The token symbol (e.g., 'USDC', 'USDT').
 * @property {number} decimals - The number of decimal places for the token's base unit.
 * @property {string} [address] - The token contract address, if applicable.
 * @property {string} [name] - The token's full name.
 */
/**
 * Per-route deposit limits, denominated in the base unit of the route's input
 * token. Either bound may be absent when the provider does not enforce it.
 *
 * @typedef {Object} SdaLimits
 * @property {bigint} [min] - Minimum deposit amount, in the input token's base unit.
 * @property {bigint} [max] - Maximum deposit amount, in the input token's base unit.
 */
/**
 * Optional filters for narrowing route discovery.
 *
 * @typedef {Object} SdaRoutesOptions
 * @property {Blockchain} [sourceChain] - Restrict to routes that accept deposits from this chain.
 * @property {string} [sourceToken] - Restrict to routes that accept this input token.
 * @property {Blockchain} [destinationChain] - Restrict to routes that deliver to this chain.
 * @property {string} [destinationAsset] - Restrict to routes that deliver this asset.
 */
/**
 * A supported conversion route: one or more source chains and their accepted
 * input tokens, the destination chain, and the asset delivered there.
 *
 * @typedef {Object} SdaRoute
 * @property {Blockchain[]} sourceChains - The source chains this route accepts deposits from. A list because some providers issue one address valid across a VM family.
 * @property {SdaToken[]} inputTokens - The deposit tokens accepted on the source side.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {SdaToken} destinationAsset - The asset delivered to the destination (e.g., USDT).
 * @property {SdaLimits} [limits] - Deposit limits for this route.
 * @property {boolean} [reusable] - Whether addresses issued for this route can receive more than one deposit.
 * @property {number} [estimatedDuration] - Typical end-to-end duration in seconds.
 */
/**
 * Options for fetching a deposit quote. Required up front by providers whose
 * addresses are bound to a quote (e.g., Rhino); optional otherwise.
 *
 * @typedef {Object} SdaQuoteOptions
 * @property {Blockchain} sourceChain - The chain the deposit originates from.
 * @property {string} inputToken - The provider identifier of the token being deposited.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {string} destinationAsset - The provider identifier of the asset to deliver.
 * @property {number | bigint} inputAmount - The amount to deposit, in the input token's base unit.
 */
/**
 * The category of a fee charged by the provider.
 *
 * @typedef {'network' | 'protocol' | 'affiliate' | 'other'} SdaFeeType
 */
/**
 * A single itemised fee.
 *
 * @typedef {Object} SdaFee
 * @property {SdaFeeType} type - The category of the fee.
 * @property {bigint} amount - The fee amount, in the fee token's base unit.
 * @property {string} token - The token in which the fee is denominated.
 * @property {Blockchain} [chain] - The chain on which the fee is charged.
 * @property {boolean} [included] - Whether the fee is already reflected in the quoted output amount.
 * @property {string} [description] - A human-readable description of the fee.
 */
/**
 * A non-binding estimate of the asset delivered for a given deposit. Some
 * providers return an `id` that must be passed to {@link ISdaProtocol#createDepositAddress}
 * to bind the address to this quote.
 *
 * @typedef {Object} SdaQuote
 * @property {Blockchain} inputChain - The chain the deposit originates from.
 * @property {string} inputToken - The provider identifier of the deposited token.
 * @property {bigint} inputAmount - The amount deposited, in the input token's base unit.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {string} destinationAsset - The provider identifier of the delivered asset.
 * @property {bigint} outputAmount - The estimated amount delivered, in the destination asset's base unit.
 * @property {SdaFee[]} fees - Itemised fee breakdown.
 * @property {string} [rate] - The effective conversion rate as a string, to avoid precision loss.
 * @property {number} [expiry] - Unix timestamp (seconds) at which the quote expires.
 * @property {string} [id] - The provider quote identifier, when an address must be bound to this quote.
 */
/**
 * Options for creating a deposit address.
 *
 * @typedef {Object} SdaCreateOptions
 * @property {Blockchain[]} sourceChains - One or more source chains the address should accept deposits from. Providers that issue one address per VM family use the full list; single-chain providers use a one-element list.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {string} destinationAsset - The provider identifier of the asset to deliver (e.g., USDT).
 * @property {string} [destinationAddress] - The address that receives the delivered asset. Defaults to the bound account's address.
 * @property {string} [inputToken] - The expected input token, when the provider needs it declared up front.
 * @property {string} [refundAddress] - The address that receives refunds if a deposit cannot be processed (push-refund style).
 * @property {Record<string, unknown>} [derivation] - Provider-specific inputs a self-custodial / client-derivable provider folds into the deposit-address derivation (e.g. a custodial withdrawer, salt, or execution parameters). The interface passes this through untyped; each provider documents its own shape. Distinct from `refundAddress` (push-refund) — these inputs change the resulting address.
 * @property {boolean} [reusable] - Request a reusable address (when the provider supports both modes).
 * @property {SdaQuote | string} [quote] - A pre-fetched quote (or quote id) to bind the address to, for providers that require it.
 */
/**
 * A deposit address plus its normalized descriptor: where it accepts deposits
 * from, what it accepts, where it delivers, and its lifecycle metadata.
 *
 * @typedef {Object} SdaDepositAddress
 * @property {string} address - The deposit address the user sends funds to.
 * @property {string} [id] - The provider identifier for this SDA, used for status, recovery and disabling.
 * @property {Blockchain[]} sourceChains - The chains this address accepts deposits from.
 * @property {SdaToken[]} supportedInputTokens - The tokens this address accepts.
 * @property {Blockchain} destinationChain - The chain the converted asset is delivered to.
 * @property {SdaToken} destinationAsset - The asset delivered to the destination.
 * @property {string} destinationAddress - The resolved address that receives the delivered asset.
 * @property {SdaQuote} [quote] - The quote bound to this address, if any.
 * @property {SdaLimits} [limits] - Deposit limits for this address.
 * @property {boolean} reusable - Whether the address can receive more than one deposit.
 * @property {string} [refundAddress] - The refund address bound to this address.
 * @property {number} [expiry] - Unix timestamp (seconds) at which the address's activation expires, when {@link SdaCapabilities#activation} is `'ttl'`.
 * @property {Record<string, unknown>} [derivation] - The provider-specific derivation inputs this address was created from (echoed back), so a `clientDerivableAddress` provider can re-derive, verify or recover the address later.
 */
/**
 * The lifecycle status of a deposit/transfer through an SDA.
 *
 * @typedef {'pending' | 'detected' | 'processing' | 'completed' | 'failed'
 *          | 'refund-pending' | 'refunded' | 'expired'} SdaTransferStatus
 */
/**
 * A single deposit observed at, and processed through, an SDA.
 *
 * @typedef {Object} SdaTransfer
 * @property {string} id - The provider identifier for this transfer.
 * @property {string} [depositAddress] - The SDA the deposit was sent to, when known (a status-by-id lookup may not return it).
 * @property {SdaTransferStatus} status - The current status of the transfer.
 * @property {SdaToken} [inputToken] - The token that was deposited.
 * @property {bigint} [inputAmount] - The amount deposited, in the input token's base unit.
 * @property {SdaToken} [destinationAsset] - The asset delivered to the destination.
 * @property {bigint} [outputAmount] - The amount delivered, in the destination asset's base unit.
 * @property {string} [sourceTxHash] - The hash of the deposit transaction on the source chain.
 * @property {string} [destinationTxHash] - The hash of the delivery transaction on the destination chain.
 * @property {SdaFee[]} [fees] - Itemised fees applied to this transfer.
 * @property {number} [createdAt] - Unix timestamp (seconds) when the transfer was first observed.
 * @property {number} [updatedAt] - Unix timestamp (seconds) when the transfer was last updated.
 */
/**
 * Optional pagination/filtering for transfer history.
 *
 * @typedef {Object} SdaTransfersOptions
 * @property {Blockchain} [sourceChain] - The source chain of the deposit address, required by providers that key addresses by (address, chain).
 * @property {number} [limit] - The maximum number of transfers to return.
 * @property {string} [cursor] - An opaque pagination cursor returned by a previous call.
 * @property {SdaTransferStatus} [status] - Restrict to transfers in this status.
 */
/**
 * Options for re-processing a deposit that was not picked up automatically
 * (`reindex`). Callers supply whatever the provider needs — typically the source
 * transaction, or the deposit address / SDA id.
 *
 * @typedef {Object} SdaRecoveryOptions
 * @property {string} [address] - The deposit address to reindex.
 * @property {string} [id] - The provider SDA identifier.
 * @property {string} [sourceTxHash] - The deposit transaction to re-index.
 * @property {Blockchain} [sourceChain] - The chain of the deposit transaction.
 */
/**
 * The outcome of a recovery attempt.
 *
 * @typedef {Object} SdaRecoveryResult
 * @property {'reindexed' | 'pending' | 'failed'} status - The result of the reindex attempt.
 * @property {string} [address] - The address that was reindexed.
 * @property {string} [id] - The provider SDA identifier.
 * @property {SdaTransfer} [transfer] - The transfer that was recovered, if one resulted.
 * @property {string} [message] - A human-readable description of the outcome.
 */
/**
 * Interface for "Smart Deposit Address" (SDA) providers: services that issue a
 * deposit address, accept a stablecoin (or native token) from a supported
 * source chain, convert it, and deliver a chosen asset (e.g., USDT) to a chosen
 * destination chain and address.
 *
 * The required core every provider implements is route discovery and address
 * creation. Everything else is optional and advertised through
 * {@link ISdaProtocol#getCapabilities}.
 *
 * @interface
 */
export class ISdaProtocol {
    /**
     * Returns which optional parts of the interface this provider implements.
     *
     * @returns {SdaCapabilities} The provider's capabilities.
     */
    getCapabilities(): SdaCapabilities;
    /**
     * Lists the conversion routes the provider supports: source chains, accepted
     * input tokens, destination assets and per-route deposit limits. When
     * {@link SdaCapabilities#routeDiscovery} is `'by-chain-pair'`, `sourceChain`
     * and `destinationChain` must be supplied.
     *
     * @param {SdaRoutesOptions} [options] - Optional filters for route discovery.
     * @returns {Promise<SdaRoute[]>} The supported routes.
     * @throws {Error} If {@link SdaCapabilities#routeDiscovery} is `'by-chain-pair'` and `sourceChain` or `destinationChain` is missing.
     */
    getSupportedRoutes(options?: SdaRoutesOptions): Promise<SdaRoute[]>;
    /**
     * Fetches a non-binding quote for a deposit. Optional: only supported when
     * {@link SdaCapabilities#quoting} is `true`, and required up front when
     * {@link SdaCapabilities#quoteRequired} is `true`.
     *
     * @param {SdaQuoteOptions} options - The quote options.
     * @returns {Promise<SdaQuote>} The quoted deposit details.
     * @throws {NotImplementedError} If this provider does not support quoting (check `getCapabilities().quoting`).
     */
    quoteDeposit(options: SdaQuoteOptions): Promise<SdaQuote>;
    /**
     * Creates deposit addresses for the given route and destination, ready to
     * receive per the provider's {@link SdaCapabilities#activation} model (for a
     * `'required'` / `'ttl'` provider this also activates the address so it is
     * monitored). Returns one entry per distinct address: a provider that issues a
     * single address across a chain family returns one entry covering all of
     * `sourceChains`, while a provider that issues one address per source chain
     * returns one entry each.
     *
     * @param {SdaCreateOptions} options - The address creation options.
     * @returns {Promise<SdaDepositAddress[]>} The created deposit addresses, one per distinct address.
     */
    createDepositAddress(options: SdaCreateOptions): Promise<SdaDepositAddress[]>;
    /**
     * Derives a deposit address client-side, without any provider call and
     * without activating or monitoring it — used to verify (derive + compare) or
     * recover an address for a self-custodial provider. Optional: only supported
     * when {@link SdaCapabilities#clientDerivableAddress} is `true`.
     *
     * @param {SdaCreateOptions} options - The same options passed to {@link ISdaProtocol#createDepositAddress}; the provider-specific `derivation` inputs are folded into the result.
     * @returns {Promise<string>} The derived deposit address.
     * @throws {NotImplementedError} If this provider does not support client-side derivation (check `getCapabilities().clientDerivableAddress`).
     */
    deriveDepositAddress(options: SdaCreateOptions): Promise<string>;
    /**
     * Looks up an existing deposit address by its identifier — the
     * `SdaDepositAddress.id` returned by {@link ISdaProtocol#createDepositAddress},
     * which round-trips any chain context the provider needs. Optional:
     * only supported when {@link SdaCapabilities#getAddress} is `true`.
     *
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain context the provider needs).
     * @returns {Promise<SdaDepositAddress>} The deposit address descriptor.
     * @throws {NotImplementedError} If this provider does not support address lookup (check `getCapabilities().getAddress`).
     * @throws {Error} If no such address exists.
     */
    getDepositAddress(id: string): Promise<SdaDepositAddress>;
    /**
     * Refreshes the activation of a deposit address so the provider keeps
     * monitoring it. Optional: only relevant when {@link SdaCapabilities#activation}
     * is `'ttl'`.
     *
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id`.
     * @returns {Promise<SdaDepositAddress>} The refreshed deposit address descriptor (with the new `expiry`).
     * @throws {NotImplementedError} If this provider does not use activation TTLs (check `getCapabilities().activation`).
     */
    renewDepositAddress(id: string): Promise<SdaDepositAddress>;
    /**
     * Lists the deposits observed at a deposit address. Optional: only supported
     * when {@link SdaCapabilities#historyByAddress} is `true`.
     *
     * @param {string} address - The deposit address to list transfers for.
     * @param {SdaTransfersOptions} [options] - Optional pagination/filtering, plus `sourceChain` for providers that key addresses by (address, chain).
     * @returns {Promise<SdaTransfer[]>} The transfers for the address.
     * @throws {NotImplementedError} If this provider does not support pull-based history (check `getCapabilities().historyByAddress`).
     */
    getDepositAddressTransfers(address: string, options?: SdaTransfersOptions): Promise<SdaTransfer[]>;
    /**
     * Lists transfers aggregated by recipient — every deposit routed to the given
     * recipient across all of that recipient's deposit addresses and source
     * chains. Optional: only supported when {@link SdaCapabilities#historyByRecipient}
     * is `true`.
     *
     * @param {string} recipient - The recipient (destination) address to aggregate transfers for.
     * @param {Blockchain} destinationChain - The destination chain the transfers are delivered to.
     * @param {SdaTransfersOptions} [options] - Optional pagination/filtering.
     * @returns {Promise<SdaTransfer[]>} The transfers routed to the recipient.
     * @throws {NotImplementedError} If this provider does not support recipient-keyed history (check `getCapabilities().historyByRecipient`).
     */
    getTransfersByRecipient(recipient: string, destinationChain: Blockchain, options?: SdaTransfersOptions): Promise<SdaTransfer[]>;
    /**
     * Retrieves the status of a single transfer by its identifier. Optional:
     * only supported when {@link SdaCapabilities#transferStatus} is `true`.
     *
     * @param {string} id - The transfer identifier.
     * @returns {Promise<SdaTransfer>} The transfer's current status.
     * @throws {NotImplementedError} If this provider does not support transfer-status lookup (check `getCapabilities().transferStatus`).
     * @throws {Error} If no such transfer exists.
     */
    getTransferStatus(id: string): Promise<SdaTransfer>;
    /**
     * Recovers a deposit or address that was not picked up automatically, using
     * the provider's recovery mode (see {@link SdaCapabilities#recovery}).
     * Optional: only supported when `recovery` is not `'none'`.
     *
     * @param {SdaRecoveryOptions} options - The recovery options.
     * @returns {Promise<SdaRecoveryResult>} The recovery outcome.
     * @throws {NotImplementedError} If this provider does not support recovery (check `getCapabilities().recovery`).
     */
    recoverDepositAddress(options: SdaRecoveryOptions): Promise<SdaRecoveryResult>;
    /**
     * Disables a deposit address so it no longer accepts deposits. Optional:
     * only supported when {@link SdaCapabilities#disableAddress} is `true`.
     *
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain context the provider needs).
     * @returns {Promise<void>} Resolves once the address has been disabled.
     * @throws {NotImplementedError} If this provider does not support disabling addresses (check `getCapabilities().disableAddress`).
     */
    disableDepositAddress(id: string): Promise<void>;
}
/**
 * Abstract base class for "Smart Deposit Address" (SDA) providers. Concrete
 * providers extend this and implement the provider-specific calls.
 *
 * @abstract
 * @implements {ISdaProtocol}
 */
export default class SdaProtocol implements ISdaProtocol {
    /**
     * Creates a new SDA protocol without binding it to a wallet account.
     *
     * @overload
     * @param {undefined} [account] - The wallet account to use to interact with the protocol.
     * @param {SdaProtocolConfig} [config] - The SDA protocol configuration.
     */
    constructor(account?: undefined, config?: SdaProtocolConfig);
    /**
     * Creates a new read-only SDA protocol.
     *
     * @overload
     * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
     * @param {SdaProtocolConfig} [config] - The SDA protocol configuration.
     */
    constructor(account: IWalletAccountReadOnly, config?: SdaProtocolConfig);
    /**
     * Creates a new SDA protocol.
     *
     * @overload
     * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
     * @param {SdaProtocolConfig} [config] - The SDA protocol configuration.
     */
    constructor(account: IWalletAccount, config?: SdaProtocolConfig);
    /**
     * The wallet account to use to interact with the protocol. The account's
     * address is the default delivery destination for created addresses.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount | undefined}
     */
    protected _account: IWalletAccountReadOnly | IWalletAccount | undefined;
    /**
     * The SDA protocol configuration.
     *
     * @protected
     * @type {SdaProtocolConfig}
     */
    protected _config: SdaProtocolConfig;
    /**
     * Returns which optional parts of the interface this provider implements.
     *
     * @abstract
     * @returns {SdaCapabilities} The provider's capabilities.
     */
    getCapabilities(): SdaCapabilities;
    /**
     * Lists the conversion routes the provider supports: source chains, accepted
     * input tokens, destination assets and per-route deposit limits. When
     * {@link SdaCapabilities#routeDiscovery} is `'by-chain-pair'`, `sourceChain`
     * and `destinationChain` must be supplied.
     *
     * @abstract
     * @param {SdaRoutesOptions} [options] - Optional filters for route discovery.
     * @returns {Promise<SdaRoute[]>} The supported routes.
     * @throws {Error} If {@link SdaCapabilities#routeDiscovery} is `'by-chain-pair'` and `sourceChain` or `destinationChain` is missing.
     */
    getSupportedRoutes(options?: SdaRoutesOptions): Promise<SdaRoute[]>;
    /**
     * Fetches a non-binding quote for a deposit. Optional: only supported when
     * {@link SdaCapabilities#quoting} is `true`, and required up front when
     * {@link SdaCapabilities#quoteRequired} is `true`.
     *
     * @abstract
     * @param {SdaQuoteOptions} options - The quote options.
     * @returns {Promise<SdaQuote>} The quoted deposit details.
     * @throws {NotImplementedError} If this provider does not support quoting (check `getCapabilities().quoting`).
     */
    quoteDeposit(options: SdaQuoteOptions): Promise<SdaQuote>;
    /**
     * Creates deposit addresses for the given route and destination, ready to
     * receive per the provider's {@link SdaCapabilities#activation} model (for a
     * `'required'` / `'ttl'` provider this also activates the address so it is
     * monitored). Returns one entry per distinct address: a provider that issues a
     * single address across a chain family returns one entry covering all of
     * `sourceChains`, while a provider that issues one address per source chain
     * returns one entry each.
     *
     * @abstract
     * @param {SdaCreateOptions} options - The address creation options.
     * @returns {Promise<SdaDepositAddress[]>} The created deposit addresses, one per distinct address.
     */
    createDepositAddress(options: SdaCreateOptions): Promise<SdaDepositAddress[]>;
    /**
     * Derives a deposit address client-side, without any provider call and
     * without activating or monitoring it — used to verify (derive + compare) or
     * recover an address for a self-custodial provider. Optional: only supported
     * when {@link SdaCapabilities#clientDerivableAddress} is `true`.
     *
     * @abstract
     * @param {SdaCreateOptions} options - The same options passed to {@link ISdaProtocol#createDepositAddress}; the provider-specific `derivation` inputs are folded into the result.
     * @returns {Promise<string>} The derived deposit address.
     * @throws {NotImplementedError} If this provider does not support client-side derivation (check `getCapabilities().clientDerivableAddress`).
     */
    deriveDepositAddress(options: SdaCreateOptions): Promise<string>;
    /**
     * Looks up an existing deposit address by its identifier — the
     * `SdaDepositAddress.id` returned by {@link ISdaProtocol#createDepositAddress},
     * which round-trips any chain context the provider needs. Optional:
     * only supported when {@link SdaCapabilities#getAddress} is `true`.
     *
     * @abstract
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain context the provider needs).
     * @returns {Promise<SdaDepositAddress>} The deposit address descriptor.
     * @throws {NotImplementedError} If this provider does not support address lookup (check `getCapabilities().getAddress`).
     * @throws {Error} If no such address exists.
     */
    getDepositAddress(id: string): Promise<SdaDepositAddress>;
    /**
     * Refreshes the activation of a deposit address so the provider keeps
     * monitoring it. Optional: only relevant when {@link SdaCapabilities#activation}
     * is `'ttl'`.
     *
     * @abstract
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id`.
     * @returns {Promise<SdaDepositAddress>} The refreshed deposit address descriptor (with the new `expiry`).
     * @throws {NotImplementedError} If this provider does not use activation TTLs (check `getCapabilities().activation`).
     */
    renewDepositAddress(id: string): Promise<SdaDepositAddress>;
    /**
     * Lists the deposits observed at a deposit address. Optional: only supported
     * when {@link SdaCapabilities#historyByAddress} is `true`.
     *
     * @abstract
     * @param {string} address - The deposit address to list transfers for.
     * @param {SdaTransfersOptions} [options] - Optional pagination/filtering, plus `sourceChain` for providers that key addresses by (address, chain).
     * @returns {Promise<SdaTransfer[]>} The transfers for the address.
     * @throws {NotImplementedError} If this provider does not support pull-based history (check `getCapabilities().historyByAddress`).
     */
    getDepositAddressTransfers(address: string, options?: SdaTransfersOptions): Promise<SdaTransfer[]>;
    /**
     * Lists transfers aggregated by recipient — every deposit routed to the given
     * recipient across all of that recipient's deposit addresses and source
     * chains. Optional: only supported when {@link SdaCapabilities#historyByRecipient}
     * is `true`.
     *
     * @abstract
     * @param {string} recipient - The recipient (destination) address to aggregate transfers for.
     * @param {Blockchain} destinationChain - The destination chain the transfers are delivered to.
     * @param {SdaTransfersOptions} [options] - Optional pagination/filtering.
     * @returns {Promise<SdaTransfer[]>} The transfers routed to the recipient.
     * @throws {NotImplementedError} If this provider does not support recipient-keyed history (check `getCapabilities().historyByRecipient`).
     */
    getTransfersByRecipient(recipient: string, destinationChain: Blockchain, options?: SdaTransfersOptions): Promise<SdaTransfer[]>;
    /**
     * Retrieves the status of a single transfer by its identifier. Optional:
     * only supported when {@link SdaCapabilities#transferStatus} is `true`.
     *
     * @abstract
     * @param {string} id - The transfer identifier.
     * @returns {Promise<SdaTransfer>} The transfer's current status.
     * @throws {NotImplementedError} If this provider does not support transfer-status lookup (check `getCapabilities().transferStatus`).
     * @throws {Error} If no such transfer exists.
     */
    getTransferStatus(id: string): Promise<SdaTransfer>;
    /**
     * Recovers a deposit or address that was not picked up automatically, using
     * the provider's recovery mode (see {@link SdaCapabilities#recovery}).
     * Optional: only supported when `recovery` is not `'none'`.
     *
     * @abstract
     * @param {SdaRecoveryOptions} options - The recovery options.
     * @returns {Promise<SdaRecoveryResult>} The recovery outcome.
     * @throws {NotImplementedError} If this provider does not support recovery (check `getCapabilities().recovery`).
     */
    recoverDepositAddress(options: SdaRecoveryOptions): Promise<SdaRecoveryResult>;
    /**
     * Disables a deposit address so it no longer accepts deposits. Optional:
     * only supported when {@link SdaCapabilities#disableAddress} is `true`.
     *
     * @abstract
     * @param {string} id - The deposit-address identifier returned in `SdaDepositAddress.id` (round-trips any chain context the provider needs).
     * @returns {Promise<void>} Resolves once the address has been disabled.
     * @throws {NotImplementedError} If this provider does not support disabling addresses (check `getCapabilities().disableAddress`).
     */
    disableDepositAddress(id: string): Promise<void>;
}
export type IWalletAccountReadOnly = import("../wallet-account-read-only.js").IWalletAccountReadOnly;
export type IWalletAccount = import("../wallet-account.js").IWalletAccount;
/**
 * A blockchain identifier: a numeric chain id (e.g. `1`) or a provider-specific
 * chain name (e.g. `'ethereum'`).
 */
export type Blockchain = string | number;
/**
 * Describes which optional parts of the SDA interface a provider implements, so
 * consumers can adapt their UI/flow without trial-and-error. The required core
 * (`getSupportedRoutes`, `createDepositAddress`) is always available and
 * therefore not listed here.
 */
export type SdaCapabilities = {
    /**
     * - Whether {@link ISdaProtocol#quoteDeposit} is supported.
     */
    quoting: boolean;
    /**
     * - Whether a quote must be fetched (via {@link ISdaProtocol#quoteDeposit}) and passed to {@link ISdaProtocol#createDepositAddress} via `options.quote` before an address can be issued (e.g., Relay, whose deposit address is bound to a quote/amount).
     */
    quoteRequired: boolean;
    /**
     * - Whether issued addresses can receive more than one deposit.
     */
    reusableAddresses: boolean;
    /**
     * - Whether a single address is valid across several source chains of the same VM family.
     */
    multiChainAddress: boolean;
    /**
     * - Who controls deposited funds while in flight: `'trusted-operator'` (the provider holds the address and funds) or `'self-custodial'` (the address is an on-chain contract with withdrawal rights fixed in code, so funds are recoverable on-chain without the provider).
     */
    custodyModel: SdaCustodyModel;
    /**
     * - Whether the deposit address is deterministically derivable and verifiable client-side, before any provider call (via {@link ISdaProtocol#deriveDepositAddress}).
     */
    clientDerivableAddress: boolean;
    /**
     * - The address activation lifecycle: `'none'` (live as soon as it is created), `'required'` (must be activated before the provider monitors it), or `'ttl'` (activation expires and must be refreshed via {@link ISdaProtocol#renewDepositAddress}).
     */
    activation: SdaActivationModel;
    /**
     * - How routes can be listed: `'full'` (all routes returnable with no filters) or `'by-chain-pair'` (a source and destination chain must be supplied to {@link ISdaProtocol#getSupportedRoutes}).
     */
    routeDiscovery: SdaRouteDiscoveryMode;
    /**
     * - Whether {@link ISdaProtocol#getDepositAddress} (look up an existing SDA) is supported.
     */
    getAddress: boolean;
    /**
     * - Whether {@link ISdaProtocol#getTransferStatus} (status by transfer id) is supported.
     */
    transferStatus: boolean;
    /**
     * - Whether {@link ISdaProtocol#getDepositAddressTransfers} (pull-based deposit history, keyed by deposit address) is supported. Push-only providers (webhook-based) report `false`.
     */
    historyByAddress: boolean;
    /**
     * - Whether {@link ISdaProtocol#getTransfersByRecipient} (history aggregated by recipient across all of that user's deposit addresses and source chains) is supported.
     */
    historyByRecipient: boolean;
    /**
     * - How the provider re-processes a missed/undetected deposit (see {@link ISdaProtocol#recoverDepositAddress}): `'reindex'` or `'none'`. This describes provider-side reprocessing only — it does NOT say whether deposited funds can be recovered; that is governed by {@link SdaCapabilities#custodyModel} (a `'self-custodial'` provider's funds are recoverable on-chain even when `recovery` is `'none'`). Keep-alive of an expired address is the activation lifecycle (`activation: 'ttl'`), not recovery.
     */
    recovery: SdaRecoveryMode;
    /**
     * - Whether {@link ISdaProtocol#disableDepositAddress} is supported.
     */
    disableAddress: boolean;
    /**
     * - Whether the provider honours a `refundAddress`.
     */
    refund: boolean;
};
/**
 * How a provider re-processes a deposit that was not picked up automatically.
 * `reindex` re-scans a known source transaction (Orchestra, Relay); `none` means
 * no such call is exposed. This is about provider-side reprocessing of a missed
 * deposit, not about fund custody — whether deposited funds are recoverable is
 * governed by {@link SdaCapabilities#custodyModel}. Re-enabling an idle/expired
 * address is the activation lifecycle ({@link SdaActivationModel} `'ttl'` +
 * {@link ISdaProtocol#renewDepositAddress}), not recovery.
 */
export type SdaRecoveryMode = "reindex" | "none";
/**
 * The activation lifecycle of a deposit address. `'none'` — the address is live
 * as soon as it is created. `'required'` — the address must be activated (so the
 * provider starts monitoring it) before it can receive deposits. `'ttl'` —
 * activation expires and must be refreshed via {@link ISdaProtocol#renewDepositAddress}.
 */
export type SdaActivationModel = "none" | "required" | "ttl";
/**
 * Who controls deposited funds while a deposit is in flight. `'trusted-operator'`
 * — the provider holds the deposit address and the funds (recovery means asking
 * the provider to reprocess). `'self-custodial'` — the address is an on-chain
 * contract whose withdrawal rights are fixed in code (e.g. the recipient can
 * withdraw immediately, an optional custodial withdrawer only after a timelock),
 * so funds are recoverable on-chain without the provider.
 */
export type SdaCustodyModel = "self-custodial" | "trusted-operator";
/**
 * How a provider lets routes be discovered. `'full'` means
 * {@link ISdaProtocol#getSupportedRoutes} returns every route with no filters;
 * `'by-chain-pair'` means a source and destination chain must be supplied.
 */
export type SdaRouteDiscoveryMode = "full" | "by-chain-pair";
/**
 * Connection and default settings shared by every SDA provider. Concrete
 * providers extend this with their own fields (endpoints, credentials, etc.).
 */
export type SdaProtocolConfig = {
    /**
     * - Overrides the provider's API base URL.
     */
    apiUrl?: string;
    /**
     * - Provider API key or credentials, when required.
     */
    apiKey?: string;
    /**
     * - Refund address used when a call omits one.
     */
    defaultRefundAddress?: string;
};
/**
 * A normalized, protocol-agnostic token reference. `token` is the identifier
 * the provider expects in SDA calls; `address` is the on-chain contract address
 * when applicable (absent for native gas tokens).
 */
export type SdaToken = {
    /**
     * - The provider-specific token identifier to use in SDA calls.
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
 * Per-route deposit limits, denominated in the base unit of the route's input
 * token. Either bound may be absent when the provider does not enforce it.
 */
export type SdaLimits = {
    /**
     * - Minimum deposit amount, in the input token's base unit.
     */
    min?: bigint;
    /**
     * - Maximum deposit amount, in the input token's base unit.
     */
    max?: bigint;
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
    destinationAsset?: string;
};
/**
 * A supported conversion route: one or more source chains and their accepted
 * input tokens, the destination chain, and the asset delivered there.
 */
export type SdaRoute = {
    /**
     * - The source chains this route accepts deposits from. A list because some providers issue one address valid across a VM family.
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
    destinationAsset: SdaToken;
    /**
     * - Deposit limits for this route.
     */
    limits?: SdaLimits;
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
 * Options for fetching a deposit quote. Required up front by providers whose
 * addresses are bound to a quote (e.g., Rhino); optional otherwise.
 */
export type SdaQuoteOptions = {
    /**
     * - The chain the deposit originates from.
     */
    sourceChain: Blockchain;
    /**
     * - The provider identifier of the token being deposited.
     */
    inputToken: string;
    /**
     * - The chain the converted asset is delivered to.
     */
    destinationChain: Blockchain;
    /**
     * - The provider identifier of the asset to deliver.
     */
    destinationAsset: string;
    /**
     * - The amount to deposit, in the input token's base unit.
     */
    inputAmount: number | bigint;
};
/**
 * The category of a fee charged by the provider.
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
 * A non-binding estimate of the asset delivered for a given deposit. Some
 * providers return an `id` that must be passed to {@link ISdaProtocol#createDepositAddress}
 * to bind the address to this quote.
 */
export type SdaQuote = {
    /**
     * - The chain the deposit originates from.
     */
    inputChain: Blockchain;
    /**
     * - The provider identifier of the deposited token.
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
     * - The provider identifier of the delivered asset.
     */
    destinationAsset: string;
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
     * - The provider quote identifier, when an address must be bound to this quote.
     */
    id?: string;
};
/**
 * Options for creating a deposit address.
 */
export type SdaCreateOptions = {
    /**
     * - One or more source chains the address should accept deposits from. Providers that issue one address per VM family use the full list; single-chain providers use a one-element list.
     */
    sourceChains: Blockchain[];
    /**
     * - The chain the converted asset is delivered to.
     */
    destinationChain: Blockchain;
    /**
     * - The provider identifier of the asset to deliver (e.g., USDT).
     */
    destinationAsset: string;
    /**
     * - The address that receives the delivered asset. Defaults to the bound account's address.
     */
    destinationAddress?: string;
    /**
     * - The expected input token, when the provider needs it declared up front.
     */
    inputToken?: string;
    /**
     * - The address that receives refunds if a deposit cannot be processed (push-refund style).
     */
    refundAddress?: string;
    /**
     * - Provider-specific inputs a self-custodial / client-derivable provider folds into the deposit-address derivation (e.g. a custodial withdrawer, salt, or execution parameters). The interface passes this through untyped; each provider documents its own shape. Distinct from `refundAddress` (push-refund) — these inputs change the resulting address.
     */
    derivation?: Record<string, unknown>;
    /**
     * - Request a reusable address (when the provider supports both modes).
     */
    reusable?: boolean;
    /**
     * - A pre-fetched quote (or quote id) to bind the address to, for providers that require it.
     */
    quote?: SdaQuote | string;
};
/**
 * A deposit address plus its normalized descriptor: where it accepts deposits
 * from, what it accepts, where it delivers, and its lifecycle metadata.
 */
export type SdaDepositAddress = {
    /**
     * - The deposit address the user sends funds to.
     */
    address: string;
    /**
     * - The provider identifier for this SDA, used for status, recovery and disabling.
     */
    id?: string;
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
    destinationAsset: SdaToken;
    /**
     * - The resolved address that receives the delivered asset.
     */
    destinationAddress: string;
    /**
     * - The quote bound to this address, if any.
     */
    quote?: SdaQuote;
    /**
     * - Deposit limits for this address.
     */
    limits?: SdaLimits;
    /**
     * - Whether the address can receive more than one deposit.
     */
    reusable: boolean;
    /**
     * - The refund address bound to this address.
     */
    refundAddress?: string;
    /**
     * - Unix timestamp (seconds) at which the address's activation expires, when {@link SdaCapabilities#activation} is `'ttl'`.
     */
    expiry?: number;
    /**
     * - The provider-specific derivation inputs this address was created from (echoed back), so a `clientDerivableAddress` provider can re-derive, verify or recover the address later.
     */
    derivation?: Record<string, unknown>;
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
     * - The provider identifier for this transfer.
     */
    id: string;
    /**
     * - The SDA the deposit was sent to, when known (a status-by-id lookup may not return it).
     */
    depositAddress?: string;
    /**
     * - The current status of the transfer.
     */
    status: SdaTransferStatus;
    /**
     * - The token that was deposited.
     */
    inputToken?: SdaToken;
    /**
     * - The amount deposited, in the input token's base unit.
     */
    inputAmount?: bigint;
    /**
     * - The asset delivered to the destination.
     */
    destinationAsset?: SdaToken;
    /**
     * - The amount delivered, in the destination asset's base unit.
     */
    outputAmount?: bigint;
    /**
     * - The hash of the deposit transaction on the source chain.
     */
    sourceTxHash?: string;
    /**
     * - The hash of the delivery transaction on the destination chain.
     */
    destinationTxHash?: string;
    /**
     * - Itemised fees applied to this transfer.
     */
    fees?: SdaFee[];
    /**
     * - Unix timestamp (seconds) when the transfer was first observed.
     */
    createdAt?: number;
    /**
     * - Unix timestamp (seconds) when the transfer was last updated.
     */
    updatedAt?: number;
};
/**
 * Optional pagination/filtering for transfer history.
 */
export type SdaTransfersOptions = {
    /**
     * - The source chain of the deposit address, required by providers that key addresses by (address, chain).
     */
    sourceChain?: Blockchain;
    /**
     * - The maximum number of transfers to return.
     */
    limit?: number;
    /**
     * - An opaque pagination cursor returned by a previous call.
     */
    cursor?: string;
    /**
     * - Restrict to transfers in this status.
     */
    status?: SdaTransferStatus;
};
/**
 * Options for re-processing a deposit that was not picked up automatically
 * (`reindex`). Callers supply whatever the provider needs — typically the source
 * transaction, or the deposit address / SDA id.
 */
export type SdaRecoveryOptions = {
    /**
     * - The deposit address to reindex.
     */
    address?: string;
    /**
     * - The provider SDA identifier.
     */
    id?: string;
    /**
     * - The deposit transaction to re-index.
     */
    sourceTxHash?: string;
    /**
     * - The chain of the deposit transaction.
     */
    sourceChain?: Blockchain;
};
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
     * - The provider SDA identifier.
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
