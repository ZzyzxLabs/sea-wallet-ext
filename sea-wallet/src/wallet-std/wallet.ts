import {
  SUI_DEVNET_CHAIN,
  SUI_TESTNET_CHAIN,
  SUI_MAINNET_CHAIN,
  type Wallet,
  ReadonlyWalletAccount,
  type StandardConnectFeature,
  type StandardConnectMethod,
  type StandardEventsFeature,
  type StandardEventsOnMethod,
  type StandardEventsListeners,
  type StandardEventsNames,
  type SuiFeatures,
  type SuiSignPersonalMessageMethod,
  type SuiSignTransactionMethod,
  type SuiSignAndExecuteTransactionMethod,
  type SuiReportTransactionEffectsMethod,
  type WalletAccount,
  type SuiSignPersonalMessageInput,
  type SuiSignPersonalMessageOutput,
  type SuiSignTransactionInput,
  type SignedTransaction,
  type SuiSignAndExecuteTransactionInput,
  type SuiSignAndExecuteTransactionOutput,
  type SuiReportTransactionEffectsInput,
} from "@mysten/wallet-standard";

// --- Mock Storage ---
// To make this code self-contained and runnable, we'll create a mock storage object.
// In a real extension, this would interact with `chrome.storage.local` or similar.
const mockDb = {
  accounts: [],
  isConnected: false,
};

const walletStorage = {
  async getAccounts() {
    return mockDb.accounts;
  },
  async saveAccounts(accounts: any[]) {
    mockDb.accounts = accounts;
  },
  async getConnectionState() {
    return mockDb.isConnected;
  },
  async saveConnectionState(isConnected: boolean) {
    mockDb.isConnected = isConnected;
  },
};
// --- End Mock Storage ---


// A dummy account for default values and demonstration.
const DUMMY_ACCOUNT_FEATURES = [
    'sui:signPersonalMessage',
    'sui:signTransaction',
    'sui:signAndExecuteTransaction',
] as const;

/**
 * A complete, self-contained implementation of a Sui-compatible wallet
 * adhering to the Wallet Standard.
 */
export class SeaWallet implements Wallet {
  // --- Private State ---
  // The list of accounts the wallet currently holds.
  // This is the source of truth for the `accounts` getter.
  #accounts: readonly ReadonlyWalletAccount[] = [];

  // A map to store event listeners provided by dApps.
  // The key is the event name (e.g., 'change'), and the value is a Set of callback functions.
  #eventListeners: Map<StandardEventsNames, Set<StandardEventsListeners[StandardEventsNames]>> = new Map();

  // --- Wallet Standard Properties ---

  // The version of the Wallet Standard this wallet implements.
  get version() {
    return "1.0.0" as const;
  }

  // The name of the wallet.
  get name() {
    return "Sea Wallet";
  }

  // A base64 encoded data URL for the wallet's icon.
  get icon() {
    return "data:image/png;base64,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" as const;
  }

  // The list of Sui chains this wallet supports.
  get chains() {
    return [SUI_DEVNET_CHAIN, SUI_TESTNET_CHAIN, SUI_MAINNET_CHAIN] as const;
  }

  // The currently connected accounts. This is a readonly array.
  // It is empty until a connection is established.
  get accounts() {
    return this.#accounts;
  }

  // The dictionary of features this wallet supports.
  // dApps use this to discover and call wallet methods.
  get features(): StandardConnectFeature & StandardEventsFeature & SuiFeatures {
    return {
      "standard:connect": {
        version: "1.0.0",
        connect: this.#connect,
      },
      "standard:events": {
        version: "1.0.0",
        on: this.#on,
      },
      "sui:signPersonalMessage": {
        version: "1.1.0",
        signPersonalMessage: this.#signPersonalMessage,
      },
      "sui:signTransaction": {
        version: "2.0.0",
        signTransaction: this.#signTransaction,
      },
      "sui:signAndExecuteTransaction": {
        version: "2.0.0",
        signAndExecuteTransaction: this.#signAndExecuteTransaction,
      },
      "sui:reportTransactionEffects": {
        version: "1.0.0",
        reportTransactionEffects: this.#reportTransactionEffects,
      },
    };
  }

  // --- Core Methods ---

  /**
   * The `connect` method is called by a dApp to initiate a connection.
   */
  #connect: StandardConnectMethod = async () => {
    // If we are already connected (i.e., we have accounts), return them immediately.
    if (this.#accounts.length > 0) {
      return { accounts: this.accounts };
    }

    // 1. Ask the user for permission to connect.
    const approved = await this.#openConnectionModal();
    if (!approved) {
      throw new Error("Connection request rejected by user.");
    }

    // 2. Once approved, load any existing accounts from storage.
    await this.#loadAccountsFromStorage();

    // 3. If no accounts exist after loading, create a default one.
    if (this.#accounts.length === 0) {
      await this.#createAndAddAccount("Default Account");
    }
    
    // 4. Set the connection state in storage.
    await walletStorage.saveConnectionState(true);

    // 5. CRITICAL: Emit the 'change' event to notify the dApp that the
    //    connection is complete and accounts are available.
    this.#emit("change", { accounts: this.accounts });

    // 6. Return the newly populated accounts.
    return { accounts: this.accounts };
  };

  /**
   * The `on` method is called by dApps to subscribe to wallet events.
   */
  #on: StandardEventsOnMethod = (event, listener) => {
    let listeners = this.#eventListeners.get(event);
    if (!listeners) {
      listeners = new Set();
      this.#eventListeners.set(event, listeners);
    }
    listeners.add(listener);

    // Return a function that the dApp can call to unsubscribe.
    return () => {
      const listeners = this.#eventListeners.get(event);
      listeners?.delete(listener);
    };
  };

  /**
   * A private helper to emit events to all registered listeners.
   */
  #emit<E extends StandardEventsNames>(
    event: E,
    data: Parameters<StandardEventsListeners[E]>[0]
  ): void {
    const listeners = this.#eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        listener(data);
      });
    }
  }


  // --- Account Management Helpers ---

  /**
   * Loads accounts from our mock storage and populates the internal state.
   */
  async #loadAccountsFromStorage() {
    const storedAccounts = await walletStorage.getAccounts();
    if (storedAccounts && storedAccounts.length > 0) {
      this.#accounts = storedAccounts.map(
        (acc) =>
          new ReadonlyWalletAccount({
            address: acc.address,
            publicKey: new Uint8Array(acc.publicKey),
            chains: this.chains,
            features: DUMMY_ACCOUNT_FEATURES,
            label: acc.label,
          })
      );
    }
  }

  /**
   * Creates a new dummy account, adds it to the internal list, and saves to storage.
   */
  async #createAndAddAccount(label: string) {
    const newAccount = new ReadonlyWalletAccount({
      address: `0x${(this.#accounts.length + 1).toString().padStart(64, "0")}`,
      publicKey: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
      chains: this.chains,
      features: DUMMY_ACCOUNT_FEATURES,
      label,
    });

    // Update the internal accounts list.
    this.#accounts = [...this.#accounts, newAccount];

    // Save the updated list back to storage.
    await walletStorage.saveAccounts(
      this.#accounts.map((acc) => ({
        address: acc.address,
        publicKey: Array.from(acc.publicKey),
        label: acc.label,
      }))
    );
  }

  // --- Signing Methods (Dummy Implementations) ---

  #signPersonalMessage: SuiSignPersonalMessageMethod = async ({ message, account }) => {
    console.log("Signing personal message for account:", account.address);
    console.log("Message:", message);

    // In a real wallet, you would show a prompt and sign with the private key.
    const dummySignature = new Uint8Array(Array(64).fill(1));
    return {
      bytes: Buffer.from(message).toString("base64"),
      signature: Buffer.from(dummySignature).toString("base64"),
    };
  };

  #signTransaction: SuiSignTransactionMethod = async ({ transaction, account }) => {
    console.log("Signing transaction for account:", account.address);
    console.log("Transaction:", transaction);

    // In a real wallet, you would show a prompt and sign with the private key.
    const dummySignature = new Uint8Array(Array(64).fill(2));
    return {
      bytes: await transaction.toJSON(),
      signature: Buffer.from(dummySignature).toString("base64"),
    };
  };

  #signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod = async ({ transaction, account }) => {
    console.log("Signing and executing transaction for account:", account.address);
    console.log("Transaction:", transaction);

    // In a real wallet, you would sign and then submit to the Sui network.
    const dummyDigest = `0x${"abc".padStart(64, "0")}`;
    const dummySignature = new Uint8Array(Array(64).fill(2));
    const dummyEffects = {
        status: { status: 'success' },
        transactionDigest: dummyDigest,
        // ... other dummy effect fields
    };

    return {
      digest: dummyDigest,
      effects: JSON.stringify(dummyEffects),
      bytes: await transaction.toJSON(),
      signature: Buffer.from(dummySignature).toString("base64"),
    };
  };

  #reportTransactionEffects: SuiReportTransactionEffectsMethod = async (input) => {
    console.log("Received transaction effects report:", input.effects);
    // In a real wallet, you would parse these effects to update internal state
    // like balances and object ownership.
    return;
  };


  // --- UI Interaction ---

  /**
   * Simulates opening a popup modal to ask for user's connection approval.
   * In a real browser extension, this would involve creating a new window or tab.
   */
  async #openConnectionModal(): Promise<boolean> {
    return new Promise((resolve) => {
      // Using window.confirm as a simple, synchronous way to get user input for this demo.
      const approved = window.confirm(
        "A dApp wants to connect to your Sea Wallet.\n\nDo you approve?"
      );
      resolve(approved);
    });
  }
}
