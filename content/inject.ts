import { registerWallet } from "@mysten/wallet-standard"


import { SeaWallet } from "./walletStandard"

registerWallet(new SeaWallet())
console.log("Hello Main World")
