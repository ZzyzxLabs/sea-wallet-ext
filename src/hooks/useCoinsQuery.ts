/**
 * useCoinsQuery hook
 * 
 * A custom hook that fetches all coins owned by the active account.
 * 
 * @returns {Object} An object containing:
 *  - All properties from the useSuiClientQuery result (data, isLoading, error, etc.)
 *  - account: The currently active account
 * 
 * @example
 * const { data, isLoading, error, account } = useCoinsQuery();
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error loading coins</div>;
 * 
 * console.log('Coins:', data?.data);
 * console.log('Account:', account);
 */


import { useEffect, useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { getActiveAccount } from "../store/store";

export const useCoinsQuery = () => {
  const [account, setAccount] = useState(null);

  // Load the active account when hook is used
  useEffect(() => {
    const loadAccount = async () => {
      try {
        const activeAccount = await getActiveAccount();
        setAccount(activeAccount);
      } catch (error) {
        console.error("Failed to load active account:", error);
      }
    };
    
    loadAccount();
  }, []);

  // Query user's coins
  const coinsQuery = useSuiClientQuery(
    "getAllCoins",
    {
      owner: account?.publicKey,
    },
    {
      enabled: !!account?.publicKey,
      staleTime: 30000,
    }
  );

  return {
    ...coinsQuery,
    account,
  };
};

