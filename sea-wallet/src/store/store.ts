import { SecureStorage } from "@plasmohq/storage/secure"

// Types for our wallet accounts
type Account = {
  id: string
  name: string
  publicKey: string
  keypair: string // Serialized keypair object
  isActive: boolean
  createdAt: number
}

type WalletState = {
  accounts: Account[]
  activeAccountId: string | null
}

const storage = new SecureStorage()

// Initialize storage with password and default values
const initializeStorage = async () => {
  await storage.setPassword("zzyzx0")
  
  // Initialize wallet state if it doesn't exist
  const walletState = await storage.get("walletState")
  if (!walletState) {
    await storage.set("walletState", {
      accounts: [],
      activeAccountId: null
    } as WalletState)
  }
}

// Get wallet state from storage
const getWalletState = async (): Promise<WalletState> => {
  const walletState = await storage.get("walletState") as WalletState
  return walletState || { accounts: [], activeAccountId: null }
}

// Save wallet state to storage
const saveWalletState = async (state: WalletState): Promise<void> => {
  await storage.set("walletState", state)
}

// Add a new account
const addAccount = async (account: Omit<Account, "id" | "createdAt" | "isActive">): Promise<Account> => {
  const walletState = await getWalletState()
  
  const newAccount: Account = {
    ...account,
    id: generateId(),
    createdAt: Date.now(),
    isActive: walletState.accounts.length === 0 // First account is active by default
  }
  
  const updatedState = {
    accounts: [...walletState.accounts, newAccount],
    activeAccountId: walletState.activeAccountId || (walletState.accounts.length === 0 ? newAccount.id : null)
  }
  
  await saveWalletState(updatedState)
  return newAccount
}

// Set active account
const setActiveAccount = async (accountId: string): Promise<void> => {
  const walletState = await getWalletState()
  
  const updatedAccounts = walletState.accounts.map(account => ({
    ...account,
    isActive: account.id === accountId
  }))
  
  await saveWalletState({
    accounts: updatedAccounts,
    activeAccountId: accountId
  })
}

// Get active account
const getActiveAccount = async (): Promise<Account | null> => {
  const walletState = await getWalletState()
  if (!walletState.activeAccountId) return null
  
  return walletState.accounts.find(account => account.id === walletState.activeAccountId) || null
}

// Get all accounts
const getAllAccounts = async (): Promise<Account[]> => {
  const walletState = await getWalletState()
  return walletState.accounts
}

// Delete account
const deleteAccount = async (accountId: string): Promise<void> => {
  const walletState = await getWalletState()
  
  const updatedAccounts = walletState.accounts.filter(account => account.id !== accountId)
  let activeAccountId = walletState.activeAccountId
  
  // If we're deleting the active account, set the first available one as active
  if (accountId === walletState.activeAccountId) {
    activeAccountId = updatedAccounts.length > 0 ? updatedAccounts[0].id : null
    // Update isActive flags if needed
    if (activeAccountId) {
      updatedAccounts[0].isActive = true
    }
  }
  
  await saveWalletState({
    accounts: updatedAccounts,
    activeAccountId
  })
}

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Initialize storage (can be called when app starts)
initializeStorage().catch(console.error)

// Export all the functions that might be needed by components like CoinList
export {
  addAccount,
  setActiveAccount,
  getActiveAccount,
  getAllAccounts,
  deleteAccount,
  getWalletState,
  saveWalletState,
  initializeStorage
}

// Export types for use in components
export type { Account, WalletState }
