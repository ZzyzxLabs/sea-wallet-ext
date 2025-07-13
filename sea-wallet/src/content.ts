import { registerWallet } from "@mysten/wallet-standard";
import SeaWallet from "~walletStandard";
export const config = {
  matches: ["https://*/*", "http://*/*"]
}
import { SUI_CHAINS, Wallet } from '@mysten/wallet-standard';

if (typeof window !== "undefined") {
  // 可以安全使用 window
  console.log(window.location.href)
}
// Wait for DOM to be ready
function initializeWallet() {
  try {
    const wallet = new SeaWallet();
    console.log("Sea Wallet: Registering wallet with wallet-standard");
    console.log("Sea Wallet: ", wallet);
    console.log("Sea Wallet: ", );
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
