import {
  ReadonlyWalletAccount,
  SUPPORTED_CHAINS,
  type Wallet
} from "@iota/wallet-standard"
import { SUI_CHAINS } from "@mysten/wallet-standard"
import type {
  StandardConnectFeature,
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

import { getAllAccounts } from "~store/store"

import { icon } from "./icon"

import { sendToBackground } from "@plasmohq/messaging"

import type { ConnectRequest, ConnectResponse } from "~background/messages/connect"


export class SeaWallet implements Wallet {
  get version(): "1.0.0" {
    // Return the version of the Wallet Standard this implements (in this case, 1.0.0).
    return "1.0.0"
  }
  get name() {
    return "Sea Wallet "
  }
  get icon(): `data:image/png;base64,${string}` {
    // A simple wallet icon in SVG format, base64 encoded
    return icon
  }
  // Return the Sui chains that your wallet supports.
  get chains() {
    return SUPPORTED_CHAINS.concat(SUI_CHAINS, ETHEREUM_CHAINS)
  }
  private walletAccounts: ReadonlyWalletAccount[] = []

  constructor() {
    // Initialize accounts
    this.refreshAccounts()
  }

  private async refreshAccounts() {
    const accounts = await getAllAccounts()
    this.walletAccounts = accounts.map(
      (walletAccount) =>
        new ReadonlyWalletAccount({
          address: walletAccount.address,
          publicKey: walletAccount.keypair.getPublicKey().toString(),
          // The Sui chains that your wallet supports.
          chains: SUI_CHAINS,
          // The features that this account supports. This can be a subset of the wallet's supported features.
          // These features must exist on the wallet as well.
          features: [
            "sui:signPersonalMessage",
            "sui:signTransaction",
            "sui:signAndExecuteTransaction"
          ]
        })
    )
  }

  get accounts() {
    // Return the cached accounts that your wallet has
    return this.walletAccounts
  }
  get features(): StandardConnectFeature & StandardEventsFeature & SuiFeatures {
    return {
      "standard:connect": {
        version: "1.0.0",
        connect: this.#connect
      },
      "standard:events": {
        version: "1.0.0",
        on: this.#on
      },

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
      }
    }
  }

  #on: StandardEventsOnMethod = () => {
    // Your wallet's events on implementation.
    return () => {}
  }

  #connect: StandardConnectMethod = async () => {
    // Your wallet's connect implementation
    try {
      console.log(chrome.runtime.id)
      const response = await sendToBackground<ConnectRequest, ConnectResponse>({
        name: "connect",
        body: {
          site: window.location.origin,
          icon: (document.querySelector('link[rel="icon"]') as HTMLLinkElement)?.href || 
               (document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement)?.href || 
               `${window.location.origin}/favicon.ico`
        },
        // Replace this with your actual extension ID from chrome://extensions
        extensionId: 'anaeleemhdicpgmclmdijcmadhmeipfp'
      })
      return { accounts: [] }
    } catch (error) {
      console.error("Connection error:", error)
      return { accounts: [] }
    }
  }

  #signPersonalMessage: SuiSignPersonalMessageMethod = async () => {
    // Your wallet's signPersonalMessage implementation
    throw new Error("Not implemented")
  }

  #signTransaction: SuiSignTransactionMethod = async () => {
    // Your wallet's signTransaction implementation
    throw new Error("Not implemented")
  }

  #signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod = async () => {
    // Your wallet's signAndExecuteTransaction implementation
    throw new Error("Not implemented")
  }

  #reportTransactionEffects: SuiReportTransactionEffectsMethod = async () => {
    // Your wallet's reportTransactionEffects implementation
    throw new Error("Not implemented")
  }
}
