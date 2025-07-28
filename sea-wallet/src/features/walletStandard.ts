import { type Wallet, SUPPORTED_CHAINS,  } from "@iota/wallet-standard";
import { SUI_CHAINS } from "@mysten/wallet-standard";
import {icon} from "./icon"; 
import type {
    StandardConnectFeature,
    StandardConnectMethod,
    StandardEventsFeature,
    StandardEventsOnMethod,
    IotaFeatures,
    IotaSignPersonalMessageMethod,
    IotaSignTransactionMethod,
    IotaSignAndExecuteTransactionMethod,
    IotaReportTransactionEffectsMethod,
    StandardConnectOutput,
    IotaSignPersonalMessageOutput,
    SignedTransaction,
    IotaSignAndExecuteTransactionOutput
} from "@iota/wallet-standard";
import type { SuiFeatures } from "@mysten/wallet-standard";
import { ETHEREUM_CHAINS } from "@wallet-standard/ethereum";

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
        return SUPPORTED_CHAINS.concat(SUI_CHAINS, ETHEREUM_CHAINS);
    }
    get accounts() {
        // Return the accounts that your wallet has
        return [];
    }
    get features(): StandardConnectFeature & StandardEventsFeature & IotaFeatures & SuiFeatures {
        return {
            "standard:connect": {
                version: "1.0.0",
                connect: this.#connect,
            },
            "standard:events": {
                version: "1.0.0",
                on: this.#on,
            },
            "iota:signPersonalMessage": {
                version: "1.0.0",
                signPersonalMessage: this.#signPersonalMessage,
            },
            "iota:signTransaction": {
                version: "2.0.0",
                signTransaction: this.#signTransaction,
            },
            "iota:signAndExecuteTransaction": {
                version: "2.0.0",
                signAndExecuteTransaction: this.#signAndExecuteTransaction,
            },
            "iota:reportTransactionEffects": {
                version: "1.0.0",
                reportTransactionEffects: this.#reportTransactionEffects,
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

    #signPersonalMessage: IotaSignPersonalMessageMethod = async () => {
        // Your wallet's signPersonalMessage implementation
        throw new Error("Not implemented");
    };

    #signTransaction: IotaSignTransactionMethod = async () => {
        // Your wallet's signTransaction implementation
        throw new Error("Not implemented");
    };

    #signAndExecuteTransaction: IotaSignAndExecuteTransactionMethod = async () => {
        // Your wallet's signAndExecuteTransaction implementation
        throw new Error("Not implemented");
    };

    #reportTransactionEffects: IotaReportTransactionEffectsMethod = async () => {
        // Your wallet's reportTransactionEffects implementation
        throw new Error("Not implemented");
    };
}