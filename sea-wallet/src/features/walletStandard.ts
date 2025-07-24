import { type Wallet, SUI_CHAINS,  } from "@mysten/wallet-standard";
import {icon} from "./icon"; 
import type {
    StandardConnectFeature,
    StandardConnectMethod,
    StandardEventsFeature,
    StandardEventsOnMethod,
    SuiFeatures,
    SuiSignPersonalMessageMethod,
    SuiSignTransactionMethod,
    SuiSignAndExecuteTransactionMethod,
    SuiReportTransactionEffectsMethod,
    StandardConnectOutput,
    SuiSignPersonalMessageOutput,
    SignedTransaction,
    SuiSignAndExecuteTransactionOutput
} from "@mysten/wallet-standard";

export class SeaWallet implements Wallet {
    get version(): "1.0.0" {
        // Return the version of the Wallet Standard this implements (in this case, 1.0.0).
        return '1.0.0';
    }
    get name() {
        return 'Sea Wallet ';
    }
    get icon(): `data:image/png;base64,${string}` {
        // A simple wallet icon in SVG format, base64 encoded
        return icon ;
    }
    // Return the Sui chains that your wallet supports.
    get chains() {
        return SUI_CHAINS;
    }
    get accounts() {
        // Return the accounts that your wallet has
        return [];
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
            },
        };
    }

    #on: StandardEventsOnMethod = () => {
        // Your wallet's events on implementation.
        return () => {};
    };

    #connect: StandardConnectMethod = async () => {
        // Your wallet's connect implementation
        return { accounts: [] };
    };

    #signPersonalMessage: SuiSignPersonalMessageMethod = async () => {
        // Your wallet's signPersonalMessage implementation
        throw new Error("Not implemented");
    };

    #signTransaction: SuiSignTransactionMethod = async () => {
        // Your wallet's signTransaction implementation
        throw new Error("Not implemented");
    };

    #signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod = async () => {
        // Your wallet's signAndExecuteTransaction implementation
        throw new Error("Not implemented");
    };

    #reportTransactionEffects: SuiReportTransactionEffectsMethod = async () => {
        // Your wallet's reportTransactionEffects implementation
        throw new Error("Not implemented");
    };
}