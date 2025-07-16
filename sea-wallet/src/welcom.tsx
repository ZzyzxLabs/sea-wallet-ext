import storage from "~walletStoreContent";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { useState, useEffect } from "react";

export default function Welcome(){
    const [secStep, setSecStep] = useState(false);
    const [isWelcomed, setIsWelcomed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkWelcomed = async () => {
            try {
                const welcomed = await storage.get("Welcomed");
                setIsWelcomed(!welcomed); // Show welcome if not welcomed yet
            } catch (error) {
                console.error("Error checking welcomed status:", error);
                setIsWelcomed(true); // Show welcome screen on error
            } finally {
                setLoading(false);
            }
        };
        checkWelcomed();
    }, []);

    async function createKeypair() {
        try {
            const keypair = new Ed25519Keypair();
            await storage.set('kps', [keypair]);
            await storage.set('Welcomed', true);
            setSecStep(true);
        } catch (error) {
            console.error("Error creating keypair:", error);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4 bg-gray-50 w-[400px] h-[600px]">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return(
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 w-[400px] h-[600px]">
            {isWelcomed && !secStep && (
                <div className="text-center p-8 bg-white rounded-lg shadow-md w-full">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome to Sea Wallet</h1>
                        <p className="mb-6 text-gray-600">Create a secure wallet to manage your digital assets.</p>
                    </div>
                    <button 
                        onClick={createKeypair}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Create Wallet
                    </button>
                </div>
            )}
            {secStep && (
                <div className="text-center p-8 bg-white rounded-lg shadow-md w-full">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-green-600">Wallet Created!</h2>
                    <p className="text-gray-600 mb-4">Your wallet has been successfully created.</p>
                    <p className="text-sm text-gray-500">Please close and reopen the extension to access your wallet.</p>
                </div>
            )}
        </div>
    )
}