import { useState } from "react"

type Asset = {
  id: number
  name: string
  symbol: string
  amount: string
  value: string
  change: string
}

type AssetListProps = {
  assets: Asset[]
}

const AssetList = ({ assets }: AssetListProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="plasmo-space-y-4">
      <h2 className="plasmo-text-xl plasmo-font-bold plasmo-text-gray-800">Your Assets</h2>
      
      {/* Search input */}
      <div className="plasmo-relative">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="plasmo-w-full plasmo-p-3 plasmo-pl-10 plasmo-bg-white plasmo-border plasmo-border-gray-200 plasmo-rounded-lg plasmo-text-sm"
        />
        <span className="plasmo-absolute plasmo-left-3 plasmo-top-3 plasmo-text-gray-400">
          🔍
        </span>
      </div>
      
      {/* Assets list */}
      <div className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-md plasmo-divide-y plasmo-divide-gray-100 plasmo-overflow-y-auto" style={{ maxHeight: "450px" }}>
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <div key={asset.id} className="plasmo-p-4 plasmo-flex plasmo-justify-between plasmo-items-center">
              <div className="plasmo-flex plasmo-items-center">
                <div className="plasmo-w-10 plasmo-h-10 plasmo-bg-gray-200 plasmo-rounded-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mr-3">
                  <span className="plasmo-text-base plasmo-font-bold">{asset.symbol[0]}</span>
                </div>
                <div>
                  <p className="plasmo-font-medium plasmo-text-gray-800">{asset.name}</p>
                  <p className="plasmo-text-sm plasmo-text-gray-500">{asset.symbol}</p>
                </div>
              </div>
              <div className="plasmo-text-right">
                <p className="plasmo-font-medium plasmo-text-gray-800">{asset.value}</p>
                <div className="plasmo-flex plasmo-items-center plasmo-justify-end">
                  <p className="plasmo-text-sm plasmo-text-gray-500">{asset.amount} {asset.symbol}</p>
                  <p className={`plasmo-text-xs plasmo-ml-2 ${
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
            </div>
          ))
        ) : (
          <div className="plasmo-p-4 plasmo-text-center plasmo-text-gray-500">
            No assets found
          </div>
        )}
      </div>
    </div>
  )
}

export default AssetList
