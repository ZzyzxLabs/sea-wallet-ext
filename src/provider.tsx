"use client";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { networkConfig } from './networkConfig';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
            <WalletProvider autoConnect >
              {children}
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
  );
}