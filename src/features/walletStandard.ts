import {
  type StandardConnectFeature,
  ReadonlyWalletAccount,
  SUPPORTED_CHAINS as IOTA_CHAINS,
  type Wallet,
  type IotaFeatures,
  type IotaSignTransactionMethod,
  type IotaSignAndExecuteTransactionMethod,
  type IotaSignPersonalMessageMethod,
  type IotaReportTransactionEffectsMethod
} from "@iota/wallet-standard"
import { SUI_CHAINS } from "@mysten/wallet-standard"
import type {
  StandardConnectMethod,
  StandardEventsFeature,
  StandardEventsOnMethod,
  SuiFeatures,
  SuiReportTransactionEffectsMethod,
  SuiSignAndExecuteTransactionMethod,
  SuiSignPersonalMessageMethod,
  SuiSignTransactionMethod
} from "@mysten/wallet-standard"
import { ETHEREUM_CHAINS } from "@wallet-standard/ethereum"
import type {
  RialoFeatures,
  RialoSignTransactionMethod,
  RialoSignMessageMethod
} from "@rialo/wallet-standard"

import { getAllAccounts } from "~store/store"

import { icon } from "./icon"

import { sendToBackground } from "@plasmohq/messaging"

import type { ConnectRequest, ConnectResponse } from "~background/messages/connect"

export const RIALO_CHAINS = [
  "rialo:mainnet",
  "rialo:testnet",
  "rialo:devnet",
  "rialo:localnet"
] as const

type ExtendedWalletRequest = ConnectRequest & {
  extensionId?: string
}

export class SeaWallet implements Wallet {
  get version(): "1.0.0" {
    return "1.0.0"
  }
  get name() {
    return "Sea Wallet"
  }
  get icon(): `data:image/png;base64,${string}` {
    return icon
  }

  get chains() {
    // Combine all supported chains
    return [
      ...IOTA_CHAINS,
      ...RIALO_CHAINS,
      ...SUI_CHAINS,
      ...ETHEREUM_CHAINS
    ]
  }

  private walletAccounts: ReadonlyWalletAccount[] = []

  constructor() {
    this.refreshAccounts()
  }

  private async refreshAccounts() {
    const accounts = await getAllAccounts()
    this.walletAccounts = accounts.map(
      (walletAccount) =>
        new ReadonlyWalletAccount({
          address: walletAccount.address,
          publicKey: walletAccount.keypair.getPublicKey().toRawBytes(),
          chains: this.chains,
          features: [
            "sui:signPersonalMessage",
            "sui:signTransaction",
            "sui:signAndExecuteTransaction",
            "iota:signPersonalMessage",
            "iota:signTransaction",
            "iota:signAndExecuteTransaction",
            "iota:reportTransactionEffects",
            "rialo:signMessage",
            "rialo:signTransaction",
          ]
        })
    )
  }

  get accounts() {
    return this.walletAccounts
  }

  get features(): StandardConnectFeature & StandardEventsFeature & SuiFeatures & IotaFeatures & RialoFeatures {
    return {
      "standard:connect": {
        version: "1.0.0",
        connect: this.#connect
      },
      "standard:events": {
        version: "1.0.0",
        on: this.#on
      },
      // SUI Features
      "sui:signPersonalMessage": {
        version: "1.1.0",
        signPersonalMessage: this.#signPersonalMessage
      },
      "sui:signTransaction": {
        version: "2.0.0",
        signTransaction: this.#signTransaction
      },
      "sui:signAndExecuteTransaction": {
        version: "2.0.0",
        signAndExecuteTransaction: this.#signAndExecuteTransaction
      },
      "sui:reportTransactionEffects": {
        version: "1.0.0",
        reportTransactionEffects: this.#reportTransactionEffects
      },
      // IOTA Features
      "iota:signPersonalMessage": {
        version: "1.0.0",
        signPersonalMessage: this.#signIotaPersonalMessage
      },
      "iota:signTransaction": {
        version: "2.0.0",
        signTransaction: this.#signIotaTransaction
      },
      "iota:signAndExecuteTransaction": {
        version: "2.0.0",
        signAndExecuteTransaction: this.#signAndExecuteIotaTransaction
      },
      "iota:reportTransactionEffects": {
        version: "1.0.0",
        reportTransactionEffects: this.#reportIotaTransactionEffects
      },
      // Rialo Features
      "rialo:signMessage": {
        version: "1.0.0",
        signMessage: this.#signRialoMessage
      },
      "rialo:signTransaction": {
        version: "1.0.0",
        signTransaction: this.#signRialoTransaction
      }
    }
  }

  #on: StandardEventsOnMethod = () => {
    return () => { }
  }

  #connect: StandardConnectMethod = async () => {
    try {
      const response = await sendToBackground<ExtendedWalletRequest, ConnectResponse>({
        name: "connect",
        body: {
          site: window.location.origin,
          icon: (document.querySelector('link[rel="icon"]') as HTMLLinkElement)?.href ||
            (document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement)?.href ||
            `${window.location.origin}/favicon.ico`
        },
        extensionId: chrome.runtime.id
      })
      // Refresh accounts after successful connection to ensure state is synced
      await this.refreshAccounts()
      return { accounts: this.accounts }
    } catch (error) {
      console.error("Connection error:", error)
      return { accounts: [] }
    }
  }

  // --- SUI Implementations ---
  #signPersonalMessage: SuiSignPersonalMessageMethod = async (input) => {
    throw new Error("Sui Sign Personal Message Not implemented")
  }

  #signTransaction: SuiSignTransactionMethod = async (input) => {
    throw new Error("Sui Sign Transaction Not implemented")
  }

  #signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod = async (input) => {
    throw new Error("Sui Sign and Execute Transaction Not implemented")
  }

  #reportTransactionEffects: SuiReportTransactionEffectsMethod = async (input) => {
    throw new Error("Sui Report Transaction Effects Not implemented")
  }

  // --- IOTA Implementations ---
  #signIotaPersonalMessage: IotaSignPersonalMessageMethod = async (input) => {
    throw new Error("IOTA Sign Personal Message Not implemented")
  }

  #signIotaTransaction: IotaSignTransactionMethod = async (input) => {
    throw new Error("IOTA Sign Transaction Not implemented")
  }

  #signAndExecuteIotaTransaction: IotaSignAndExecuteTransactionMethod = async (input) => {
    throw new Error("IOTA Sign and Execute Transaction Not implemented")
  }

  #reportIotaTransactionEffects: IotaReportTransactionEffectsMethod = async (input) => {
    throw new Error("IOTA Report Transaction Effects Not implemented")
  }

  // --- Rialo Implementations ---
  #signRialoMessage: RialoSignMessageMethod = async (input) => {
    throw new Error("Rialo Sign Message Not implemented")
  }

  #signRialoTransaction: RialoSignTransactionMethod = async (input) => {
    throw new Error("Rialo Sign Transaction Not implemented")
  }
}

