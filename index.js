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

/** @typedef {import('./src/wallet-manager.js').FeeRates} FeeRates */
/** @typedef {import('./src/wallet-manager.js').WalletConfig} WalletConfig */

/** @typedef {import('./src/wallet-account-read-only.js').Transaction} Transaction */
/** @typedef {import('./src/wallet-account-read-only.js').TransactionResult} TransactionResult */
/** @typedef {import('./src/wallet-account-read-only.js').TransferOptions} TransferOptions */
/** @typedef {import('./src/wallet-account-read-only.js').TransferResult} TransferResult */

/** @typedef {import('./src/wallet-account.js').KeyPair} KeyPair */

export { default } from './src/wallet-manager.js'

export { default as WalletAccountReadOnly, IWalletAccountReadOnly } from './src/wallet-account-read-only.js'

export { IWalletAccount } from './src/wallet-account.js'

export { NotImplementedError } from './src/errors.js'
