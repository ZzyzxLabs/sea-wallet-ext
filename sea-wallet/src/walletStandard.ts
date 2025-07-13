import { SUI_CHAINS, type Wallet } from '@mysten/wallet-standard';
import type {
    StandardConnectFeature,
    StandardConnectMethod,
    StandardEventsFeature,
    StandardEventsOnMethod,
    StandardEventsListeners,
    StandardEventsNames,
    SuiFeatures,
    SuiSignPersonalMessageMethod,
    SuiSignTransactionMethod,
    SuiSignAndExecuteTransactionMethod,
    SuiReportTransactionEffectsMethod,
} from "@mysten/wallet-standard";
import { ReadonlyWalletAccount } from '@mysten/wallet-standard';

// Interface for wallet accounts
interface WalletAccount {
    suiAddress: string;
    pubkey: Uint8Array;
    keypair?: any; // Placeholder for keypair, can be replaced with a specific type later
    active?: boolean; // Optional property to indicate if the account is active
}

class SeaWallet implements Wallet {
    private someWalletAccounts: WalletAccount[] = [];
    #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } = {};
    #connected = false;

    constructor(accounts: WalletAccount[] = []) {
        this.someWalletAccounts = accounts;
    }

    // Method to update the wallet accounts
    public setAccounts(accounts: WalletAccount[]): void {
        this.someWalletAccounts = accounts;
        this.#emit("change", { accounts: this.accounts });
    }

    get version(): "1.0.0" {
        // Return the version of the Wallet Standard this implements (in this case, 1.0.0).
        return '1.0.0';
    }
    get name() {
        return 'Wallet Name';
    }
    get icon(): `data:image/svg+xml;base64,${string}` | `data:image/webp;base64,${string}` | `data:image/png;base64,${string}` | `data:image/gif;base64,${string}` {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8//8/AwAI/wH+9Q4AAAAASUVORK5CYII='; // Placeholder icon
    }
    // Return the Sui chains that your wallet supports.
    get chains() {
        return SUI_CHAINS;
    }
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
            }
        };
    }
    #on: StandardEventsOnMethod = (event, listener) => {
        this.#listeners[event]?.push(listener) || (this.#listeners[event] = [listener]);
        return () => {
            this.#listeners[event] = this.#listeners[event]?.filter(
                (existingListener) => listener !== existingListener,
            );
        };
    };

    #connect: StandardConnectMethod = async (input) => {
        if (!this.#connected) {
            if (input?.silent) {
                return { accounts: [] };
            }
            // Here you would typically prompt the user to connect to the dApp.
            // For this example, we'll just simulate a successful connection.
            this.#connected = true;
            this.#emit("change", { accounts: this.accounts });
        }
        return { accounts: this.accounts };
    };

    #signPersonalMessage: SuiSignPersonalMessageMethod = async ({ message }) => {
        // Example implementation: sign the message with the active account's keypair
        const activeAccount = this.someWalletAccounts.find(acc => acc.active && acc.keypair);
        if (!activeAccount || !activeAccount.keypair?.signPersonalMessage) {
            throw new Error("No active account or signing method not available.");
        }
        const signature = await activeAccount.keypair.signPersonalMessage(message);
        // Encode the message bytes as base64
        const bytes = Buffer.from(message).toString('base64');
        return {
            bytes,
            signature: typeof signature === 'string' ? signature : Buffer.from(signature).toString('base64'),
        };
    };

    #signTransaction: SuiSignTransactionMethod = () => {
        // Your wallet's signTransaction implementation
    };

    #signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod = () => {
        // Your wallet's signAndExecuteTransaction implementation
    };

    #reportTransactionEffects: SuiReportTransactionEffectsMethod = () => {
        // Your wallet's reportTransactionEffects implementation
    };

    #emit<E extends StandardEventsNames>(
        event: E,
        ...args: Parameters<NonNullable<StandardEventsListeners[E]>>
    ): void {
        this.#listeners[event]?.forEach((listener) => {
            // @ts-expect-error The listener and args are guaranteed to be compatible.
            listener(...args);
        });
    }

    get accounts() {
        // Assuming we already have some internal representation of accounts:
        return this.someWalletAccounts.map(
            (walletAccount) =>
                // Return
                new ReadonlyWalletAccount({
                    address: walletAccount.suiAddress,
                    publicKey: walletAccount.pubkey,
                    // The Sui chains that your wallet supports.
                    chains: SUI_CHAINS,
                    // The features that this account supports. This can be a subset of the wallet's supported features.
                    // These features must exist on the wallet as well.
                    features: [
                        'sui:signPersonalMessage',
                        'sui:signTransactionBlock',
                        'sui:signAndExecuteTransaction',
                    ],
                }),
        );
    }
}

export default SeaWallet;