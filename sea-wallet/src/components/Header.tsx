import React from "react"

type HeaderProps = {
  activeTab: "dashboard" | "assets" | "transaction" | "accounts"
  onTabChange: (tab: "dashboard" | "assets" | "transaction" | "accounts") => void
  address: string
  hasAccount?: boolean
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, address, hasAccount = true }) => {
  return (
    <div className="plasmo-bg-blue-600 plasmo-text-white plasmo-p-4">
      <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-4">
        <h1 className="plasmo-text-xl plasmo-font-bold">Sea Wallet</h1>
        {address && (
          <div className="plasmo-bg-blue-700 plasmo-rounded-md plasmo-px-2 plasmo-py-1 plasmo-text-xs">
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </div>
        )}
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
