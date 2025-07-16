import { SecureStorage } from "@plasmohq/storage/secure"

const storage = new SecureStorage()

// Initialize storage with password
async function initializeStorage() {
    try {
        // Try to set password - this is safe to call multiple times
        await storage.setPassword("sea-wallet-ext"); // to change to .env
    } catch (error) {
        console.error("Error initializing storage:", error);
    }
}

// Initialize storage immediately
initializeStorage();

export default storage