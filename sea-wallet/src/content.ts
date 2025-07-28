import type { PlasmoCSConfig } from "plasmo"
 
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN"
}

import { registerWallet } from "@iota/wallet-standard"
import {SeaWallet} from "./features/walletStandard";

registerWallet(new SeaWallet());
console.log("Hello Main World")