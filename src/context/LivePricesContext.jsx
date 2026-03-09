import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cryptoData as BASE_DATA } from '../data/cryptoData';

const STABLECOINS = new Set(['tether', 'usdc', 'usdt', 'dai', 'busd']);

function randomFluctuation(pct = 0.002) {
  return 1 + (Math.random() * pct * 2 - pct);
}

const LivePricesContext = createContext(null);

export function LivePricesProvider({ children }) {
  const [prices, setPrices] = useState(() =>
    BASE_DATA.map(coin => ({ ...coin, _dir: null, _tick: 0 }))
  );
  const prevRef = useRef(prices);

  useEffect(() => {
    const id = setInterval(() => {
      setPrices(prev => {
        const next = prev.map(coin => {
          if (STABLECOINS.has(coin.id)) return coin;
          const drift = randomFluctuation(0.004);
          const newPrice = Math.max(0.0001, coin.price * drift);
          const dir = drift >= 1 ? 'up' : 'down';
          const changeDelta = (drift - 1) * 100;
          return {
            ...coin,
            price: newPrice,
            change24h: parseFloat((coin.change24h + changeDelta).toFixed(2)),
            _dir: dir,
            _tick: coin._tick + 1,
          };
        });
        prevRef.current = next;
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <LivePricesContext.Provider value={prices}>
      {children}
    </LivePricesContext.Provider>
  );
}

export function useLivePrices() {
  return useContext(LivePricesContext);
}
