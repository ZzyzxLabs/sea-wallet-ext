// Background script for handling extension-specific logic
// This runs in the service worker context and doesn't have access to the window object
console.log("Sea Wallet background script initialized");import { registerWallet } from "@mysten/wallet-standard";
import SeaWallet from "~walletStandard";

// This script runs in the context of web pages and has access to the window object
const wallet = new SeaWallet();
registerWallet(wallet);
