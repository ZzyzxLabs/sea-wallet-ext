import { Storage } from "@plasmohq/storage"
import type { WalletAccount } from "@mysten/wallet-standard"

interface WalletStorage {
  accounts: WalletAccount[]
  currentAccountIndex: number
  isConnected: boolean
}

class WalletStorageManager {
  private storage: Storage
  
  constructor() {
    this.storage = new Storage()
  }

  // Save wallet accounts
  async saveAccounts(accounts: WalletAccount[]): Promise<void> {
    await this.storage.set("accounts", JSON.stringify(accounts))
  }

  // Get wallet accounts
  async getAccounts(): Promise<WalletAccount[]> {
    const accountsStr = await this.storage.get("accounts")
    if (!accountsStr) {
      return []
    }
    return JSON.parse(accountsStr)
  }

  // Save current account index
  async saveCurrentAccountIndex(index: number): Promise<void> {
    await this.storage.set("currentAccountIndex", index.toString())
  }

  // Get current account index
  async getCurrentAccountIndex(): Promise<number> {
    const index = await this.storage.get("currentAccountIndex")
    return index ? parseInt(index) : 0
  }

  // Save connection state
  async saveConnectionState(isConnected: boolean): Promise<void> {
    await this.storage.set("isConnected", isConnected.toString())
  }

  // Get connection state
  async getConnectionState(): Promise<boolean> {
    const state = await this.storage.get("isConnected")
    return state === "true"
  }

  // Save entire wallet state
  async saveWalletState(state: WalletStorage): Promise<void> {
    await this.saveAccounts(state.accounts)
    await this.saveCurrentAccountIndex(state.currentAccountIndex)
    await this.saveConnectionState(state.isConnected)
  }

  // Get entire wallet state
  async getWalletState(): Promise<WalletStorage> {
    const accounts = await this.getAccounts()
    const currentAccountIndex = await this.getCurrentAccountIndex()
    const isConnected = await this.getConnectionState()

    return {
      accounts,
      currentAccountIndex,
      isConnected
    }
  }

  // Clear all wallet data
  async clearWalletData(): Promise<void> {
    await this.storage.clear()
  }
}

// Export a singleton instance
export const walletStorage = new WalletStorageManager()
