import { registerWallet } from "@mysten/wallet-standard";
import SeaWallet from "~walletStandard";
export const config = {
  matches: ["https://*/*", "http://*/*"]
}

// Wait for DOM to be ready
function initializeWallet() {
  try {
    const wallet = new SeaWallet();
    console.log("Sea Wallet: Registering wallet with wallet-standard");
    registerWallet(wallet);
    console.log("Sea Wallet: Wallet registered successfully");
  } catch (error) {
    console.error("Sea Wallet: Error registering wallet:", error);
  }
}

// Ensure window and document are ready
if (document.readyState === "complete" || document.readyState === "interactive") {
  initializeWallet();
} else {
  document.addEventListener("DOMContentLoaded", initializeWallet);
}
