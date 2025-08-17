
import type { PlasmoCSConfig } from "plasmo"
 
import { relayMessage } from "@plasmohq/messaging"
 
export const config: PlasmoCSConfig = {
  matches: ["*"] // Only relay messages from this domain
}
 
relayMessage({
  name: "ping"
})