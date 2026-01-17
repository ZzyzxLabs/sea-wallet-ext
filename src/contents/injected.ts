// import { registerWallet } from "@mysten/wallet-standard"
import { registerWallet } from "@iota/wallet-standard"
import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import { SeaWallet } from "../features/walletStandard"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  world: "MAIN"
}

registerWallet(new SeaWallet())
console.log("Hello Main World")

// Wrap async code in an async function and execute it immediately
async function connectToBackground() {
  let res
  console.log("Connecting to background...")
  // const extensionId = chrome.runtime.id
  // console.log("Extension ID:", extensionId)
  res = await sendToBackground({
    name: "connect",
    body: {
      site: window.location.origin,
      icon: `${window.location.origin}/favicon.ico`
    },
    extensionId: 'anaeleemhdicpgmclmdijcmadhmeipfp'
  })
  console.log("Response from background:", res)
}

// Call the async function
connectToBackground()
