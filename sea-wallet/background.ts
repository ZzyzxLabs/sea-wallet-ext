import { registerWallet } from '@mysten/wallet-standard';
import { SeaWallet } from './src/wallet-std/wallet';

// Create a global wallet instance
const seaWallet = new SeaWallet();

// Initialize wallet state
seaWallet.loadWalletState().catch(console.error);

// Register the wallet with the wallet standard
registerWallet(seaWallet);

// Connection request handlers
let pendingConnectionRequest = null;
let connectionResolver = null;

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle connection requests from dApps via content script
  if (message.type === "wallet_connect_request") {
    // Create a new Promise for this connection request
    const connectionPromise = new Promise((resolve) => {
      connectionResolver = resolve;
    });
    
    // Store the pending request
    pendingConnectionRequest = {
      sender,
      sendResponse,
      connectionPromise
    };
    
    // Open the popup to prompt the user
    chrome.action.openPopup();
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
  
  // Handle connection response from the popup
  if (message.type === "wallet_connect_response") {
    if (pendingConnectionRequest && connectionResolver) {
      // Resolve the pending connection promise with the user's decision
      connectionResolver(message.approved);
      
      // If we have a pending response callback, use it
      if (pendingConnectionRequest.sendResponse) {
        pendingConnectionRequest.sendResponse({ approved: message.approved });
      }
      
      // Clear the pending request
      pendingConnectionRequest = null;
      connectionResolver = null;
    }
  }
  
  // Handle standard wallet API requests
  if (message.target === "sea-wallet") {
    handleWalletRequest(message, sender, sendResponse);
    return true; // Indicate we'll respond asynchronously
  }
});

// Handle wallet API requests
async function handleWalletRequest(message, sender, sendResponse) {
  try {
    const { method, params } = message.payload || {};
    
    // Dispatch to the appropriate wallet method
    switch (method) {
      case "connect":
        const result = await seaWallet.features["standard:connect"].connect();
        sendResponse({ success: true, data: result });
        break;
        
      case "signPersonalMessage":
        const signResult = await seaWallet.features["sui:signPersonalMessage"].signPersonalMessage(params);
        sendResponse({ success: true, data: signResult });
        break;
        
      case "signTransaction":
        const txResult = await seaWallet.features["sui:signTransaction"].signTransaction(params);
        sendResponse({ success: true, data: txResult });
        break;
        
      case "signAndExecuteTransaction":
        const execResult = await seaWallet.features["sui:signAndExecuteTransaction"].signAndExecuteTransaction(params);
        sendResponse({ success: true, data: execResult });
        break;
        
      default:
        sendResponse({ success: false, error: "Method not supported" });
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
