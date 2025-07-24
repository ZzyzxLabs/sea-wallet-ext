import React, { useState, useRef, useEffect } from "react"
import { useSuiClientContext } from "@mysten/dapp-kit"

type HeaderProps = {
  activeTab: "dashboard" | "assets" | "transaction" | "accounts"
  onTabChange: (tab: "dashboard" | "assets" | "transaction" | "accounts") => void
  address: string
  hasAccount?: boolean
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, address, hasAccount = true }) => {
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const ctx = useSuiClientContext()
  
  const currentNetwork = ctx.network
  const networks = Object.keys(ctx.networks)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNetworkDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNetworkChange = (network: string) => {
    ctx.selectNetwork(network)
    setShowNetworkDropdown(false)
  }

  return (
    <div className="plasmo-bg-blue-600 plasmo-text-white plasmo-p-4">
      <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-4">
        <h1 className="plasmo-text-xl plasmo-font-bold">Sea Wallet</h1>
        
        <div className="plasmo-flex plasmo-items-center plasmo-space-x-2">
          {/* Network Selector */}
          <div className="plasmo-relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
              className="plasmo-bg-blue-700 plasmo-rounded-md plasmo-px-3 plasmo-py-1 plasmo-text-xs plasmo-flex plasmo-items-center plasmo-space-x-1 hover:plasmo-bg-blue-800 plasmo-transition"
            >
              <div className={`plasmo-w-2 plasmo-h-2 plasmo-rounded-full ${
                currentNetwork === 'mainnet' ? 'plasmo-bg-green-400' : 
                currentNetwork === 'testnet' ? 'plasmo-bg-yellow-400' : 
                'plasmo-bg-red-400'
              }`}></div>
              <span className="plasmo-capitalize">{currentNetwork}</span>
              <svg className="plasmo-w-3 plasmo-h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showNetworkDropdown && (
              <div className="plasmo-absolute plasmo-top-full plasmo-right-0 plasmo-mt-1 plasmo-bg-white plasmo-border plasmo-border-gray-200 plasmo-rounded-md plasmo-shadow-lg plasmo-z-50 plasmo-min-w-[120px]">
                {networks.map((network) => (
                  <button
                    key={network}
                    onClick={() => handleNetworkChange(network)}
                    className={`plasmo-w-full plasmo-text-left plasmo-px-3 plasmo-py-2 plasmo-text-sm plasmo-flex plasmo-items-center plasmo-space-x-2 hover:plasmo-bg-gray-100 plasmo-transition ${
                      currentNetwork === network 
                        ? 'plasmo-text-blue-600 plasmo-bg-blue-50' 
                        : 'plasmo-text-gray-700'
                    }`}
                  >
                    <div className={`plasmo-w-2 plasmo-h-2 plasmo-rounded-full ${
                      network === 'mainnet' ? 'plasmo-bg-green-400' : 
                      network === 'testnet' ? 'plasmo-bg-yellow-400' : 
                      'plasmo-bg-red-400'
                    }`}></div>
                    <span className="plasmo-capitalize">{network}</span>
                    {currentNetwork === network && (
                      <svg className="plasmo-w-3 plasmo-h-3 plasmo-ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Address Display */}
          {address && (
            <div className="plasmo-bg-blue-700 plasmo-rounded-md plasmo-px-2 plasmo-py-1 plasmo-text-xs">
              {address.substring(0, 6)}...{address.substring(address.length - 4)}
            </div>
          )}
        </div>
      </div>
      
      <div className="plasmo-flex plasmo-space-x-1 plasmo-mt-2">
        <button
          className={`plasmo-px-2 plasmo-py-2 plasmo-text-sm plasmo-rounded-t-md ${
            activeTab === "dashboard"
              ? "plasmo-bg-white plasmo-text-blue-600"
              : "plasmo-bg-blue-500 plasmo-text-white"
          }`}
          onClick={() => onTabChange("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`plasmo-px-2 plasmo-py-2 plasmo-text-sm plasmo-rounded-t-md ${
            activeTab === "assets"
              ? "plasmo-bg-white plasmo-text-blue-600"
              : "plasmo-bg-blue-500 plasmo-text-white"
          }`}
          onClick={() => onTabChange("assets")}
        >
          Assets
        </button>
        <button
          className={`plasmo-px-2 plasmo-py-2 plasmo-text-sm plasmo-rounded-t-md ${
            activeTab === "transaction"
              ? "plasmo-bg-white plasmo-text-blue-600"
              : "plasmo-bg-blue-500 plasmo-text-white"
          }`}
          onClick={() => onTabChange("transaction")}
        >
          Send
        </button>
        <button
          className={`plasmo-px-2 plasmo-py-2 plasmo-text-sm plasmo-rounded-t-md ${
            activeTab === "accounts"
              ? "plasmo-bg-white plasmo-text-blue-600"
              : "plasmo-bg-blue-500 plasmo-text-white"
          }`}
          onClick={() => onTabChange("accounts")}
        >
          Accounts
        </button>
      </div>
    </div>
  )
}

export default Header
