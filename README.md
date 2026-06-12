# @tetherto/wdk-wallet

## What This Does

Base classes for the wallet and protocol modules in the [Wallet Development Kit (WDK)](https://docs.wallet.tether.io).

## Who Should Use This

This module is for internal use only. If you want to build a wallet, use one of these instead:

**Recommended:**
- `@tetherto/wdk-core` - Use this to work with multiple chains and features

**Individual wallet modules:**
- `@tetherto/wdk-wallet-evm` - For Ethereum and EVM chains
- `@tetherto/wdk-wallet-evm-erc-4337` - For EVM chains with ERC-4337 support
- `@tetherto/wdk-wallet-btc` - For Bitcoin
- `@tetherto/wdk-wallet-ton` - For TON
- `@tetherto/wdk-wallet-ton-gasless` - For TON with gasless transactions
- `@tetherto/wdk-wallet-tron` - For TRON
- `@tetherto/wdk-wallet-tron-gasfree` - For TRON with gasless transactions
- `@tetherto/wdk-wallet-solana` - For Solana
- `@tetherto/wdk-wallet-spark` - For Spark


## Key Parts

- **WalletManager** - Base class for managing wallets
- **WalletAccount** - Base class for wallet accounts
- **WalletAccountReadOnly** - Base class for read-only accounts
- **IWalletAccount** - Interface that all accounts must follow
- **WalletIndexerClient** - Base class for indexer clients (interpreted multi-chain portfolio, positions, transactions, NFTs, PnL)

## Learn More

For full docs, visit [docs.wallet.tether.io](https://docs.wallet.tether.io)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
