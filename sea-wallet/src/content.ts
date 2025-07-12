import { registerWallet } from "@mysten/wallet-standard";
import SeaWallet from "~walletStandard";

// This script runs in the context of web pages and has access to the window object
const wallet = new SeaWallet();
registerWallet(wallet);
