import { useEffect, useState } from "react"
import storage from "~walletStoreContent"
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

interface AccountProps {
  onResetWallet: () => void
}

export default function Account({ onResetWallet }: AccountProps) {
  const [accountAddress, setAccountAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const [loading, setLoading] = useState(true)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [privateKey, setPrivateKey] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        const keypairs = await storage.get("kps")
        if (keypairs && Array.isArray(keypairs) && keypairs.length > 0) {
          const keypair = keypairs[0]
          
          if (typeof keypair === 'object' && keypair.toSuiAddress) {
            const address = keypair.toSuiAddress()
            setAccountAddress(address)
            
            // Get private key for display (if needed)
            if (keypair.getSecretKey) {
              try {
                const secretKey = keypair.getSecretKey()
                setPrivateKey(Array.from(secretKey).map((b: number) => b.toString(16).padStart(2, '0')).join(''))
              } catch (error) {
                console.error("Error getting private key:", error)
                setPrivateKey("Unable to retrieve private key")
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading account data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAccountData()
  }, [])

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error(`Failed to copy ${type}:`, error)
    }
  }

  const formatAddress = (address: string) => {
    if (address.length <= 20) return address
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 w-[400px] h-[600px]">
        <div className="text-gray-600">Loading account...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-4 bg-gray-50 w-[400px] h-[600px] text-gray-800 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Sea Wallet</h1>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-md mb-4 text-white">
        <div className="text-sm opacity-90 mb-1">Total Balance</div>
        <div className="text-3xl font-bold mb-2">{balance} SUI</div>
        <div className="text-sm opacity-90">≈ $0.00 USD</div>
      </div>

      {/* Account Info */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Account Address</h3>
          <button
            onClick={() => copyToClipboard(accountAddress, 'address')}
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div className="bg-gray-100 p-3 rounded font-mono text-xs break-all text-gray-700">
          {accountAddress || "Loading..."}
        </div>
        {copied && (
          <div className="text-green-500 text-xs mt-2">Copied to clipboard!</div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Send</span>
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Receive</span>
        </button>
      </div>

      {/* Private Key Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Private Key</h3>
          <button
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="text-yellow-600 hover:text-yellow-700 transition-colors text-sm"
          >
            {showPrivateKey ? 'Hide' : 'Show'}
          </button>
        </div>
        {showPrivateKey && (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-3">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-700 text-xs">
                  Never share your private key. Anyone with this key can access your wallet.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded font-mono text-xs break-all text-gray-700 relative">
              {privateKey || "Loading..."}
              {privateKey && (
                <button
                  onClick={() => copyToClipboard(privateKey, 'private key')}
                  className="absolute top-2 right-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="space-y-2">
        <button className="w-full text-left p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-between">
          <span className="text-gray-700">Settings</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <button 
          onClick={onResetWallet}
          className="w-full text-left p-3 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors flex items-center justify-between text-red-600"
        >
          <span>Reset Wallet</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
