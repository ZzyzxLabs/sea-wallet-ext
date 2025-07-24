import { useState, useEffect } from "react"
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'

// Import from store
import { addAccount, setActiveAccount, getAllAccounts, deleteAccount } from "../store/store"

type AccountItemProps = {
  id: string
  name: string
  publicKey: string
  isActive: boolean
  onActivate: (id: string) => void
  onDelete: (id: string) => void
}

const AccountItem = ({ id, name, publicKey, isActive, onActivate, onDelete }: AccountItemProps) => {
  return (
    <div className={`plasmo-p-4 plasmo-border plasmo-rounded-lg plasmo-mb-3 ${isActive ? 'plasmo-border-blue-500 plasmo-bg-blue-50' : 'plasmo-border-gray-200'}`}>
      <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
        <div>
          <h3 className="plasmo-font-medium plasmo-text-gray-800">{name}</h3>
          <p className="plasmo-text-xs plasmo-text-gray-500 plasmo-truncate plasmo-w-40">
            {publicKey.substring(0, 10)}...{publicKey.substring(publicKey.length - 10)}
          </p>
        </div>
        <div className="plasmo-flex plasmo-space-x-2">
          {!isActive && (
            <button 
              onClick={() => onActivate(id)} 
              className="plasmo-px-3 plasmo-py-1 plasmo-text-xs plasmo-bg-blue-500 plasmo-text-white plasmo-rounded-md"
            >
              Activate
            </button>
          )}
          {isActive && (
            <span className="plasmo-px-3 plasmo-py-1 plasmo-text-xs plasmo-bg-green-100 plasmo-text-green-800 plasmo-rounded-md">
              Active
            </span>
          )}
          <button 
            onClick={() => onDelete(id)} 
            className="plasmo-px-3 plasmo-py-1 plasmo-text-xs plasmo-bg-red-500 plasmo-text-white plasmo-rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

type CreateAccountProps = {
  onAccountChange?: () => void
}

const CreateAccount = ({ onAccountChange }: CreateAccountProps) => {
  const [accountName, setAccountName] = useState("")
  const [accounts, setAccounts] = useState<any[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  
  // Load accounts on component mount
  useEffect(() => {
    loadAccounts()
  }, [])
  
  const loadAccounts = async () => {
    try {
      const accountsList = await getAllAccounts()
      setAccounts(accountsList)
    } catch (error) {
      console.error("Failed to load accounts:", error)
      setErrorMessage("Failed to load accounts")
    }
  }
  
  const handleCreateAccount = async () => {
    if (!accountName.trim()) {
      setErrorMessage("Please enter an account name")
      return
    }
    
    try {
      setIsCreating(true)
      setErrorMessage("")
      
      // Generate new keypair
      const keypair = new Ed25519Keypair()
      const publicKey = keypair.getPublicKey().toSuiAddress()
      
      // Store the serialized keypair
      // Use the built-in JSON representation for the keypair
      const keypairData = JSON.stringify(keypair)
      
      // Save to secure storage
      await addAccount({
        name: accountName.trim(),
        publicKey,
        keypair: keypairData
      })
      
      // Reset form
      setAccountName("")
      
      // Refresh accounts list
      await loadAccounts()
      
      // Notify parent component about the account change
      if (onAccountChange) {
        onAccountChange()
      }
    } catch (error) {
      console.error("Failed to create account:", error)
      setErrorMessage("Failed to create account")
    } finally {
      setIsCreating(false)
    }
  }
  
  const handleActivateAccount = async (accountId: string) => {
    try {
      await setActiveAccount(accountId)
      await loadAccounts()
      
      // Notify parent component about the account change
      if (onAccountChange) {
        onAccountChange()
      }
    } catch (error) {
      console.error("Failed to activate account:", error)
      setErrorMessage("Failed to activate account")
    }
  }
  
  const handleDeleteAccount = async (accountId: string) => {
    try {
      await deleteAccount(accountId)
      await loadAccounts()
      
      // Notify parent component about the account change
      if (onAccountChange) {
        onAccountChange()
      }
    } catch (error) {
      console.error("Failed to delete account:", error)
      setErrorMessage("Failed to delete account")
    }
  }
  
  return (
    <div className="plasmo-p-4">
      <h2 className="plasmo-text-xl plasmo-font-bold plasmo-mb-4">Accounts</h2>
      
      {/* Account Creation Form */}
      <div className="plasmo-bg-white plasmo-rounded-lg plasmo-p-4 plasmo-shadow-md plasmo-mb-6">
        <h3 className="plasmo-text-lg plasmo-font-medium plasmo-mb-3">Create New Account</h3>
        
        {errorMessage && (
          <div className="plasmo-bg-red-50 plasmo-text-red-700 plasmo-p-2 plasmo-rounded plasmo-mb-3">
            {errorMessage}
          </div>
        )}
        
        <div className="plasmo-mb-4">
          <label className="plasmo-block plasmo-text-sm plasmo-text-gray-700 plasmo-mb-1">
            Account Name
          </label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-border-gray-300 plasmo-rounded"
            placeholder="My Account"
          />
        </div>
        
        <button
          onClick={handleCreateAccount}
          disabled={isCreating}
          className={`plasmo-w-full plasmo-py-2 plasmo-text-white plasmo-rounded ${
            isCreating ? "plasmo-bg-blue-400" : "plasmo-bg-blue-600 plasmo-hover:plasmo-bg-blue-700"
          }`}
        >
          {isCreating ? "Creating..." : "Create Account"}
        </button>
      </div>
      
      {/* Accounts List */}
      <div className="plasmo-bg-white plasmo-rounded-lg plasmo-p-4 plasmo-shadow-md">
        <h3 className="plasmo-text-lg plasmo-font-medium plasmo-mb-3">Your Accounts</h3>
        
        {accounts.length === 0 ? (
          <p className="plasmo-text-gray-500 plasmo-text-center plasmo-py-4">
            No accounts created yet
          </p>
        ) : (
          <div className="plasmo-max-h-60 plasmo-overflow-y-auto">
            {accounts.map((account) => (
              <AccountItem
                key={account.id}
                id={account.id}
                name={account.name}
                publicKey={account.publicKey}
                isActive={account.isActive}
                onActivate={handleActivateAccount}
                onDelete={handleDeleteAccount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateAccount