
import type { PlasmoCSConfig } from "plasmo"

import { relayMessage } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"] // Only relay messages from this domain
}

relayMessage({
  name: "ping"
})