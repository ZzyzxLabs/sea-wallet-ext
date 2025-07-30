import React, { useState, useEffect } from "react";
import { Ed25519Keypair } from "@mysten/sui/dist/cjs/keypairs/ed25519";
import { addAccount, getAllAccounts, setActiveAccount, deleteAccount, type Account } from "~store/store";

interface CreateAccountProps {
  onAccountChange?: () => void;
}

function CreateAccount({ onAccountChange }: CreateAccountProps) {
  const [accountName, setAccountName] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  // Load accounts on component mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const allAccounts = await getAllAccounts();
      // Filter out any invalid accounts and ensure proper structure
      const validAccounts = (allAccounts || []).filter(account => 
        account && 
        account.id && 
        typeof account.id === 'string' &&
        account.name &&
        typeof account.name === 'string'
      );
      setAccounts(validAccounts);
    } catch (err) {
      setError("Failed to load accounts");
      console.error("Error loading accounts:", err);
      setAccounts([]); // Set empty array on error
    }
  };

  const handleCreateAccount = async () => {
    if (!accountName.trim()) {
      setError("Please enter an account name");
      return;
    }

    // Check if account name already exists
    if (accounts.some(account => account.name.toLowerCase() === accountName.toLowerCase())) {
      setError("Account name already exists");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const keypair = new Ed25519Keypair();
      await addAccount(keypair, accountName.trim());
      setAccountName("");
      await loadAccounts(); // Refresh the accounts list
      if (onAccountChange) {
        onAccountChange(); // Notify parent component of account changes
      }
    } catch (err) {
      setError("Failed to create account");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSetActiveAccount = async (accountId: string) => {
    try {
      await setActiveAccount(accountId);
      await loadAccounts(); // Refresh to update active status
      if (onAccountChange) {
        onAccountChange(); // Notify parent component of account changes
      }
    } catch (err) {
      setError("Failed to set active account");
      console.error(err);
    }
  };

  const handleDeleteAccount = async (accountId: string, accountName: string) => {
    if (window.confirm(`Are you sure you want to delete the account "${accountName}"? This action cannot be undone.`)) {
      try {
        await deleteAccount(accountId);
        await loadAccounts(); // Refresh the accounts list
        if (onAccountChange) {
          onAccountChange(); // Notify parent component of account changes
        }
      } catch (err) {
        setError("Failed to delete account");
        console.error(err);
      }
    }
  };

  const formatAddress = (address: string | undefined) => {
    if (!address || typeof address !== 'string') {
      return 'Invalid Address';
    }
    if (address.length < 10) {
      return address;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="plasmo-p-4 plasmo-max-w-full plasmo-bg-white plasmo-rounded-lg plasmo-shadow-lg">
      <h2 className="plasmo-text-xl plasmo-font-bold plasmo-mb-4 plasmo-text-gray-800">Account Management</h2>
      
      {/* Create Account Section */}
      <div className="plasmo-mb-6">
        <h3 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-3 plasmo-text-gray-700">Create New Account</h3>
        <div className="plasmo-space-y-3">
          <input
            type="text"
            placeholder="Enter account name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateAccount()}
            className="plasmo-w-full plasmo-px-3 plasmo-py-2 plasmo-border plasmo-border-gray-300 plasmo-rounded-md focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-blue-500"
            disabled={isCreating}
          />
          <button
            onClick={handleCreateAccount}
            disabled={isCreating || !accountName.trim()}
            className="plasmo-w-full plasmo-bg-blue-500 plasmo-text-white plasmo-py-2 plasmo-px-4 plasmo-rounded-md hover:plasmo-bg-blue-600 disabled:plasmo-bg-gray-400 disabled:plasmo-cursor-not-allowed plasmo-transition-colors"
          >
            {isCreating ? "Creating..." : "Create Account"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="plasmo-mb-4 plasmo-p-3 plasmo-bg-red-100 plasmo-border plasmo-border-red-400 plasmo-text-red-700 plasmo-rounded">
          {error}
        </div>
      )}

      {/* Accounts List Section */}
      <div>
        <h3 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-3 plasmo-text-gray-700">
          Accounts ({accounts.length})
        </h3>
        
        {accounts.length === 0 ? (
          <p className="plasmo-text-gray-500 plasmo-text-center plasmo-py-4">
            No accounts yet. Create your first account above.
          </p>
        ) : (
          <div className="plasmo-space-y-3 plasmo-max-h-80 plasmo-overflow-y-auto">
            {accounts.map((account) => {
              // Safety checks for account properties
              if (!account || !account.id) {
                return null;
              }
              
              return (
                <div
                  key={account.id}
                  className={`plasmo-p-3 plasmo-border plasmo-rounded-lg plasmo-transition-colors ${
                    account.isActive
                      ? "plasmo-border-green-500 plasmo-bg-green-50"
                      : "plasmo-border-gray-200 plasmo-bg-gray-50"
                  }`}
                >
                  <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
                    <div className="plasmo-flex-1 plasmo-min-w-0">
                      <div className="plasmo-flex plasmo-items-center plasmo-space-x-2">
                        <h4 className="plasmo-font-medium plasmo-text-gray-800 plasmo-truncate">
                          {account.name || 'Unnamed Account'}
                        </h4>
                        {account.isActive && (
                          <span className="plasmo-px-2 plasmo-py-1 plasmo-text-xs plasmo-bg-green-500 plasmo-text-white plasmo-rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="plasmo-text-sm plasmo-text-gray-600 plasmo-mt-1 plasmo-truncate">
                        {formatAddress(account.address)}
                      </p>
                      <p className="plasmo-text-xs plasmo-text-gray-500 plasmo-mt-1">
                        Created: {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    
                    <div className="plasmo-flex plasmo-space-x-2 plasmo-ml-2">
                      {!account.isActive && (
                        <button
                          onClick={() => handleSetActiveAccount(account.id)}
                          className="plasmo-px-2 plasmo-py-1 plasmo-text-sm plasmo-bg-blue-500 plasmo-text-white plasmo-rounded hover:plasmo-bg-blue-600 plasmo-transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAccount(account.id, account.name || 'Unnamed Account')}
                        className="plasmo-px-2 plasmo-py-1 plasmo-text-sm plasmo-bg-red-500 plasmo-text-white plasmo-rounded hover:plasmo-bg-red-600 plasmo-transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            }).filter(Boolean)}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateAccount;