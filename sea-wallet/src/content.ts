// Content script to handle communication between dApps and the extension

// Listen for messages from the page
window.addEventListener("message", (event) => {
  // Only accept messages from the current window
  if (event.source !== window) return;

  // Check if the message is for our wallet
  if (event.data.target === "sea-wallet") {
    // Forward the message to our background script
    chrome.runtime.sendMessage(event.data, (response) => {
      // Send the response back to the page
      window.postMessage(
        {
          target: "sui-wallet-response",
          payload: response,
          id: event.data.id
        },
        "*"
      );
    });
  }
});

// Inject a script into the page that announces our wallet's presence
// This helps dApps discover our wallet
const script = document.createElement("script");
script.textContent = `
  // Announce that Sea Wallet is available
  window.dispatchEvent(new CustomEvent("wallet-standard:register-wallet", {
    detail: {
      name: "Sea Wallet",
      icon: "data:image/png;base64,iVBOR[...rest of your icon base64...]",
      version: "1.0.0"
    }
  }));
`;
(document.head || document.documentElement).appendChild(script);
script.remove();
