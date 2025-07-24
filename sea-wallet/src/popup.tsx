import WalletApp from "~components/WalletApp"
import { Providers } from "./provider"

import "~style.css"

function IndexPopup() {
  return (
    <div style={{ width: "400px", height: "600px", overflow: "hidden" }}>
      <Providers>
        {/* Wrap the WalletApp component with Providers to provide context */}
      <WalletApp />
      </Providers>
    </div>
  )
}

export default IndexPopup
