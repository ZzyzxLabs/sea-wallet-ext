import type { PlasmoCSConfig } from "plasmo"
 
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN"
}

import { registerWallet } from "@iota/wallet-standard"
import {SeaWallet} from "./features/walletStandard";
import { sendToBackground } from "@plasmohq/messaging"

registerWallet(new SeaWallet());
console.log("Hello Main World")

// Wrap async code in an async function and execute it immediately
async function connectToBackground() {
  let res;
  console.log("Getting extension ID")
  const extensionId = chrome.runtime.id
  console.log("Extension ID:", extensionId)
  try {
    res = await sendToBackground({
      name: "connect",
      body: {
        site: window.location.origin,
        icon: `${window.location.origin}/favicon.ico`
      }
    });
    console.log("Response from background:", res);
  } catch (error) {
    console.error("Error connecting to background:", error);
    res = { error: "Failed to connect to background" };
    console.log("Response from background:", res);
  }
}

// Call the async function
connectToBackground();