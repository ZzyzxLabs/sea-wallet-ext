import { useState, useEffect } from "react"
import Header from "./Header"
import Dashboard from "./Dashboard"
import AssetList from "./CoinList"
import Transaction from "./Transaction"
import CreateAccount from "./CreateAccount"

// Import wallet store
import { getActiveAccount, getAllAccounts } from "../store/store"

type Tab = "dashboard" | "assets" | "transaction" | "accounts"

const WalletApp = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [address, setAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0.00")
  const [hasAccount, setHasAccount] = useState<boolean>(false)

  // Mock data for assets
  const assets = [
    { id: 1, name: "SUI", symbol: "SUI", amount: "1,234.56", value: "$2,469.12", change: "+3.5%" },
    { id: 2, name: "Ethereum", symbol: "ETH", amount: "1.5", value: "$3,000", change: "-1.2%" },
    { id: 3, name: "Bitcoin", symbol: "BTC", amount: "0.05", value: "$2,500", change: "+2.1%" },
    { id: 4, name: "USD Coin", symbol: "USDC", amount: "500", value: "$500", change: "0%" },
  ]

  // Load the active account when component mounts
  useEffect(() => {
    loadActiveAccount()
  }, [])

  // Load the active account from store
  const loadActiveAccount = async () => {
    try {
      const activeAccount = await getActiveAccount()
      if (activeAccount) {
        setAddress(activeAccount.publicKey)
        setHasAccount(true)
      } else {
        // Check if we have any accounts
        const accounts = await getAllAccounts()
        if (accounts && accounts.length > 0) {
          setHasAccount(true)
        } else {
          // No accounts yet, show the accounts tab by default
          setActiveTab("accounts")
          setHasAccount(false)
        }
      }
    } catch (error) {
      console.error("Failed to load active account:", error)
    }
  }

  // Function to handle tab changes
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-[600px] plasmo-w-[400px] plasmo-bg-gray-50">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        address={address}
        hasAccount={hasAccount}
      />
      
      <div className="plasmo-flex-1 plasmo-p-4 plasmo-overflow-y-auto">
        {activeTab === "dashboard" && hasAccount && (
          <Dashboard 
            address={address} 
            balance={balance} 
            assets={assets} 
            onTabChange={handleTabChange}
          />
        )}
        
        {activeTab === "assets" && hasAccount && (
          <AssetList />
        )}
        
        {activeTab === "transaction" && hasAccount && (
          <Transaction address={address} assets={assets} />
        )}
        
        {activeTab === "accounts" && (
          <CreateAccount onAccountChange={loadActiveAccount} />
        )}
        
        {!hasAccount && activeTab !== "accounts" && (
          <div className="plasmo-text-center plasmo-p-8">
            <p className="plasmo-text-gray-500 plasmo-mb-4">
              Please create an account to access this feature
            </p>
            <button 
              onClick={() => setActiveTab("accounts")}
              className="plasmo-bg-blue-500 plasmo-text-white plasmo-py-2 plasmo-px-4 plasmo-rounded"
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletApp
