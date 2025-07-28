import { useState } from "react"
import { useSuiClient } from "@mysten/dapp-kit"
import { coinTx } from "../features/tx"; // Adjust the import path as necessary
import { getActiveAccount} from "../store/store"; // Adjust the import path as necessary
type Asset = {
  id: number
  name: string
  symbol: string
  amount: string
  value: string
  change: string
}

type TransactionProps = {
  address: string
  assets: Asset[]
}

const Transaction = ({ address, assets }: TransactionProps) => {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<number | null>(assets[0]?.id || null)
  const [transactionStatus, setTransactionStatus] = useState<null | "pending" | "success" | "error">(null)
  const curAccount = getActiveAccount(); //this function retrieves the active account
  // Function to handle transaction submission
  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!recipient || !amount || !selectedAsset) {
      return
    }

    // Mock transaction process
    setTransactionStatus("pending")
    
    // Simulate network delay
    setTimeout(async () => {
      // In a real app, you'd have logic to check for errors
      const client = useSuiClient()
      const tx = coinTx(recipient,(1),[], false); // Adjust coin selection logic as needed
      const result = await client.signAndExecuteTransaction({ signer: (await curAccount)?.keypair, transaction: tx });
      await client.waitForTransaction({ digest: result.digest });
      const success = true
      if (success) {
        setTransactionStatus("success")
        // Clear form on success
        setRecipient("")
        setAmount("")
      } else {
        setTransactionStatus("error")
      }
      
      // Clear status after a delay
      setTimeout(() => {
        setTransactionStatus(null)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="plasmo-space-y-4">
      <h2 className="plasmo-text-xl plasmo-font-bold plasmo-text-gray-800">Send Assets</h2>
      
      {/* Status Messages */}
      {transactionStatus === "pending" && (
        <div className="plasmo-bg-blue-50 plasmo-border plasmo-border-blue-200 plasmo-rounded-lg plasmo-p-3 plasmo-text-blue-700">
          Transaction in progress...
        </div>
      )}
      
      {transactionStatus === "success" && (
        <div className="plasmo-bg-green-50 plasmo-border plasmo-border-green-200 plasmo-rounded-lg plasmo-p-3 plasmo-text-green-700">
          Transaction successful!
        </div>
      )}
      
      {transactionStatus === "error" && (
        <div className="plasmo-bg-red-50 plasmo-border plasmo-border-red-200 plasmo-rounded-lg plasmo-p-3 plasmo-text-red-700">
          Transaction failed. Please try again.
        </div>
      )}
      
      {/* Transaction form */}
      <form onSubmit={handleTransaction} className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-md plasmo-p-6">
        <div className="plasmo-mb-4">
          <label htmlFor="asset" className="plasmo-block plasmo-text-sm plasmo-font-medium plasmo-text-gray-700 plasmo-mb-1">
            Select Asset
          </label>
          <select
            id="asset"
            value={selectedAsset || ""}
            onChange={(e) => setSelectedAsset(parseInt(e.target.value))}
            className="plasmo-w-full plasmo-p-3 plasmo-bg-gray-50 plasmo-border plasmo-border-gray-200 plasmo-rounded-lg"
            required
          >
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.symbol}) - Balance: {asset.amount}
              </option>
            ))}
          </select>
        </div>
        
        <div className="plasmo-mb-4">
          <label htmlFor="recipient" className="plasmo-block plasmo-text-sm plasmo-font-medium plasmo-text-gray-700 plasmo-mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            placeholder="Enter wallet address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="plasmo-w-full plasmo-p-3 plasmo-bg-gray-50 plasmo-border plasmo-border-gray-200 plasmo-rounded-lg"
            required
          />
        </div>
        
        <div className="plasmo-mb-6">
          <label htmlFor="amount" className="plasmo-block plasmo-text-sm plasmo-font-medium plasmo-text-gray-700 plasmo-mb-1">
            Amount
          </label>
          <div className="plasmo-relative">
            <input
              type="number"
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
              min="0"
              className="plasmo-w-full plasmo-p-3 plasmo-bg-gray-50 plasmo-border plasmo-border-gray-200 plasmo-rounded-lg"
              required
            />
            <span className="plasmo-absolute plasmo-right-3 plasmo-top-3 plasmo-text-gray-400">
              {selectedAsset ? assets.find(a => a.id === selectedAsset)?.symbol : ""}
            </span>
          </div>
        </div>
        
        <button 
          type="submit"
          className="plasmo-w-full plasmo-bg-blue-600 plasmo-hover:plasmo-bg-blue-700 plasmo-text-white plasmo-font-medium plasmo-py-3 plasmo-px-4 plasmo-rounded-lg plasmo-transition-colors"
          disabled={transactionStatus === "pending"}
        >
          {transactionStatus === "pending" ? "Processing..." : "Send Transaction"}
        </button>
        
        <div className="plasmo-mt-4 plasmo-text-xs plasmo-text-gray-500 plasmo-text-center">
          Transaction fees may apply depending on network conditions.
        </div>
      </form>
    </div>
  )
}

export default Transaction
