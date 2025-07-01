import { useState, useEffect } from "react"
import "./style.css"
import React from "react"
import ConnectionDialog from "./components/ConnectionDialog"
import { walletStorage } from "./storage/wallet-storage"
import { SeaWallet } from "./wallet-std/wallet"

function IndexPopup() {
  const [accounts, setAccounts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionRequest, setConnectionRequest] = useState<{origin: string} | null>(null);

  // Load wallet state on component mount
  useEffect(() => {
    const loadWalletState = async () => {
      const state = await walletStorage.getWalletState();
      setIsConnected(state.isConnected);
      setAccounts(state.accounts);
    };
    
    loadWalletState();
    
    // Listen for connection requests
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "wallet_connect_request") {
        // Store the connection request and origin
        setConnectionRequest({ 
          origin: sender.origin || "Unknown website" 
        });
        
        // The response will be sent when the user makes a decision
        // We need to return true to indicate we'll respond asynchronously
        return true;
      }
    });
  }, []);
  
  const handleApproveConnection = () => {
    if (connectionRequest) {
      // Send approval back to the background script
      chrome.runtime.sendMessage({ 
        type: "wallet_connect_response", 
        approved: true 
      });
      
      setConnectionRequest(null);
      setIsConnected(true);
    }
  };
  
  const handleRejectConnection = () => {
    if (connectionRequest) {
      // Send rejection back to the background script
      chrome.runtime.sendMessage({ 
        type: "wallet_connect_response", 
        approved: false 
      });
      
      setConnectionRequest(null);
    }
  };

  return (
    <div className="popup-container" style={{ width: "360px", height: "500px" }}>
      {connectionRequest ? (
        <ConnectionDialog
          origin={connectionRequest.origin}
          onApprove={handleApproveConnection}
          onReject={handleRejectConnection}
        />
      ) : (
        <>
          <h1>Sea Wallet</h1>
          <p>{isConnected ? "Connected to dApp" : "Not connected to any dApp"}</p>
          
          {accounts.length > 0 ? (
            <div className="accounts-list">
              <h2>Your Accounts</h2>
              <ul>
                {accounts.map((account: any) => (
                  <li key={account.address}>
                    <strong>{account.label || "Account"}</strong>
                    <div className="address">{account.address.substring(0, 10)}...{account.address.substring(account.address.length - 6)}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No accounts found. Create one to get started!</p>
          )}
          
          <footer>
            <p>Built with Plasmo 🚀</p>
          </footer>
        </>
      )}
    </div>
  )
}

export default IndexPopup