import type { PlasmoMessaging } from "@plasmohq/messaging"

// Define the request and response types for better type checking
export type ConnectRequest = {
  site: string
  icon: string
}

export type ConnectResponse = {
  success: boolean
  message: string
  site?: string
}

const handler: PlasmoMessaging.MessageHandler<ConnectRequest, ConnectResponse> = async (req, res) => {
  console.log("Received connection request from site:", req.body.site)
  
  try {
    // Here you would handle the connection request
    // For example, you might show a popup to the user asking for permission
    
    // For now, we'll just send a success response
    res.send({
      success: true,
      message: "Connection request received",
      site: req.body.site
    })
  } catch (error) {
    console.error("Error handling connect request:", error)
    res.send({
      success: false,
      message: "Error processing connection request"
    })
  }
}

export default handler