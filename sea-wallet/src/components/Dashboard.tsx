import { useState, useEffect, useMemo } from "react"
import {
  useSuiClientQueries,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { getActiveAccount } from "../store/store";

type Asset = {
  id: number
  name: string
  symbol: string
  amount: string
  value: string
  change: string
}

type DashboardProps = {
  address: string
  balance: string
  assets: Asset[]
  onTabChange?: (tab: "assets") => void
}

const Dashboard = ({ address, balance, assets, onTabChange }: DashboardProps) => {
  const [isAddressCopied, setIsAddressCopied] = useState(false)
  const [account, setAccount] = useState(null);

  // Load the active account when component mounts
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

  // Extract unique coin types from the coins data
  const coinTypes = useMemo(() => {
    if (!coinsQuery.data?.data) return [];
    
    const types = new Set<string>();
    coinsQuery.data.data.forEach((coin) => {
      types.add(coin.coinType);
    });
    
    return Array.from(types);
  }, [coinsQuery.data]);

  // Query metadata for each unique coin type
  const coinMetadataQueries = useSuiClientQueries({
    queries: coinTypes.map((coinType) => ({
      method: "getCoinMetadata" as const,
      params: {
        coinType: coinType,
      },
    })),
    combine: (result) => {
      return {
        data: result.map((res, index) => ({
          ...res.data,
          coinType: coinTypes[index],
        })),
        isSuccess: result.every((res) => res.isSuccess),
        isPending: result.some((res) => res.isPending),
        isError: result.some((res) => res.isError),
      };
    },
  });

  // Process coin data to aggregate balances by type (top 5 only)
  const topCoins = useMemo(() => {
    if (!coinsQuery.data?.data || !coinMetadataQueries.data) return [];

    const coinBalances = new Map();

    // Aggregate balances for each coin type
    coinsQuery.data.data.forEach((coin) => {
      const existing = coinBalances.get(coin.coinType) || 0;
      coinBalances.set(coin.coinType, existing + parseInt(coin.balance));
    });

    // Combine with metadata and sort by balance (highest first), then take top 5
    return Array.from(coinBalances.entries())
      .map(([coinType, balance]) => {
        const metadata = coinMetadataQueries.data.find(
          (meta) => meta.coinType === coinType
        );

        return {
          coinType,
          symbol: metadata?.symbol || coinType.split("::").pop() || "Unknown",
          name: metadata?.name || "Unknown Coin",
          balance,
          decimals: metadata?.decimals || 9,
          iconUrl: metadata?.iconUrl,
          formattedBalance: balance / Math.pow(10, metadata?.decimals || 9),
        };
      })
      .sort((a, b) => b.formattedBalance - a.formattedBalance)
      .slice(0, 5); // Only take top 5
  }, [coinsQuery.data, coinMetadataQueries.data]);

  // Top 3 assets by value (fallback to mock data if no real data)
  const topAssets = [...assets].slice(0, 3)

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setIsAddressCopied(true)
    setTimeout(() => setIsAddressCopied(false), 2000)
  }

  return (
    <div className="plasmo-space-y-6">
      {/* Account Section */}
      <div className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-md plasmo-p-6">
        <h2 className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-800 plasmo-mb-4">Account</h2>
        
        <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-4">
          <div>
            <p className="plasmo-text-sm plasmo-text-gray-500">Wallet Address</p>
            <div className="plasmo-flex plasmo-items-center">
              <p className="plasmo-text-gray-700 plasmo-text-xs plasmo-break-all">
                {address}
              </p>
              <button 
                onClick={copyAddress}
                className="plasmo-ml-2 plasmo-text-blue-500 plasmo-text-sm plasmo-whitespace-nowrap"
              >
                {isAddressCopied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="plasmo-mt-4">
          <p className="plasmo-text-sm plasmo-text-gray-500">Total Balance</p>
          <p className="plasmo-text-2xl plasmo-font-bold plasmo-text-gray-800">${balance}</p>
        </div>
      </div>
      
      {/* Assets Preview */}
      <div className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-md plasmo-p-6">
        <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-4">
          <h2 className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-800">Top Assets</h2>
          <button 
            onClick={() => onTabChange?.("assets")}
            className="plasmo-text-blue-500 plasmo-text-sm hover:plasmo-text-blue-600 plasmo-transition"
          >
            View All Assets
          </button>
        </div>
        
        {coinsQuery.isLoading || coinMetadataQueries.isPending ? (
          <div className="plasmo-py-4 plasmo-text-center plasmo-text-gray-500">
            Loading assets...
          </div>
        ) : coinsQuery.isError ? (
          <div className="plasmo-py-4 plasmo-text-center plasmo-text-red-500">
            Error loading assets
          </div>
        ) : topCoins.length > 0 ? (
          <div className="plasmo-space-y-3">
            <div className="plasmo-grid plasmo-grid-cols-4 plasmo-gap-2 plasmo-text-sm plasmo-font-medium plasmo-text-gray-600 plasmo-border-b plasmo-border-gray-200 plasmo-pb-2">
              <div>Symbol</div>
              <div>Name</div>
              <div>Balance</div>
              <div>Type</div>
            </div>
            
            {topCoins.map((coin, index) => (
              <div key={coin.coinType} className="plasmo-grid plasmo-grid-cols-4 plasmo-gap-2 plasmo-py-2 plasmo-border-b plasmo-border-gray-100 plasmo-items-center">
                <div className="plasmo-flex plasmo-items-center">
                  {coin.iconUrl && (
                    <img
                      src={coin.iconUrl}
                      alt={coin.symbol}
                      className="plasmo-w-5 plasmo-h-5 plasmo-mr-2 plasmo-rounded-full"
                    />
                  )}
                  <span className="plasmo-font-medium plasmo-text-gray-800">{coin.symbol}</span>
                </div>
                <div className="plasmo-text-gray-600 plasmo-text-sm plasmo-truncate">
                  {coin.name}
                </div>
                <div className="plasmo-font-mono plasmo-text-gray-800 plasmo-text-sm">
                  {coin.formattedBalance.toLocaleString(undefined, {
                    maximumFractionDigits: Math.min(coin.decimals, 4),
                    minimumFractionDigits: coin.formattedBalance >= 1 ? 2 : Math.min(coin.decimals, 2),
                  })}
                </div>
                <div className="plasmo-text-xs plasmo-text-gray-500 plasmo-truncate">
                  {coin.coinType.includes("::") ? 
                    (() => {
                      const parts = coin.coinType.split("::");
                      if (parts.length > 2) {
                        const address = parts[0];
                        if (address.length > 10) {
                          const prefix = address.substring(0, 4);
                          const suffix = address.substring(address.length - 4);
                          return `${prefix}...${suffix}`;
                        }
                      }
                      return coin.coinType;
                    })() : 
                    coin.coinType
                  }
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="plasmo-py-4 plasmo-text-center plasmo-text-gray-500">
            No assets found in your wallet
          </div>
        )}
      </div>
      
      {/* Recent Activity (placeholder) */}
      <div className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-md plasmo-p-6">
        <h2 className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-800 plasmo-mb-2">Recent Activity</h2>
        <p className="plasmo-text-gray-500 plasmo-text-sm">No recent transactions</p>
      </div>
    </div>
  )
}

export default Dashboard
