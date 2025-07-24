import { Transaction } from "@mysten/sui/transactions";
import { fromHex, toHex } from "@mysten/bcs";
import { bcs } from "@mysten/sui/bcs";
import { coinWithBalance } from "@mysten/sui/transactions";

const coinTx = (destination: string, amount: number, coins: string[], sui?: boolean) => {
  const tx = new Transaction();
  
  if (coins.length === 0) {
    throw new Error("No coins provided");
  }
  
  // If we have multiple coins, merge them all into the first coin
  if (coins.length > 1) {
    const [primaryCoin, ...sourceCoins] = coins;
    // Merge all source coins into the primary coin
    tx.mergeCoins(tx.object(primaryCoin), sourceCoins.map(coin => tx.object(coin)));
  }
  
  // Split the specified amount from the primary coin (or gas coin for SUI)
  const coinToUse = sui ? tx.gas : tx.object(coins[0]);
  const [splitCoin] = tx.splitCoins(coinToUse, [amount]);
  
  // Transfer the split coin to the destination
  tx.transferObjects([splitCoin], destination);
  
  return tx;
};

export default { coinTx };