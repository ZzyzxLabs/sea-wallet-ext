import React from 'react';
import { useSuiClientQueries, useSuiClientQuery } from '@mysten/dapp-kit';

import { LoadingSpinnerIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from './icons/StatusIcons';

// Define the Coin interface based on SUI's coin balance structure
interface Coin {
  coinType: string;
  coinObjectCount: number;
  totalBalance: string;
  lockedBalance: object;
}

const addrTest = process.env.PLASMO_PUBLIC_ADDRESS || ""
console.log("Wallet Address:", addrTest);
function WalletDashboard() {
  const { data: coinsData, isLoading: coinIsLoading, error : coinError, isError: coinIsError } = useSuiClientQuery(
    'getAllBalances',
    {
      owner: addrTest
    },
    {
      refetchInterval: 5000, // Refetch every 5 seconds
      enabled: true,
    }
  );
  if(!coinIsLoading)console.log("Coins Data:", coinsData);
  const allCoins = coinsData as Coin[] | undefined;
  const coins = allCoins?.filter(coin => coin.totalBalance !== "0");
  const { data: coinDetailData, isSuccess: coinDetailIsSuccess, isPending: coinDetailIsPending, isError: coinDetailIsError }
  = useSuiClientQueries({
    queries: (coins ?? []).map((coin) => ({
      method: 'getCoinMetadata',
      params: { coinType: coin.coinType }
    })),
    combine:(result) =>{
      return {
        data: result.map((res) => res.data),
        isSuccess: result.every((res) => res.isSuccess),
        isPending: result.some((res) => res.isPending),
        isError: result.some((res) => res.isError),
      };
    }
  }) 
  if(!coinDetailIsPending)console.log("Coin Detail Data:", coinDetailData);
  // Sort coins and coinDetailData by contract hash (coinType/id) ascending
  let sortedCoins: Coin[] = [];
  let sortedCoinDetailData: any[] = [];
  if (coins && coinDetailData) {
    // Pair coins with their detail and sort by coinType/id
    const paired = coins.map((coin, idx) => ({
      coin,
      detail: coinDetailData[idx],
      sortKey: coin.coinType,
    })).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    sortedCoins = paired.map(p => p.coin);
    sortedCoinDetailData = paired.map(p => p.detail);
  } else {
    sortedCoins = coins ?? [];
    sortedCoinDetailData = coinDetailData ?? [];
  }
  // Use sortedCoins and sortedCoinDetailData below
  const newcoins = sortedCoins;
  const newcoinDetailData = sortedCoinDetailData;
  return (
    <div className='h-full w-full flex flex-col items-center'>
      (nav), remember to fill in address above.
      <div className='bg-[#2563eb]/60 h-2/3 w-4/5 rounded-lg mt-8 flex flex-col'>
        <span className='m-4 text-slate-700 hover:text-slate-900 text-xl cursor-default'> Coins </span>
        <div className='overflow-auto scrollbar-hide'>{/*grid*/}
          { !coinDetailIsPending && (
            newcoins?.map((coin, index) => {
              const coinDetail = newcoinDetailData[index];
              return (
                <div key={coin.coinType} className='flex items-center justify-between p-4 border-b border-gray-200'>
                  { coinDetail.iconUrl ? (
                    <img src={coinDetail.iconUrl} alt={`${coinDetail.symbol} icon`} className='w-8 h-8 rounded-full mr-4' />
                  ) : (
                    <div className='w-8 h-8 bg-gray-200 rounded-full mr-4 flex items-center justify-center'>
                      <InformationCircleIcon className='w-6 h-6 text-gray-500' />
                    </div>
                  )}
                  <span className='text-lg font-medium'>{coinDetail?.symbol || 'Unknown Coin'}</span>
                    <div className="flex-1 flex justify-end">
                    <span className='text-sm text-gray-700'>
                      {(Number(coin.totalBalance) / Math.pow(10, Number(coinDetail.decimals))).toFixed(3)} {coinDetail?.symbol}
                    </span>
                    </div>
                </div>
              );
            })
          )}
        </div>
      </div>
        <button
          onClick={() => window.open('https://seawallet.ai', '_blank')}
          className='text-2xl mt-8 p-4 rounded-md bg-gradient-to-t from-cyan-300 to-indigo-400'
        >
          to Sea Vault
        </button>
    </div>
  );
}

export default WalletDashboard;