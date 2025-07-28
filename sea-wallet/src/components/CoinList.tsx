"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  useSuiClientQueries,
} from "@mysten/dapp-kit";

// Import custom hooks
import { useCoinsQuery } from "../hooks/useCoinsQuery";
// Import wallet store
import { getActiveAccount } from "../store/store";

const CoinList = () => {
  // Use the custom hook to get coins data
  const coinsQuery = useCoinsQuery();
  const { account } = coinsQuery;

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

  // Process coin data to aggregate balances by type
  const processedCoins = useMemo(() => {
    if (!coinsQuery.data?.data || !coinMetadataQueries.data) return [];

    const coinBalances = new Map();

    // Aggregate balances for each coin type
    coinsQuery.data.data.forEach((coin) => {
      const existing = coinBalances.get(coin.coinType) || 0;
      coinBalances.set(coin.coinType, existing + parseInt(coin.balance));
    });

    // Combine with metadata and sort by balance (highest first)
    return Array.from(coinBalances.entries())
      .map(([coinType, balance]) => {
        const metadata = coinMetadataQueries.data.find(
          (meta) => meta.coinType === coinType
        );

        // Format coin type for display
        let displayType = coinType;
        if (coinType.includes("::")) {
          const parts = coinType.split("::");
          if (parts.length > 2) {
            const address = parts[0];
            if (address.length > 10) {
              const prefix = address.substring(0, 7);
              const suffix = address.substring(address.length - 5);
              displayType = `${prefix}...${suffix}::${parts.slice(1).join("::")}`;
            }
          }
        }

        return {
          coinType,
          displayType,
          symbol: metadata?.symbol || coinType.split("::").pop() || "Unknown",
          name: metadata?.name || "Unknown Coin",
          balance,
          decimals: metadata?.decimals || 9,
          iconUrl: metadata?.iconUrl,
          formattedBalance: balance / Math.pow(10, metadata?.decimals || 9),
        };
      })
      .sort((a, b) => b.formattedBalance - a.formattedBalance); // Sort by balance descending
  }, [coinsQuery.data, coinMetadataQueries.data]);

  // Log data for debugging
  useEffect(() => {
    if (coinsQuery.data) {
      console.log("User coins:", coinsQuery.data);
    }
  }, [coinsQuery.data]);

  useEffect(() => {
    if (coinMetadataQueries.data) {
      console.log("Coin metadata:", coinMetadataQueries.data);
    }
  }, [coinMetadataQueries.data]);

  if (!account) {
    return (
      <div className="plasmo-flex plasmo-justify-center plasmo-items-center plasmo-w-full plasmo-h-fit plasmo-bg-white/30">
        <div className="plasmo-rounded-lg plasmo-p-4 plasmo-mb-4 plasmo-w-full">
          <div className="plasmo-text-center plasmo-text-gray-500">
            Please create an account to view your assets
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="plasmo-flex plasmo-justify-center plasmo-items-center plasmo-w-full plasmo-h-fit">
      <div className="plasmo-rounded-lg plasmo-p-4 plasmo-mb-4 plasmo-w-full">
        <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-3">
          <h3 className="plasmo-text-lg plasmo-text-gray-800 plasmo-font-medium">Your Assets</h3>
          <button
            onClick={() => {
              coinsQuery.refetch();
            }}
            className="plasmo-px-3 plasmo-py-1 plasmo-bg-blue-500 plasmo-text-white plasmo-text-sm plasmo-rounded hover:plasmo-bg-blue-600 plasmo-transition"
          >
            Refresh
          </button>
        </div>

        <div className="plasmo-grid plasmo-grid-cols-4 plasmo-gap-2">
          <div className="plasmo-text-black plasmo-font-medium">Symbol</div>
          <div className="plasmo-text-black plasmo-font-medium">Name</div>
          <div className="plasmo-text-black plasmo-font-medium">Balance</div>
          <div className="plasmo-text-black plasmo-font-medium">Type</div>

          {coinsQuery.isLoading || coinMetadataQueries.isPending ? (
            <div className="plasmo-col-span-4 plasmo-py-4 plasmo-text-center plasmo-text-gray-500">
              Loading assets...
            </div>
          ) : coinsQuery.isError ? (
            <div className="plasmo-col-span-4 plasmo-py-4 plasmo-text-center plasmo-text-red-500">
              Error loading assets
            </div>
          ) : processedCoins.length > 0 ? (
            processedCoins.map((coin, index) => (
              <React.Fragment key={coin.coinType}>
                <div className="plasmo-py-2 plasmo-border-t plasmo-text-black plasmo-border-gray-700 plasmo-flex plasmo-items-center">
                  {coin.iconUrl && (
                    <img
                      src={coin.iconUrl}
                      alt={coin.symbol}
                      className="plasmo-w-5 plasmo-h-5 plasmo-mr-2 plasmo-rounded-full"
                    />
                  )}
                  <span className="plasmo-font-medium">{coin.symbol}</span>
                </div>
                <div className="plasmo-py-2 plasmo-border-t plasmo-text-black plasmo-border-gray-700">
                  {coin.name}
                </div>
                <div className="plasmo-py-2 plasmo-border-t plasmo-text-black plasmo-border-gray-700 plasmo-font-mono">
                  {coin.formattedBalance.toLocaleString(undefined, {
                    maximumFractionDigits: Math.min(coin.decimals, 6), // Limit to 6 decimal places for better readability
                    minimumFractionDigits: coin.formattedBalance >= 1 ? 2 : Math.min(coin.decimals, 4),
                  })}
                </div>
                <div className="plasmo-py-2 plasmo-border-t plasmo-text-black plasmo-border-gray-700">
                  <span className="plasmo-text-xs plasmo-text-gray-500">
                    {coin.displayType}
                  </span>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="plasmo-col-span-4 plasmo-py-4 plasmo-text-center plasmo-text-gray-500">
              No assets found in your wallet
            </div>
          )}
        </div>

        {processedCoins.length > 0 && (
          <div className="plasmo-mt-4 plasmo-pt-3 plasmo-border-t plasmo-border-gray-300">
            <div className="plasmo-flex plasmo-justify-between plasmo-text-sm plasmo-text-gray-600">
              <span>Total coin types: {processedCoins.length}</span>
              <span>
                Total coins: {coinsQuery.data?.data?.length || 0}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinList;
