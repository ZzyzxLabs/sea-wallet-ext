import React from 'react';
import { useSuiClientQueries, useSuiClientQuery } from '@mysten/dapp-kit';

import { LoadingSpinnerIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from './icons/StatusIcons';
const addrTest = ""
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
      <div className='bg-[#2563eb]/60 h-2/3 w-4/5 rounded-lg mt-8'>
        <span className='m-4 text-slate-700 hover:text-slate-900 text-xl cursor-default'> Coins </span>
        <div className='overflow-auto grid-rows-3'>{/*grid*/}
          { !coinDetailIsPending && (
            newcoins?.map((coin, index) => {
              const coinDetail = newcoinDetailData[index];
              return (
                <div key={coin.coinType} className='flex items-center justify-between p-4 border-b border-gray-200'>
                  <span className='text-lg font-medium'>{coinDetail?.symbol || 'Unknown Coin'}</span>
                  <span className='text-sm text-gray-500'>
                    {(Number(coin.totalBalance) / Math.pow(10, Number(coinDetail.decimals))).toFixed(3)} {coinDetail?.symbol}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default WalletDashboard;