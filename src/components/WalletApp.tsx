import { useState, useEffect } from "react"
import Header from "./Header"
import Dashboard from "./Dashboard"
import AssetList from "./CoinList"
import Transaction from "./Transaction"
import CreateAccount from "./CreateAccount"

// Import wallet store
import { getActiveAccount, getAllAccounts, setActiveAccount } from "../store/store"
// Import custom hook
import { useCoinsQuery } from "../hooks/useCoinsQuery"
// Import sendToBackground for communication with background script
import { sendToBackground } from "@plasmohq/messaging"
import type { ConnectRequest, ConnectResponse } from "~background/messages/connect"

type Tab = "dashboard" | "assets" | "transaction" | "accounts"

const WalletApp = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [address, setAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0.00")
  const [hasAccount, setHasAccount] = useState<boolean>(false)

  // Use the custom hook to get real coins data
  const coinsQuery = useCoinsQuery()

  // Process coins data for assets display
  const assets = coinsQuery.data?.data?.map((coin, index) => ({
    id: index + 1,
    name: coin.coinType.split("::").pop() || "Unknown Coin",
    symbol: coin.coinType.split("::").pop()?.toUpperCase() || "UNK",
    amount: (parseInt(coin.balance) / Math.pow(10, 9)).toLocaleString(undefined, {
      maximumFractionDigits: 6,
      minimumFractionDigits: 2,
    }),
    value: `$${(parseInt(coin.balance) / Math.pow(10, 9) * 1.5).toFixed(2)}`, // Mock USD value
    change: "+0.0%", // Mock change percentage
    coinType: coin.coinType,
    balance: coin.balance
  })) || []

  // Load the active account when component mounts
  useEffect(() => {
    loadActiveAccount()
  }, [])

  // Update balance when coins data changes
  useEffect(() => {
    if (coinsQuery.data?.data) {
      // Calculate total balance from SUI coins
      const suiCoins = coinsQuery.data.data.filter(coin => 
        coin.coinType === "0x2::sui::SUI"
      )
      const totalSuiBalance = suiCoins.reduce((total, coin) => 
        total + parseInt(coin.balance), 0
      )
      const formattedBalance = (totalSuiBalance / Math.pow(10, 9)).toLocaleString(undefined, {
        maximumFractionDigits: 6,
        minimumFractionDigits: 2,
      })
      setBalance(formattedBalance)
    }
  }, [coinsQuery.data])

  // Load the active account from store
  const loadActiveAccount = async () => {
    try {
      const activeAccount = await getActiveAccount()
      console.log("Active account:", activeAccount)
      if (activeAccount) {
        // Use the stored address directly since keypair methods are lost during serialization
        if (activeAccount.address) {
          setAddress(activeAccount.address)
          setHasAccount(true)
        } else {
          console.error("Active account has no address")
          setHasAccount(false)
        }
      } else {
        // Check if we have any accounts
        const accounts = await getAllAccounts()
        if (accounts && accounts.length > 0) {
          // Auto-activate the first account if no active account is set
          const firstAccount = accounts[0]
          await setActiveAccount(firstAccount.id)
          // Use the stored address directly
          if (firstAccount.address) {
            setAddress(firstAccount.address)
            setHasAccount(true)
            console.log("Auto-activated first account:", firstAccount.name)
          } else {
            console.error("First account has no address")
            setHasAccount(false)
          }
        } else {
          // No accounts yet, show the accounts tab by default
          setActiveTab("accounts")
          setHasAccount(false)
        }
      }
    } catch (error) {
      console.error("Failed to load active account:", error)
      setHasAccount(false)
    }
  }

  // Function to handle tab changes
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
  }

  // Function to test background connection
  const testBackgroundConnection = async () => {
    try {
      console.log("Testing background connection")
      const extensionId = chrome.runtime.id
      console.log("Extension ID:", extensionId)
      
      const response = await sendToBackground<ConnectRequest, ConnectResponse>({
        name: "connect",
        body: {
          site: window.location.origin,
          icon: `${window.location.origin}/favicon.ico`
        }
      });
      
      console.log("Response from background:", response);
      alert(`Background connection test result: ${response.success ? 'Success' : 'Failed'}\nMessage: ${response.message}`);
    } catch (error) {
      console.error("Error connecting to background:", error);
      alert(`Background connection error: ${error.message}`);
    }
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
        
        {/* Test background connection button */}
        <div className="plasmo-mt-4 plasmo-text-center">
          <button 
            onClick={testBackgroundConnection}
            className="plasmo-bg-green-500 plasmo-text-white plasmo-py-2 plasmo-px-4 plasmo-rounded plasmo-shadow-md hover:plasmo-bg-green-600 plasmo-transition-colors"
          >
            Test Background Connection
          </button>
        </div>
        
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
