import { useEffect, useState } from "react"
import storage from "~walletStoreContent"
import Welcome from "~welcom"
import Account from "~Account"
import 'style.css'
function IndexPopup() {
  const [hasWallet, setHasWallet] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkWallet = async () => {
      try {
        const keypairs = await storage.get("kps")
        if (keypairs && Array.isArray(keypairs) && keypairs.length > 0) {
          setHasWallet(true)
        } else {
          setHasWallet(false)
        }
      } catch (error) {
        console.error("Error checking wallet:", error)
        setHasWallet(false)
      } finally {
        setLoading(false)
      }
    }

    checkWallet()
  }, [])

  const handleResetWallet = async () => {
    try {
      await storage.remove("kps")
      await storage.remove("Welcomed")
      setHasWallet(false)
    } catch (error) {
      console.error("Error resetting wallet:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 w-[400px] h-[600px]">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!hasWallet) {
    return <Welcome />
  }

  return <Account onResetWallet={handleResetWallet} />
}

export default IndexPopup
