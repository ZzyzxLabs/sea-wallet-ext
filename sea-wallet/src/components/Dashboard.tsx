import { useState } from "react"

type Asset = {
  id: number
  name: string
  symbol: string
  amount: string
  value: string
  change: string
}

type DashboardProps = {
  address: string
  balance: string
  assets: Asset[]
}

const Dashboard = ({ address, balance, assets }: DashboardProps) => {
  const [isAddressCopied, setIsAddressCopied] = useState(false)

  // Top 3 assets by value
  const topAssets = [...assets].slice(0, 3)

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setIsAddressCopied(true)
    setTimeout(() => setIsAddressCopied(false), 2000)
  }

  return (
    <div className="plasmo-space-y-6">
      {/* Account Section */}
      <div className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-md plasmo-p-6">
        <h2 className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-800 plasmo-mb-4">Account</h2>
        
        <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-4">
          <div>
            <p className="plasmo-text-sm plasmo-text-gray-500">Wallet Address</p>
            <div className="plasmo-flex plasmo-items-center">
              <p className="plasmo-text-gray-700 plasmo-text-xs plasmo-break-all">
                {address}
              </p>
              <button 
                onClick={copyAddress}
                className="plasmo-ml-2 plasmo-text-blue-500 plasmo-text-sm plasmo-whitespace-nowrap"
              >
                {isAddressCopied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="plasmo-mt-4">
          <p className="plasmo-text-sm plasmo-text-gray-500">Total Balance</p>
          <p className="plasmo-text-2xl plasmo-font-bold plasmo-text-gray-800">${balance}</p>
        </div>
      </div>
      
      {/* Assets Preview */}
      <div className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-md plasmo-p-6">
        <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-4">
          <h2 className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-800">Top Assets</h2>
          <button className="plasmo-text-blue-500 plasmo-text-sm">See All</button>
        </div>
        
        <div className="plasmo-divide-y plasmo-divide-gray-100">
          {topAssets.map((asset) => (
            <div key={asset.id} className="plasmo-py-3 plasmo-flex plasmo-justify-between plasmo-items-center">
              <div className="plasmo-flex plasmo-items-center">
                <div className="plasmo-w-8 plasmo-h-8 plasmo-bg-gray-200 plasmo-rounded-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mr-3">
                  <span className="plasmo-text-xs plasmo-font-bold">{asset.symbol[0]}</span>
                </div>
                <div>
                  <p className="plasmo-font-medium plasmo-text-gray-800">{asset.name}</p>
                  <p className="plasmo-text-xs plasmo-text-gray-500">{asset.amount} {asset.symbol}</p>
                </div>
              </div>
              <div className="plasmo-text-right">
                <p className="plasmo-font-medium plasmo-text-gray-800">{asset.value}</p>
                <p className={`plasmo-text-xs ${
                  asset.change.startsWith("+") 
                    ? "plasmo-text-green-500" 
                    : asset.change.startsWith("-") 
                    ? "plasmo-text-red-500" 
                    : "plasmo-text-gray-500"
                }`}>
                  {asset.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity (placeholder) */}
      <div className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-md plasmo-p-6">
        <h2 className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-800 plasmo-mb-2">Recent Activity</h2>
        <p className="plasmo-text-gray-500 plasmo-text-sm">No recent transactions</p>
      </div>
    </div>
  )
}

export default Dashboard
