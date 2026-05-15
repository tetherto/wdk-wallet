// Copyright 2024 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict'

/** @typedef {import('./swap-protocol.js').SwapProtocolConfig} SwapProtocolConfig */
/** @typedef {import('./swap-protocol.js').SwapOptions} SwapOptions */
/** @typedef {import('./swap-protocol.js').SwapResult} SwapResult */

/** @typedef {import('./bridge-protocol.js').BridgeProtocolConfig} BridgeProtocolConfig */
/** @typedef {import('./bridge-protocol.js').BridgeOptions} BridgeOptions */
/** @typedef {import('./bridge-protocol.js').BridgeResult} BridgeResult */

/** @typedef {import('./lending-protocol.js').SupplyOptions} SupplyOptions */
/** @typedef {import('./lending-protocol.js').SupplyResult} SupplyResult */
/** @typedef {import('./lending-protocol.js').WithdrawOptions} WithdrawOptions */
/** @typedef {import('./lending-protocol.js').WithdrawResult} WithdrawResult */
/** @typedef {import('./lending-protocol.js').BorrowOptions} BorrowOptions */
/** @typedef {import('./lending-protocol.js').BorrowResult} BorrowResult */
/** @typedef {import('./lending-protocol.js').RepayOptions} RepayOptions */
/** @typedef {import('./lending-protocol.js').RepayResult} RepayResult */

/** @typedef {import('./fiat-protocol.js').BuyOptions} BuyOptions */
/** @typedef {import('./fiat-protocol.js').BuyCommonOptions} BuyCommonOptions */
/** @typedef {import('./fiat-protocol.js').BuyExactCryptoAmountOptions} BuyExactCryptoAmountOptions */
/** @typedef {import('./fiat-protocol.js').BuyWithFiatAmountOptions} BuyWithFiatAmountOptions */
/** @typedef {import('./fiat-protocol.js').BuyResult} BuyResult */

/** @typedef {import('./fiat-protocol.js').SellOptions} SellOptions */
/** @typedef {import('./fiat-protocol.js').SellCommonOptions} SellCommonOptions */
/** @typedef {import('./fiat-protocol.js').SellExactCryptoAmountOptions} SellExactCryptoAmountOptions */
/** @typedef {import('./fiat-protocol.js').SellForFiatAmountOptions} SellForFiatAmountOptions */
/** @typedef {import('./fiat-protocol.js').SellResult} SellResult */

/** @typedef {import('./fiat-protocol.js').FiatQuote} FiatQuote */

/** @typedef {import('./fiat-protocol.js').FiatTransactionStatus} FiatTransactionStatus */
/** @typedef {import('./fiat-protocol.js').FiatTransactionDetail} FiatTransactionDetail */

/** @typedef {import('./fiat-protocol.js').SupportedCryptoAsset} SupportedCryptoAsset */
/** @typedef {import('./fiat-protocol.js').SupportedFiatCurrency} SupportedFiatCurrency */
/** @typedef {import('./fiat-protocol.js').SupportedCountry} SupportedCountry */

/** @typedef {import('./swidge-protocol.js').SwidgeStatus} SwidgeStatus */
/** @typedef {import('./swidge-protocol.js').SwidgeFeeType} SwidgeFeeType */
/** @typedef {import('./swidge-protocol.js').SwidgeProtocolConfig} SwidgeProtocolConfig */
/** @typedef {import('./swidge-protocol.js').SwidgeOptions} SwidgeOptions */
/** @typedef {import('./swidge-protocol.js').SwidgeCommonOptions} SwidgeCommonOptions */
/** @typedef {import('./swidge-protocol.js').SwidgeExactInOptions} SwidgeExactInOptions */
/** @typedef {import('./swidge-protocol.js').SwidgeExactOutOptions} SwidgeExactOutOptions */
/** @typedef {import('./swidge-protocol.js').SwidgeFee} SwidgeFee */
/** @typedef {import('./swidge-protocol.js').SwidgeTransaction} SwidgeTransaction */
/** @typedef {import('./swidge-protocol.js').SwidgeQuote} SwidgeQuote */
/** @typedef {import('./swidge-protocol.js').SwidgeResult} SwidgeResult */
/** @typedef {import('./swidge-protocol.js').SwidgeStatusOptions} SwidgeStatusOptions */
/** @typedef {import('./swidge-protocol.js').SwidgeStatusResult} SwidgeStatusResult */

export { default as SwapProtocol, ISwapProtocol } from './swap-protocol.js'

export { default as BridgeProtocol, IBridgeProtocol } from './bridge-protocol.js'

export { default as LendingProtocol, ILendingProtocol } from './lending-protocol.js'

export { default as FiatProtocol, IFiatProtocol } from './fiat-protocol.js'

export { default as SwidgeProtocol, ISwidgeProtocol } from './swidge-protocol.js'
