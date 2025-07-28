import WalletApp from "~components/WalletApp"
import Main from "~Main"
import { Providers } from "./provider"

import "~style.css"

function IndexPopup() {
  return (
    <div style={{ width: "400px", height: "600px", overflow: "hidden" }}>
      <Providers>
        <Main />
      </Providers>
    </div>
  )
}

export default IndexPopup
